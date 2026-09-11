import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import IndividualPendingView from './components/IndividualPendingView.jsx';
import IndividualActiveView from './components/IndividualActiveView.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';

// Isolated Phase 1 Mock Data (easily replaced by useQuery in Phase 2)
import { MOCK_INDIVIDUALS, MOCK_INDIVIDUAL_TRANSACTIONS } from '../../data/mockIndividuals.js';

export default function IndividualDetails() {
  const { id } = useParams();
  const location = useLocation();

  // Find individual by ID from navigation state or fallback to mock list
  const baseIndividual = useMemo(() => {
    return (
      location.state?.individual ||
      MOCK_INDIVIDUALS.find((ind) => ind.id === id) ||
      MOCK_INDIVIDUALS[0]
    );
  }, [id, location.state]);

  const [statusOverride, setStatusOverride] = useState(null);

  const individual = useMemo(() => {
    if (!baseIndividual) return null;
    return {
      ...baseIndividual,
      status: statusOverride || baseIndividual.status || 'Pending',
    };
  }, [baseIndividual, statusOverride]);

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

    // Simulate async status transition (will be replaced with useMutation in Phase 2)
    setTimeout(() => {
      setStatusOverride(nextStatus);

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
    }, 500);
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
    } else {
      console.log('Viewing document:', doc);
    }
  };

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
          transactions={MOCK_INDIVIDUAL_TRANSACTIONS}
          onSuspend={handleOpenSuspend}
          onReactivate={handleOpenReactivate}
          onExportTransactions={() => console.log('Exporting transactions...')}
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
