import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';
import defaultProfile from '../../assets/default-profile.svg';
import AdminItem from './components/AdminItem.jsx';
import ProfileSectionHeader from './components/ProfileSectionHeader.jsx';
import ActionConfirmModal from './ActionConfirmModal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { adminService } from '../../api/services/admin.service.js';

export default function OrgProfileModal({
  isOpen = false,
  onClose,
  user: userProp,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, logout } = useAuth();
  const currentUser = userProp || authUser;

  // Action confirmation popups state (Delete Admin, Stop/Grant Permission)
  const [actionPopup, setActionPopup] = useState({
    isOpen: false,
    step: 'confirm', // 'confirm' | 'success' | 'error'
    title: '',
    message: null,
    subMessage: '',
    cancelText: 'Cancel',
    proceedText: 'Proceed',
    successButtonText: 'Thanks',
    isLoading: false,
    errorMessage: '',
    onProceed: null,
  });

  // Close on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Query referral settings / count
  const { data: referralSettings } = useQuery({
    queryKey: ['org-referral-settings'],
    queryFn: () => adminService.referrals.getSettings(),
    staleTime: 60 * 1000,
    enabled: isOpen,
    retry: false,
  });

  // Query organization admins
  const { data: adminsData, isLoading: isAdminsLoading } = useQuery({
    queryKey: ['org-admins-directory'],
    queryFn: () => adminService.manage.getAdmins({ pageNumber: 1, pageSize: 20 }),
    staleTime: 30 * 1000,
    enabled: isOpen,
    retry: false,
  });

  // Admins list
  const adminsList = useMemo(() => {
    if (adminsData?.items && Array.isArray(adminsData.items)) {
      return adminsData.items.map((a) => ({
        id: a.id,
        name: a.name || (a.email ? a.email.split('@')[0] : 'Admin User'),
        email: a.email,
        isActive: Boolean(a.isActive),
      }));
    }
    // Static fallback list matching mockup if not yet loaded or empty
    return [
      { id: 'adm-1', name: 'John Mercy', email: 'john@gmail.com', isActive: false },
      { id: 'adm-2', name: 'John Mercy', email: 'john@gmail.com', isActive: true },
      { id: 'adm-3', name: 'John Mercy', email: 'john@gmail.com', isActive: false },
      { id: 'adm-4', name: 'John Mercy', email: 'john@gmail.com', isActive: true },
    ];
  }, [adminsData]);

  const totalAdminsCount = adminsData?.totalCount != null ? adminsData.totalCount : adminsList.length;
  const commissionCount = referralSettings?.rewardAmountPerSuccessfulReferral != null
    ? String(referralSettings.rewardAmountPerSuccessfulReferral)
    : '5';

  const extractErrorMessage = (err, fallback) => {
    let msg = err?.message || fallback;
    if (err?.detail) {
      const firstLine = err.detail.split('\n')[0];
      if (firstLine.includes(': ')) {
        msg = firstLine.split(': ').slice(1).join(': ');
      } else {
        msg = firstLine;
      }
    }
    return msg || fallback;
  };

  // Delete Admin Handler
  const handleRequestDelete = (admin) => {
    const adminName = admin.name || admin.email || 'this admin';
    setActionPopup({
      isOpen: true,
      step: 'confirm',
      title: 'Delete Admin?',
      message: (
        <span>
          You are about to delete <strong className="font-bold text-primary-text">{adminName}</strong> from this organization
        </span>
      ),
      subMessage: 'Do you wish to proceed with this action?',
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Thanks',
      isLoading: false,
      errorMessage: '',
      onProceed: async () => {
        setActionPopup((prev) => ({ ...prev, isLoading: true, errorMessage: '' }));
        try {
          await adminService.manage.deleteAdmin(admin.id);
          queryClient.invalidateQueries({ queryKey: ['org-admins-directory'] });
          setActionPopup((prev) => ({
            ...prev,
            isLoading: false,
            step: 'success',
            title: 'Admin Deleted',
            message: (
              <span>
                You have Successfully deleted <strong className="font-bold text-primary-text">{adminName}</strong> from this organization
              </span>
            ),
            subMessage: '',
          }));
        } catch (err) {
          setActionPopup((prev) => ({
            ...prev,
            isLoading: false,
            errorMessage: extractErrorMessage(err, 'Failed to delete admin. Please try again.'),
          }));
        }
      },
    });
  };

  // Toggle Admin Status Handler
  const handleRequestToggle = (admin) => {
    const adminName = admin.name || admin.email || 'this admin';
    const willDeactivate = Boolean(admin.isActive);

    if (willDeactivate) {
      setActionPopup({
        isOpen: true,
        step: 'confirm',
        title: 'Stop Permission?',
        message: (
          <span>
            You are about to stop <strong className="font-bold text-primary-text">{adminName}</strong> from editing this platform
          </span>
        ),
        subMessage: 'Do you wish to proceed with this action?',
        cancelText: 'Cancel',
        proceedText: 'Proceed',
        successButtonText: 'Thanks',
        isLoading: false,
        errorMessage: '',
        onProceed: async () => {
          setActionPopup((prev) => ({ ...prev, isLoading: true, errorMessage: '' }));
          try {
            await adminService.manage.toggleStatus({
              adminProfileId: admin.id,
              isActive: false,
            });
            queryClient.invalidateQueries({ queryKey: ['org-admins-directory'] });
            setActionPopup((prev) => ({
              ...prev,
              isLoading: false,
              step: 'success',
              title: 'Permission Stopped',
              message: (
                <span>
                  You have Successfully stopped <strong className="font-bold text-primary-text">{adminName}</strong> from editing on this platform
                </span>
              ),
              subMessage: '',
            }));
          } catch (err) {
            setActionPopup((prev) => ({
              ...prev,
              isLoading: false,
              errorMessage: extractErrorMessage(err, 'Failed to stop admin permission.'),
            }));
          }
        },
      });
    } else {
      setActionPopup({
        isOpen: true,
        step: 'confirm',
        title: 'Grants Edit Permission?',
        message: (
          <span>
            You are about to grant <strong className="font-bold text-primary-text">{adminName}</strong> an edit permission
          </span>
        ),
        subMessage: 'Do you wish to proceed with this action?',
        cancelText: 'Cancel',
        proceedText: 'Proceed',
        successButtonText: 'Thanks',
        isLoading: false,
        errorMessage: '',
        onProceed: async () => {
          setActionPopup((prev) => ({ ...prev, isLoading: true, errorMessage: '' }));
          try {
            await adminService.manage.toggleStatus({
              adminProfileId: admin.id,
              isActive: true,
            });
            queryClient.invalidateQueries({ queryKey: ['org-admins-directory'] });
            setActionPopup((prev) => ({
              ...prev,
              isLoading: false,
              step: 'success',
              title: 'Permission Granted',
              message: (
                <span>
                  You have Successfully grant <strong className="font-bold text-primary-text">{adminName}</strong> permission to edit on this platform
                </span>
              ),
              subMessage: '',
            }));
          } catch (err) {
            setActionPopup((prev) => ({
              ...prev,
              isLoading: false,
              errorMessage: extractErrorMessage(err, 'Failed to grant edit permission.'),
            }));
          }
        },
      });
    }
  };

  const handleCloseActionPopup = () => {
    if (actionPopup.isLoading) return;
    setActionPopup((prev) => ({ ...prev, isOpen: false, errorMessage: '' }));
  };

  const handleLogout = async () => {
    onClose?.();
    await logout();
    navigate('/login');
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 left-0 max-w-full flex transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className="w-screen max-w-md sm:max-w-lg h-full bg-[#F6F5F9] flex flex-col space-y-3 p-4 sm:p-5 shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Card: Profile / Admin */}
          <ProfileSectionHeader
            title="Profile"
            value="Admin"
          />

          {/* User Identity Card */}
          <div className="bg-white rounded-xl p-5 sm:p-6 flex flex-col shadow-xs space-y-4">
            {/* Top Row: Avatar + Name + Edit Pencil */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-5">
                <div className="rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-[#C3E3BE] overflow-hidden shadow-xs shrink-0">
                  <img
                    src={currentUser?.profilePicture || defaultProfile}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-text">
                  {currentUser?.fullName || currentUser?.displayName || currentUser?.firstName || 'Tayo John'}
                </h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-primary transition-colors cursor-pointer p-1.5 self-start -mt-1"
                aria-label="Edit Profile"
              >
                <PencilIcon size={16} />
              </button>
            </div>

            {/* Bottom Details: Full-width rows with dividers */}
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 font-normal">Phone Number</span>
                <span className="font-semibold text-primary-text">
                  {currentUser?.phoneNumber || '082-484-894-84'}
                </span>
              </div>
              <div className="border-b border-slate-100" />
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 font-normal">Email Address</span>
                <span className="font-semibold text-primary-text truncate max-w-[200px] sm:max-w-[260px]">
                  {currentUser?.email || 'Mercy@gmail.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Referral Commission Section */}
          <ProfileSectionHeader
            title="Referral Commission"
            value={commissionCount}
            className="mt-1"
          />
          <div className="w-full flex justify-end pr-3">
            <Link
              to="/org/referrals"
              onClick={onClose}
              className="text-primary font-semibold text-xs sm:text-sm underline hover:opacity-80"
            >
              Set Referrals
            </Link>
          </div>

          {/* Admins Section */}
          <ProfileSectionHeader
            title="Admins"
            value={totalAdminsCount}
            className="mt-2"
          />
          <div className="w-full bg-white rounded-xl p-2 shadow-xs">
            <div className="flex flex-col space-y-1 max-h-56 sm:max-h-64 overflow-y-auto">
              {isAdminsLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading admins...</div>
              ) : adminsList.length > 0 ? (
                adminsList.map((item, index) => (
                  <AdminItem
                    key={item.id}
                    admin={item}
                    isLast={index === adminsList.length - 1}
                    onToggle={() => handleRequestToggle(item)}
                    onDelete={() => handleRequestDelete(item)}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">No admins found.</div>
              )}
            </div>
          </div>

          {/* Footer: Single Log Out Button */}
          <div className="pt-4 flex">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer select-none"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        isOpen={actionPopup.isOpen}
        onClose={handleCloseActionPopup}
        step={actionPopup.step}
        title={actionPopup.title}
        message={actionPopup.message}
        subMessage={actionPopup.subMessage}
        cancelText={actionPopup.cancelText}
        proceedText={actionPopup.proceedText}
        successButtonText={actionPopup.successButtonText}
        isLoading={actionPopup.isLoading}
        errorMessage={actionPopup.errorMessage}
        onProceed={actionPopup.onProceed}
        onSuccessClose={handleCloseActionPopup}
      />
    </div>
  );
}
