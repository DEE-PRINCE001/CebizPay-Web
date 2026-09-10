import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';
import defaultProfile from '../../assets/default-profile.svg';
import Button from '../common/Button.jsx';
import AdminItem from './components/AdminItem.jsx';
import ProfileSectionHeader from './components/ProfileSectionHeader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { adminService } from '../../api/services/admin.service.js';

const INITIAL_MOCK_USERS = [
  { id: '1', name: 'John Mercy', isActive: false },
  { id: '2', name: 'John Mercy', isActive: true },
  { id: '3', name: 'John Mercy', isActive: false },
];

const ProfileModal = ({ isOpen = false, onClose, user: userProp, platform: platformProp }) => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const currentUser = userProp || authUser;

  const [localUsers, setLocalUsers] = useState(INITIAL_MOCK_USERS);

  // Close on Escape key and prevent background scroll when open
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

  // Query live referral settings
  const { data: referralSettings } = useQuery({
    queryKey: ['admin-referral-settings'],
    queryFn: () => adminService.referrals.getSettings(),
    staleTime: 60 * 1000,
    enabled: isOpen,
    retry: false,
  });

  // Query live admin directory
  const { data: adminsData, refetch: refetchAdmins } = useQuery({
    queryKey: ['admin-directory'],
    queryFn: () => adminService.manage.getAdmins({ pageNumber: 1, pageSize: 20 }),
    staleTime: 60 * 1000,
    enabled: isOpen,
    retry: false,
  });

  // Combine live admins with fallback
  const adminsList = (adminsData?.items && adminsData.items.length > 0)
    ? adminsData.items.map((a) => ({
        id: a.id,
        name: a.email ? a.email.split('@')[0] : 'Admin User',
        email: a.email,
        isActive: Boolean(a.isActive),
        isReal: true,
      }))
    : localUsers;

  const totalAdminsCount = adminsData?.totalCount != null ? adminsData.totalCount : adminsList.length;

  const commissionDisplay = platformProp?.totalCommission
    || (referralSettings?.rewardAmountPerSuccessfulReferral != null
        ? `₦${Number(referralSettings.rewardAmountPerSuccessfulReferral).toLocaleString('en-US')}`
        : '5');

  // Toggle admin active/inactive state
  const handleToggle = async (id) => {
    const target = adminsList.find((u) => u.id === id);
    if (!target) return;

    const nextActive = !target.isActive;

    // Optimistically update local state
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: nextActive } : u))
    );

    if (target.isReal) {
      try {
        await adminService.manage.toggleStatus({
          adminProfileId: id,
          isActive: nextActive,
        });
        refetchAdmins();
      } catch (err) {
        console.error('Failed to toggle admin status:', err);
      }
    }
  };

  // Delete admin
  const handleDelete = async (id) => {
    const target = adminsList.find((u) => u.id === id);
    setLocalUsers((prev) => prev.filter((u) => u.id !== id));

    if (target?.isReal) {
      try {
        await adminService.manage.deleteAdmin(id);
        refetchAdmins();
      } catch (err) {
        console.error('Failed to delete admin:', err);
      }
    }
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

      {/* Left Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 max-w-full flex transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className="w-screen max-w-md sm:max-w-lg h-full bg-background flex flex-col space-y-2 p-4 sm:p-5 shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Card */}
          <ProfileSectionHeader
            title="Profile"
            value={currentUser?.adminProfile?.role || currentUser?.role || 'Super Admin'}
          />

        {/* User Identity Card */}
        <div className="bg-white rounded-md pt-8 sm:pt-10 pb-5 px-6 sm:px-8 flex flex-col shadow-xs">
          <div className="flex">
            <div>
              <div className="rounded-full w-28 h-28 sm:w-36 sm:h-36 bg-[#C3E3BE] overflow-hidden shadow-md">
                <img
                  src={currentUser?.profilePicture || defaultProfile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-5 sm:mt-7 leading-none text-primary-text/60 font-medium text-xs sm:text-sm">
                Phone Number
              </h3>
              <h3 className="mt-5 sm:mt-7 leading-none text-primary-text/60 font-medium text-xs sm:text-sm">
                Email
              </h3>
            </div>
            <div className="flex-1 ml-6 sm:ml-10 flex flex-col">
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Edit Profile"
                >
                  <PencilIcon size={16} />
                </button>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold mt-6 sm:mt-10 leading-none text-primary-text">
                {currentUser?.fullName || currentUser?.displayName || 'Tayo John'}
              </h3>
              <div className="flex-1 flex flex-col justify-end">
                <p className="text-xs sm:text-sm font-bold text-primary-text shadow-xs leading-none">
                  {currentUser?.phoneNumber || '07035645321'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-primary-text shadow-xs leading-none mt-5 sm:mt-7 truncate max-w-45 sm:max-w-55">
                  {currentUser?.email || 'tayo.john@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Commission Section */}
        <ProfileSectionHeader
          title="Referral Commission"
          value={commissionDisplay}
          className="mt-2"
        />
        <div className="w-full flex justify-end pr-4">
          <Link
            to="/admin/referrals"
            onClick={onClose}
            className="text-blue-600 font-bold text-xs sm:text-sm hover:underline"
          >
            Set Referrals
          </Link>
        </div>

        {/* Admins Section */}
        <ProfileSectionHeader
          title="Admins"
          value={totalAdminsCount}
          className="mt-3 sm:mt-4"
        />
        <div className="w-full bg-white rounded-md pt-5 sm:pt-6 pb-3 px-2 shadow-xs">
          <div className="flex flex-col pb-2 space-y-1 max-h-56 sm:max-h-64 overflow-y-auto">
            {adminsList.map((item, index) => (
              <AdminItem
                key={item.id}
                admin={item}
                isLast={index === adminsList.length - 1}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="w-full flex justify-end pr-4 pt-3 sm:pt-4">
            <Link
              to="/admin/manage"
              onClick={onClose}
              className="text-blue-600 text-xs sm:text-sm font-bold hover:underline"
            >
              Add New Admin
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex px-2 mt-5 sm:mt-6 justify-center space-x-3">
       
          <Button
        
            size="lg"
            className="rounded-xl text-xs sm:text-sm"
            onClick={() => {
              onClose?.();
              navigate('/dashboard-test');
            }}
          >
            Published Announcements
          </Button>
          <div className="w-[45%] sm:w-[50%]">
            <Button
              size="lg"
              className="rounded-xl text-xs sm:text-sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProfileModal;