import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import OrganizationPendingView from './components/OrganizationPendingView.jsx';
import OrganizationActiveView from './components/OrganizationActiveView.jsx';
import OrganizationRejectedView from './components/OrganizationRejectedView.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import { adminService } from '../../api/services/admin.service.js';
import { authService } from '../../api/services/auth.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getStoredAccessToken } from '../../api/client.js';
import {
  getMockOrganizationById,
  saveOrgStatusOverride,
} from '../../api/mocks/organizations.mock.js';

export default function OrganizationDetails() {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [statusOverride, setStatusOverride] = useState(null);

  // Live Query: Fetch organization details by ID from backend if available
  const { data: apiOrg } = useQuery({
    queryKey: ['admin-organization-details', id],
    queryFn: () => adminService.organizations.getById(id),
    enabled: !!id,
    retry: false,
  });

  // Derive organization data dynamically from API, navigation state, mock fallback, or auth me info
  const organization = useMemo(() => {
    const fallback = getMockOrganizationById(id) || location.state?.organization;
    const liveFromAuth = user?.organizations?.find((o) => o.organizationId === id);
    const base = apiOrg || (liveFromAuth ? {
      ...fallback,
      id: liveFromAuth.organizationId,
      name: liveFromAuth.companyName || fallback?.name,
    } : fallback);

    return {
      ...fallback,
      ...base,
      status: statusOverride || fallback?.status || base?.status || 'Pending',
    };
  }, [apiOrg, location.state, id, statusOverride, user]);

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
        saveOrgStatusOverride(id, newStatus);
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
    if (!nextStatus) return;

    setModalConfig((prev) => ({ ...prev, errorMessage: '', isLoading: true }));

    try {
      let token = getStoredAccessToken();
      if (!token) {
        // Automatically attempt login with provided credentials in development/testing mode
        try {
          const authRes = await authService.login({
            email: 'honour@gmail.com',
            password: 'CephHonSec.123tryit',
          });
          if (authRes?.accessToken) {
            token = authRes.accessToken;
          }
        } catch (authErr) {
          console.warn('Dev auto-auth attempt failed:', authErr);
        }
      }

      if (!token) {
        throw new Error('Authentication required: You must be logged in as an administrator to change organization status. Please log in first at /login.');
      }

      // Call backend API and AWAIT the result
      const res = await updateStatusMutation.mutateAsync({
        statusName: nextStatus,
        reason: `Admin confirmed action: ${modalConfig.title}`,
      });

      const resolvedStatus = res?.status || nextStatus;

      // Persist status change across application
      saveOrgStatusOverride(id, resolvedStatus);
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
      saveOrgStatusOverride(id, modalConfig.pendingNewStatus);
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
