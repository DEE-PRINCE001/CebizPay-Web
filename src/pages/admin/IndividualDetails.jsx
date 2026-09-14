import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import IndividualPendingView from './components/IndividualPendingView.jsx';
import IndividualActiveView from './components/IndividualActiveView.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import { adminService } from '../../api/services/admin.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { queryClient } from '../../lib/queryClient.js';
import { Loader2, AlertCircle } from 'lucide-react';

const KYC_STATUS_CODES = {
  Pending: 1,
  Verified: 2,
  Active: 2,
  Rejected: 3,
  Suspended: 4,
};

export default function IndividualDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [statusOverride, setStatusOverride] = useState(null);

  // Live Query: Fetch individual profile
  const {
    data: individualApiData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['admin-individual-details', id],
    queryFn: () => adminService.individuals.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch submitted KYC documents
  const { data: documentsData } = useQuery({
    queryKey: ['admin-individual-documents', id],
    queryFn: () => adminService.individuals.getDocuments(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch transactions
  const { data: transactionsData } = useQuery({
    queryKey: ['admin-individual-transactions', id],
    queryFn: () => adminService.individuals.getTransactions(id, { pageNumber: 1, pageSize: 50 }),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch wallet details
  const { data: walletData } = useQuery({
    queryKey: ['admin-individual-wallets', id],
    queryFn: () => adminService.individuals.getWallets(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch savings plans
  const { data: savingsData } = useQuery({
    queryKey: ['admin-individual-savings', id],
    queryFn: () => adminService.individuals.getSavings(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Consolidate credentials from profile or dedicated KYC documents endpoint
  const credentials = useMemo(() => {
    if (individualApiData?.credentials && individualApiData.credentials.length > 0) {
      return individualApiData.credentials.map((c, idx) => ({
        id: c.id || `cred-${idx}`,
        title: c.title || c.documentType || 'National Identity Card',
        fileUrl: c.fileUrl || c.documentUrl || '',
      }));
    }
    if (Array.isArray(documentsData) && documentsData.length > 0) {
      return documentsData.map((doc, idx) => ({
        id: doc.id || `doc-${idx}`,
        title: doc.documentType === 'Nimc' ? 'National Identity Card' : (doc.title || doc.documentType || 'Identity Document'),
        fileUrl: doc.documentUrl || doc.fileUrl || '',
      }));
    }
    return [];
  }, [individualApiData, documentsData]);

  // Transform transactions list for the transactions tab
  const transactions = useMemo(() => {
    if (transactionsData?.items && Array.isArray(transactionsData.items)) {
      return transactionsData.items.map((tx) => ({
        id: tx.id || tx.transactionId,
        userName: tx.counterpartyName || tx.userName || tx.recipientName || 'Transaction',
        avatarUrl: tx.counterpartyAvatarUrl || tx.avatarUrl || null,
        amount: tx.amount != null ? Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00',
        transactionType: tx.transactionType || tx.type || 'Send',
        receiverOrSender: tx.receiverOrSender || tx.receiverSenderId || tx.counterpartyName || 'N/A',
        method: tx.method || tx.paymentMethod || 'Wallet ID',
        accountOrWalletId: tx.accountOrWalletId || tx.accountNumber || 'N/A',
        dateTime: tx.dateTime
          ? new Date(tx.dateTime).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
          : (tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'),
        status: tx.status || 'Successfull',
      }));
    }
    return [];
  }, [transactionsData]);

  // Combine API data with navigation state fallback
  const baseIndividual = useMemo(() => {
    if (individualApiData && (individualApiData.id || individualApiData.name)) {
      return individualApiData;
    }
    if (location.state?.individual) {
      return location.state.individual;
    }
    return null;
  }, [individualApiData, location.state]);

  const individual = useMemo(() => {
    if (!baseIndividual) return null;
    return {
      ...baseIndividual,
      status: statusOverride || baseIndividual.status || 'Pending',
      credentials,
      wallet: walletData || baseIndividual.wallet || null,
      savingsPlans: savingsData?.items || baseIndividual.savingsPlans || [],
    };
  }, [baseIndividual, statusOverride, credentials, walletData, savingsData]);

  // Live Mutation: Update KYC Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ statusName, reason }) => {
      const statusCode = KYC_STATUS_CODES[statusName] ?? 2;
      const adminUserId = user?.userId || user?.id || '';
      return adminService.individuals.updateStatus(id, {
        status: statusCode,
        adminUserId,
        reason: reason || `${statusName} by admin`,
      });
    },
    onSuccess: (_, variables) => {
      setStatusOverride(variables.statusName);
      queryClient.invalidateQueries({ queryKey: ['admin-individual-details', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-individuals'] });
    },
  });

  // Modal configuration state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    step: 'confirm', // 'confirm' | 'success' | 'error'
    title: '',
    message: '',
    subMessage: '',
    showCloseButton: false,
    cancelText: 'Cancel',
    proceedText: 'Proceed',
    successButtonText: 'Okay',
    isLoading: false,
    errorMessage: '',
    pendingNewStatus: null,
    requireReason: false,
    reasonLabel: 'Reason',
    reasonPlaceholder: '',
    reason: '',
    reasonError: '',
  });

  const userName = individual?.name || 'Mike Johnson';

  // 1. Trigger Reject Modal (verify-popup.png style with reason)
  const handleOpenReject = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Reject?',
      message: `You are about to reject ${userName}`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: false,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Thanks',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Rejected',
      requireReason: true,
      reasonLabel: 'Reason for Rejection',
      reasonPlaceholder: 'Please state the reason for rejection...',
      reason: '',
      reasonError: '',
    });
  };

  // 2. Trigger Verify Modal (verify-popup.png style)
  const handleOpenVerify = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Verify?',
      message: `You are about to verify ${userName}`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: false,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Thanks',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Verified',
      requireReason: false,
      reasonLabel: 'Reason',
      reasonPlaceholder: '',
      reason: '',
      reasonError: '',
    });
  };

  // 3. Trigger Suspend Modal (verify-popup2.png style with reason)
  const handleOpenSuspend = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Suspend?',
      message: `You are about to suspend ( ${userName} ) from using this service`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: true,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Suspended',
      requireReason: true,
      reasonLabel: 'Reason for Suspension',
      reasonPlaceholder: 'Please state the reason for suspension...',
      reason: '',
      reasonError: '',
    });
  };

  // 4. Trigger Re-activate Modal (verify-popup2.png style)
  const handleOpenReactivate = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Re-Activated?',
      message: `You are about to re-activate ( ${userName} ) from using this service`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: true,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Active',
      requireReason: false,
      reasonLabel: 'Reason',
      reasonPlaceholder: '',
      reason: '',
      reasonError: '',
    });
  };

  // Handle Proceed button click in confirmation modal
  const handleProceed = async (providedReason) => {
    const nextStatus = modalConfig.pendingNewStatus;
    const effectiveReason = (
      typeof providedReason === 'string' && providedReason.length > 0
        ? providedReason
        : modalConfig.reason
    )?.trim();

    if (modalConfig.requireReason && !effectiveReason) {
      setModalConfig((prev) => ({
        ...prev,
        reasonError: 'Please provide a reason before proceeding.',
      }));
      return;
    }

    setModalConfig((prev) => ({ ...prev, errorMessage: '', isLoading: true }));

    try {
      await updateStatusMutation.mutateAsync({
        statusName: nextStatus,
        reason: effectiveReason,
      });

      let successTitle = 'Verified';
      let successMessage = `You have successfully verified ${userName}`;

      if (nextStatus === 'Rejected') {
        successTitle = 'Rejected';
        successMessage = `You have successfully rejected ${userName}`;
      } else if (nextStatus === 'Suspended') {
        successTitle = 'Successfully Suspended';
        successMessage = `( ${userName} ) has been suspended from using this service`;
      } else if (nextStatus === 'Active' || nextStatus === 'Verified') {
        successTitle = 'Successfully Re-Activated';
        successMessage = `( ${userName} ) has been re-activated and is now free to enjoy all the benefit that comes with this service`;
      }

      setModalConfig((prev) => ({
        ...prev,
        isLoading: false,
        step: 'success',
        title: successTitle,
        message: successMessage,
        subMessage: '',
      }));
    } catch (err) {
      setModalConfig((prev) => ({
        ...prev,
        isLoading: false,
        step: 'error',
        title: 'Action Failed',
        errorMessage:
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Failed to update individual status. Please try again.',
      }));
    }
  };

  const handleSuccessClose = () => {
    if (modalConfig.pendingNewStatus) {
      setStatusOverride(modalConfig.pendingNewStatus);
    }
    setModalConfig((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
      errorMessage: '',
      reason: '',
      reasonError: '',
    }));
  };

  const handleCloseModal = () => {
    if (modalConfig.isLoading) return;
    setModalConfig((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
      errorMessage: '',
      reason: '',
      reasonError: '',
    }));
  };

  const handleViewDocument = (doc) => {
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Transaction export handler
  const handleExportTransactions = () => {
    if (!transactions || transactions.length === 0) return;
    const headers = 'Transaction Type,Reciever/Sender,Method,Acct/Wallet ID,Date n Time,Status';
    const rows = transactions.map((tx) =>
      `"${tx.transactionType}","${tx.receiverOrSender}","${tx.method}","${tx.accountOrWalletId}","${tx.dateTime}","${tx.status}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${userName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isUserLoading && !individual) {
    return (
      <DashboardLayout>
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-slate-500 font-medium">Loading individual details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!individual) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto mt-12">
          <AlertCircle className="w-10 h-10 text-rejected" />
          <h2 className="text-lg font-bold text-primary-text">Individual Not Found</h2>
          <p className="text-sm text-slate-500">
            {userError?.message || 'We could not load the individual profile you requested.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/individual')}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Return to Individuals Directory
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isPending = individual?.status === 'Pending';
  const isRejected = individual?.status === 'Rejected';

  return (
    <DashboardLayout>
      {isPending || isRejected ? (
        <IndividualPendingView
          individual={individual}
          onReject={handleOpenReject}
          onVerify={handleOpenVerify}
          onViewDocument={handleViewDocument}
        />
      ) : (
        <IndividualActiveView
          individual={individual}
          transactions={transactions}
          wallet={walletData}
          savingsPlans={savingsData?.items || []}
          onSuspend={handleOpenSuspend}
          onReactivate={handleOpenReactivate}
          onExportTransactions={handleExportTransactions}
        />
      )}

      {/* Critical Action Confirmation, Loading, Error & Success Modal */}
      <ActionConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        step={modalConfig.step}
        title={modalConfig.title}
        message={modalConfig.message}
        subMessage={modalConfig.subMessage}
        showCloseButton={modalConfig.showCloseButton}
        cancelText={modalConfig.cancelText}
        proceedText={modalConfig.proceedText}
        successButtonText={modalConfig.successButtonText}
        isLoading={modalConfig.isLoading}
        errorMessage={modalConfig.errorMessage}
        requireReason={modalConfig.requireReason}
        reasonLabel={modalConfig.reasonLabel}
        reasonPlaceholder={modalConfig.reasonPlaceholder}
        reasonValue={modalConfig.reason}
        onReasonChange={(e) =>
          setModalConfig((prev) => ({
            ...prev,
            reason: e.target.value,
            reasonError: '',
          }))
        }
        reasonError={modalConfig.reasonError}
        onProceed={handleProceed}
        onSuccessClose={handleSuccessClose}
      />
    </DashboardLayout>
  );
}
