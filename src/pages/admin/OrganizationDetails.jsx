import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import OrganizationPendingView from './components/OrganizationPendingView.jsx';
import OrganizationActiveView from './components/OrganizationActiveView.jsx';
import OrganizationRejectedView from './components/OrganizationRejectedView.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import { adminService } from '../../api/services/admin.service.js';
import { getStoredAccessToken } from '../../api/client.js';
import { Loader2, AlertCircle } from 'lucide-react';

export default function OrganizationDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusOverride, setStatusOverride] = useState(null);

  // Live Query: Fetch organization details by ID from backend
  const {
    data: apiOrg,
    isLoading: isOrgLoading,
    isError: isOrgError,
    error: orgError,
  } = useQuery({
    queryKey: ['admin-organization-details', id],
    queryFn: () => adminService.organizations.getById(id),
    enabled: !!id,
    retry: false,
  });

  // Derive organization data dynamically from live API query or navigation state
  const organization = useMemo(() => {
    const base = apiOrg || location.state?.organization;
    if (!base) return null;
    return {
      ...base,
      status: statusOverride || base.status || 'Pending',
    };
  }, [apiOrg, location.state, statusOverride]);

  // Live Mutation: Update Organization Status (Admin lifecycle transition)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ statusName, reason }) => {
      // Real backend C# enum (OrganizationStatus: Pending=1, Verified/Active=2, Rejected=3, Suspended=4)
      const statusMap = {
        Pending: 1,
        Verified: 2,
        Active: 2,
        Rejected: 3,
        Suspended: 4,
      };
      const statusCode = statusMap[statusName] ?? 2;

      const res = await adminService.organizations.updateStatus(id, {
        status: statusCode,
        reason: reason || `Status updated to ${statusName} by admin`,
      });
      return res;
    },
    onSuccess: (data, variables) => {
      const newStatus = data?.status || variables.statusName;
      if (newStatus) {
        setStatusOverride(newStatus);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-organization-details', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
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
  });

  const orgDisplayName = organization?.name || 'Organization';

  // 1. Trigger Reject Modal (verify-popup.png)
  const handleOpenReject = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Reject?',
      message: `You are about to reject ${orgDisplayName}`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: false,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Thanks',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Rejected',
    });
  };

  // 2. Trigger Verify Modal (verify-popup.png)
  const handleOpenVerify = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Verify?',
      message: `You are about to verify ${orgDisplayName}`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: false,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Thanks',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Verified',
    });
  };

  // 3. Trigger Suspend Modal (verify-popup2.png)
  const handleOpenSuspend = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Suspend?',
      message: `You are about to suspend ( ${orgDisplayName} ) from using this service`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: true,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Suspended',
    });
  };

  // 4. Trigger Re-activate Modal (verify-popup2.png)
  const handleOpenReactivate = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Re-Activated?',
      message: `You are about to re-activate ( ${orgDisplayName} ) from using this service`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: true,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Verified',
    });
  };

  // 5. Trigger Review Modal (Move Rejected back to Pending)
  const handleReview = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Review Organization?',
      message: `You are about to re-open ( ${orgDisplayName} ) for review and move its status back to Pending`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: true,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      isLoading: false,
      errorMessage: '',
      pendingNewStatus: 'Pending',
    });
  };

  // When clicking Proceed in confirmation dialog, call backend API live & wait for response
  const handleProceed = async () => {
    const nextStatus = modalConfig.pendingNewStatus;
    setModalConfig((prev) => ({ ...prev, errorMessage: '', isLoading: true }));

    try {
      const token = getStoredAccessToken();
      if (!token) {
        throw new Error('Authentication required: You must be logged in as an administrator to change organization status. Please log in first at /login.');
      }

      // Call backend API and AWAIT the result
      const res = await updateStatusMutation.mutateAsync({
        statusName: nextStatus,
        reason: `Admin confirmed action: ${modalConfig.title}`,
      });

      const resolvedStatus = res?.status || nextStatus;

      // Update reactive status override
      setStatusOverride(resolvedStatus);

      // Transition to success screen
      let successTitle = 'Verified';
      let successMessage = `You have successfully verified ${orgDisplayName}`;

      if (nextStatus === 'Rejected') {
        successTitle = 'Rejected';
        successMessage = `You have successfully rejected ${orgDisplayName}`;
      } else if (nextStatus === 'Suspended') {
        successTitle = 'Successfully Suspended';
        successMessage = `( ${orgDisplayName} ) has been suspended from using this service`;
      } else if (nextStatus === 'Verified' && (modalConfig.title.includes('Re-Activat') || organization?.status === 'Suspended')) {
        successTitle = 'Successfully Re-Activated';
        successMessage = `( ${orgDisplayName} ) has been re-activated and is now free to enjoy all the benefit that comes with this service`;
      } else if (nextStatus === 'Pending') {
        successTitle = 'Review Re-opened';
        successMessage = `( ${orgDisplayName} ) has been re-opened and moved back to Pending for review`;
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
      console.error('Status update mutation failed:', err);
      let friendlyMsg = 'An unexpected error occurred while communicating with the server. Please try again.';

      if (err?.isAuthError || err?.status === 401 || err?.status === 403 || err?.message?.includes('Authentication required')) {
        friendlyMsg = 'Authentication required: Your session has expired or you do not have permission. Please log in as an administrator.';
      } else if (err?.detail && err?.detail.includes('Invalid organization status transition')) {
        friendlyMsg = `Invalid Status Transition: The organization is currently in '${organization?.status}' status and cannot be transitioned to '${nextStatus}'.`;
      } else if (err?.message && !err?.message.includes('[object Object]')) {
        friendlyMsg = err.message;
      }

      setModalConfig((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: friendlyMsg,
      }));
    }
  };

  // When clicking Thanks / Okay on the success dialog, update status & close modal
  const handleSuccessClose = () => {
    if (modalConfig.pendingNewStatus) {
      setStatusOverride(modalConfig.pendingNewStatus);
    }
    setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false, errorMessage: '' }));
  };

  const handleCloseModal = () => {
    if (modalConfig.isLoading) return; // Prevent closing while in flight
    setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false, errorMessage: '' }));
  };

  // Open credential document in viewer or trigger download
  const handleViewDocument = (doc) => {
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Viewing credential document:', doc);
    }
  };

  if (isOrgLoading && !organization) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-500">Loading organisation details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isOrgError && !organization) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6">
          <div className="w-12 h-12 rounded-full bg-rejected/15 flex items-center justify-center text-rejected mb-2">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-primary-text">Organisation Not Found</h2>
          <p className="text-sm text-slate-500 max-w-md">
            {orgError?.message || 'Unable to retrieve the requested organisation from the server. Please check your connection or sign in.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/organization')}
            className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
          >
            Back to Organisations
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isPending = organization?.status === 'Pending';
  const isRejected = organization?.status === 'Rejected';

  return (
    <DashboardLayout>
      {isPending ? (
        <OrganizationPendingView
          organization={organization}
          onReject={handleOpenReject}
          onVerify={handleOpenVerify}
          onViewDocument={handleViewDocument}
        />
      ) : isRejected ? (
        <OrganizationRejectedView
          organization={organization}
          onReview={handleReview}
          onViewDocument={handleViewDocument}
        />
      ) : (
        <OrganizationActiveView
          organization={organization}
          onSuspend={handleOpenSuspend}
          onReactivate={handleOpenReactivate}
          onPayrollSection={() => {
            console.log('Navigating to payroll section...');
          }}
          onViewStaff={(staff) => {
            console.log('Viewing staff member:', staff);
          }}
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
        onProceed={handleProceed}
        onSuccessClose={handleSuccessClose}
      />
    </DashboardLayout>
  );
}
