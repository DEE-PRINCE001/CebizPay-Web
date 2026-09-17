import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import SettingsActionCard, { SettingsActionItem } from '../../components/cards/SettingsActionCard.jsx';
import CreateJobOfferModal from '../../components/modals/CreateJobOfferModal.jsx';
import CreateTenantAnnouncementModal from '../../components/modals/CreateTenantAnnouncementModal.jsx';
import CreateSavingPlanModal from '../../components/modals/CreateSavingPlanModal.jsx';
import CreateLoanPlanModal from '../../components/modals/CreateLoanPlanModal.jsx';
import AnnouncementsModal from '../../components/modals/AnnouncementsModal.jsx';
import AddMoneyCardModal from '../../components/modals/wallet/AddMoneyCardModal.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import logo from '../../assets/logo.jpg';
import { useAuth } from '../../hooks/useAuth.js';
import { recruitmentService } from '../../api/services/recruitment.service.js';
import { userService } from '../../api/services/user.service.js';
import { authService } from '../../api/services/auth.service.js';

export default function OrgSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, activeOrg } = useAuth();

  // Modal display states
  const [isJobOfferOpen, setIsJobOfferOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isSavingPlanOpen, setIsSavingPlanOpen] = useState(false);
  const [isLoanPlanOpen, setIsLoanPlanOpen] = useState(false);
  const [isAnnouncementsListOpen, setIsAnnouncementsListOpen] = useState(false);
  const [isManageCardsOpen, setIsManageCardsOpen] = useState(false);

  // Success / Feedback Dialog state
  const [feedbackPopup, setFeedbackPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  // Fetch full organization profile details
  const { data: profileData } = useQuery({
    queryKey: ['org-settings-profile'],
    queryFn: () => authService.getMe(),
    staleTime: 60 * 1000,
    retry: false,
  });

  const orgProfile = profileData?.activeOrganization || activeOrg || user?.organizations?.[0] || null;
  const companyName = orgProfile?.name || orgProfile?.organizationName || 'Cebiz Company';
  const companyEmail = orgProfile?.email || user?.email || 'Cebiz@gmail.com';
  const companyPhone = orgProfile?.phoneNumber || user?.phoneNumber || '08164045807';
  const companyLogo = orgProfile?.logoUrl || logo;
  const cacDocumentUrl = orgProfile?.cacCertificateUrl || null;

  // 1. Create Job Offer Mutation
  const jobOfferMutation = useMutation({
    mutationFn: (payload) => recruitmentService.org.createJob(payload),
    onSuccess: (data, variables) => {
      setIsJobOfferOpen(false);
      queryClient.invalidateQueries({ queryKey: ['org-recruitment-jobs'] });
      setFeedbackPopup({
        isOpen: true,
        title: 'Job Offer Published',
        message: `Successfully published job offer: "${variables.title}"`,
      });
    },
    onError: (err) => {
      console.error('Job offer submission error:', err);
    },
  });

  // 2. Create Announcement Mutation
  const announcementMutation = useMutation({
    mutationFn: (payload) =>
      userService.createAnnouncement({
        title: payload.title,
        description: payload.description,
        bannerUrl: payload.bannerUrl,
        scope: 2, // Workplace / Organization scope
        publishImmediately: true,
      }),
    onSuccess: (data, variables) => {
      setIsAnnouncementOpen(false);
      queryClient.invalidateQueries({ queryKey: ['all-platform-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['platform-announcements'] });
      setFeedbackPopup({
        isOpen: true,
        title: 'Announcement Published',
        message: `Successfully published: "${variables.title}"`,
      });
    },
    onError: (err) => {
      console.error('Announcement creation error:', err);
    },
  });

  // 3. Create Saving Plan Mutation
  const savingPlanMutation = useMutation({
    mutationFn: async (payload) => {
      // Mock / API call to create savings plan
      return payload;
    },
    onSuccess: (data, variables) => {
      setIsSavingPlanOpen(false);
      setFeedbackPopup({
        isOpen: true,
        title: 'Saving Plan Created',
        message: `Successfully created saving plan: "${variables.name}"`,
      });
    },
  });

  // 4. Create Loan Plan Mutation
  const loanPlanMutation = useMutation({
    mutationFn: async (payload) => {
      // Mock / API call to create corporate loan plan
      return payload;
    },
    onSuccess: (data, variables) => {
      setIsLoanPlanOpen(false);
      setFeedbackPopup({
        isOpen: true,
        title: 'Loan Plan Created',
        message: `Successfully created loan plan: "${variables.name}"`,
      });
    },
  });

  const handleViewCac = () => {
    if (cacDocumentUrl) {
      window.open(cacDocumentUrl, '_blank', 'noopener,noreferrer');
    } else {
      setFeedbackPopup({
        isOpen: true,
        title: 'CAC Document',
        message: 'CAC certificate is verified and active on your organization compliance profile.',
      });
    }
  };

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6 sm:space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-text">
            Profile
          </h1>
        </div>

        {/* 1. Top Organization Identity Card matching SettingPage.png */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex items-center space-x-6 sm:space-x-8">
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl bg-primary-text flex items-center justify-center p-3 shadow-xs shrink-0 overflow-hidden">
            <img
              src={companyLogo}
              alt={companyName}
              className="w-full h-full object-contain filter brightness-110"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-text tracking-tight">
              {companyName}
            </h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Status
              </span>
              <span className="text-xs sm:text-sm font-bold text-active">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* 2. Contact & Documents Card matching SettingPage.png */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
          <div>
            <span className="block text-xs font-semibold text-emerald-800/80 mb-1.5">
              Email Address
            </span>
            <span className="block text-sm sm:text-base font-bold text-primary-text truncate">
              {companyEmail}
            </span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-emerald-800/80 mb-1.5">
              Phone Number
            </span>
            <span className="block text-sm sm:text-base font-bold text-primary-text">
              {companyPhone}
            </span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-emerald-800/80 mb-1.5">
              CAC Documents
            </span>
            <button
              type="button"
              onClick={handleViewCac}
              className="text-sm sm:text-base font-bold text-primary underline hover:text-primary/80 transition-colors cursor-pointer self-start"
            >
              View
            </button>
          </div>
        </div>

        {/* 3. Settings Management Group 1: Job Offers, Announcements, Saving Plans, Manage Cards */}
        <SettingsActionCard>
          <SettingsActionItem
            title="Job Offers"
            onView={() => navigate('/org/recruitment')}
            onAdd={() => setIsJobOfferOpen(true)}
          />
          <SettingsActionItem
            title="Announcements"
            onView={() => setIsAnnouncementsListOpen(true)}
            onAdd={() => setIsAnnouncementOpen(true)}
          />
          <SettingsActionItem
            title="Saving Plans"
            onView={() => navigate('/org/savings')}
            onAdd={() => setIsSavingPlanOpen(true)}
          />
          <SettingsActionItem
            title="Manage Cards"
            onView={() => setIsManageCardsOpen(true)}
            onAdd={() => setIsManageCardsOpen(true)}
          />
        </SettingsActionCard>

        {/* 4. Settings Management Group 2: Loans */}
        <SettingsActionCard>
          <SettingsActionItem
            title="Loans"
            onView={() => navigate('/org/loans')}
            onAdd={() => setIsLoanPlanOpen(true)}
          />
        </SettingsActionCard>

        {/* 5. Settings Management Group 3: Loans Request */}
        <SettingsActionCard>
          <SettingsActionItem
            title="Loans Request"
            showAdd={false}
            onView={() => navigate('/org/loans/requests')}
          />
        </SettingsActionCard>
      </div>

      {/* Creation Modals */}
      <CreateJobOfferModal
        isOpen={isJobOfferOpen}
        onClose={() => setIsJobOfferOpen(false)}
        onSubmit={(payload) => jobOfferMutation.mutate(payload)}
        isLoading={jobOfferMutation.isPending}
      />

      <CreateTenantAnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onSubmit={(payload) => announcementMutation.mutate(payload)}
        isLoading={announcementMutation.isPending}
      />

      <CreateSavingPlanModal
        isOpen={isSavingPlanOpen}
        onClose={() => setIsSavingPlanOpen(false)}
        onSubmit={(payload) => savingPlanMutation.mutate(payload)}
        isLoading={savingPlanMutation.isPending}
      />

      <CreateLoanPlanModal
        isOpen={isLoanPlanOpen}
        onClose={() => setIsLoanPlanOpen(false)}
        onSubmit={(payload) => loanPlanMutation.mutate(payload)}
        isLoading={loanPlanMutation.isPending}
      />

      {/* View Modals */}
      <AnnouncementsModal
        isOpen={isAnnouncementsListOpen}
        onClose={() => setIsAnnouncementsListOpen(false)}
      />

      <AddMoneyCardModal
        isOpen={isManageCardsOpen}
        onClose={() => setIsManageCardsOpen(false)}
        onProceed={() => setIsManageCardsOpen(false)}
      />

      {/* Action Success Popup */}
      <ActionConfirmModal
        isOpen={feedbackPopup.isOpen}
        onClose={() => setFeedbackPopup({ isOpen: false, title: '', message: '' })}
        step="success"
        title={feedbackPopup.title}
        message={feedbackPopup.message}
        successButtonText="Done"
        onSuccessClose={() => setFeedbackPopup({ isOpen: false, title: '', message: '' })}
      />
    </OrgDashboardLayout>
  );
}
