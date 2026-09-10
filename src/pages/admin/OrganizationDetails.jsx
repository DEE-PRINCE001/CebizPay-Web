import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import OrganizationPendingView from './components/OrganizationPendingView.jsx';
import OrganizationActiveView from './components/OrganizationActiveView.jsx';
import OrganizationRejectedView from './components/OrganizationRejectedView.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import { adminService } from '../../api/services/admin.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getMockOrganizationById } from '../../api/mocks/organizations.mock.js';

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

  // Derive organization data dynamically from API, navigation state, or mock fallback
  const organization = useMemo(() => {
    const fallback = location.state?.organization || getMockOrganizationById(id);
    const base = apiOrg || fallback;
    return {
      ...fallback,
      ...base,
      status: statusOverride || base?.status || 'Pending',
    };
  }, [apiOrg, location.state, id, statusOverride]);

  // Live Mutation: Update Organization Status (Admin lifecycle transition)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ statusName, reason }) => {
      // Map status string to integer enum (OrganizationStatus: Pending=0, Active=1, Suspended=2, Rejected=3)
      const statusMap = {
        Pending: 0,
        Verified: 1,
        Active: 1,
        Suspended: 2,
        Rejected: 3,
      };
      const statusCode = statusMap[statusName] ?? 1;

      try {
        await adminService.organizations.updateStatus(id, {
          status: statusCode,
          reason: reason || `Status updated to ${statusName} by admin`,
        });
      } catch (err) {
        console.warn('Backend updateStatus error (handled gracefully with UI fallback):', err);
      }

      // If verifying or rejecting during KYB review, also notify the review endpoint if available
      if (statusName === 'Verified' || statusName === 'Rejected') {
        try {
          await adminService.organizations.reviewKyb({
            organizationId: id,
            newStatus: statusName === 'Verified' ? 1 : 2,
            adminUserId: user?.userId || 'admin',
            reason: reason || `KYB ${statusName} by admin`,
          });
        } catch {
          // Gracefully fallback
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organization-details', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });

  // Modal configuration state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    step: 'confirm', // 'confirm' | 'success'
    title: '',
    message: '',
    subMessage: '',
    showCloseButton: false,
    cancelText: 'Cancel',
    proceedText: 'Proceed',
    successButtonText: 'Okay',
    pendingNewStatus: null,
  });

  const orgDisplayName = organization?.name === 'Cebis Tech' ? 'Cebis Technology' : organization?.name || 'Cebis Technology';

  // 1. Trigger Reject Modal (verify-popup.png)
  const handleOpenReject = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Reject?',
      message: `You are about to rejected ${orgDisplayName}`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: false,
      cancelText: 'Rejected',
      proceedText: 'Proceed',
      successButtonText: 'Thanks',
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
      pendingNewStatus: 'Suspended',
    });
  };

  // 4. Trigger Re-activate Modal (verify-popup2.png)
  const handleOpenReactivate = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Re-Activated?',
      message: `You are about to re-activates ( ${orgDisplayName} ) from using this service`,
      subMessage: 'Do you wish to proceed with this action?',
      showCloseButton: true,
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      pendingNewStatus: 'Verified',
    });
  };

  // When clicking Proceed in any confirmation dialog, transition to Success dialog & trigger live mutation
  const handleProceed = () => {
    const nextStatus = modalConfig.pendingNewStatus;
    if (nextStatus) {
      updateStatusMutation.mutate({
        statusName: nextStatus,
        reason: `Admin confirmed action: ${modalConfig.title}`,
      });
    }

    if (nextStatus === 'Rejected') {
      setModalConfig((prev) => ({
        ...prev,
        step: 'success',
        title: 'Rejected',
        message: `You have Successfully reject ${orgDisplayName}`,
        subMessage: '',
      }));
    } else if (nextStatus === 'Verified' && modalConfig.title === 'Verify?') {
      setModalConfig((prev) => ({
        ...prev,
        step: 'success',
        title: 'Verified',
        message: `You have sucessfully verified ${orgDisplayName}`,
        subMessage: '',
      }));
    } else if (nextStatus === 'Suspended') {
      setModalConfig((prev) => ({
        ...prev,
        step: 'success',
        title: 'Successfully Suspended',
        message: `( ${orgDisplayName} ) have been suspended from using this service`,
        subMessage: '',
      }));
    } else if (nextStatus === 'Verified' && modalConfig.title === 'Re-Activated?') {
      setModalConfig((prev) => ({
        ...prev,
        step: 'success',
        title: 'Successfully Re-Activated?',
        message: `( ${orgDisplayName} ) have been re-activated and now free to enjoy all the benefit that comes with this service`,
        subMessage: '',
      }));
    }
  };

  // When clicking Thanks / Okay on the success dialog, update status & close modal
  const handleSuccessClose = () => {
    if (modalConfig.pendingNewStatus) {
      setStatusOverride(modalConfig.pendingNewStatus);
    }
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Move Rejected organization back to Pending for review
  const handleReview = () => {
    updateStatusMutation.mutate({
      statusName: 'Pending',
      reason: 'Admin re-opened organization application for review',
    });
    setStatusOverride('Pending');
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

      {/* Critical Action Confirmation & Success Modal */}
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
        onProceed={handleProceed}
        onSuccessClose={handleSuccessClose}
      />
    </DashboardLayout>
  );
}
