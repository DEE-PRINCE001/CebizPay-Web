import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import Button from '../common/Button';
import {
  Bell,
  LayoutDashboard,
  UsersRound,
  Wallet,
  Settings,
  Landmark,
  UserPlus,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import OrgProfileModal from '../modals/OrgProfileModal.jsx';
import AnnouncementsModal from '../modals/AnnouncementsModal.jsx';
import FinanceDropdown from './FinanceDropdown.jsx';
import PayrollDropdown from './PayrollDropdown.jsx';
import DepartmentLevelFlyout from './DepartmentLevelFlyout.jsx';
import CreateDepartmentModal from '../modals/organization/CreateDepartmentModal.jsx';
import ManageDepartmentsModal from '../modals/organization/ManageDepartmentsModal.jsx';
import ManageLevelsModal from '../modals/organization/ManageLevelsModal.jsx';
import CreateLevelModal from '../modals/organization/CreateLevelModal.jsx';

const ORG_NAV_ITEMS = [
  { to: '/org/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/org/members', label: 'Members', icon: UsersRound },
  { to: '/org/wallet', label: 'Wallet', icon: Wallet },
  { to: '/org/settings', label: 'Settings', icon: Settings },
  { to: '/org/finance', label: 'Finance', icon: Landmark, isDropdown: true },
  { to: '/org/invite', label: 'Invite users', icon: UserPlus },
];

export default function OrgNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isPayrollOpen, setIsPayrollOpen] = useState(false);
  const [flyoutType, setFlyoutType] = useState(null);

  // Department & Level modals state
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [isManageDeptsOpen, setIsManageDeptsOpen] = useState(false);
  const [isManageLevelsOpen, setIsManageLevelsOpen] = useState(false);
  const [isCreateLevelOpen, setIsCreateLevelOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'Tayo';

  const isPayrollActive = location.pathname.startsWith('/org/payroll');
  const isFinanceActive =
    isPayrollActive ||
    location.pathname.startsWith('/org/inventory') ||
    location.pathname.startsWith('/org/invoices') ||
    location.pathname.startsWith('/org/vouchers');

  // Listen for global payroll dropdown toggle (e.g. from page "Payrolls" button)
  useEffect(() => {
    const handleToggle = () => {
      setIsPayrollOpen((prev) => !prev);
    };
    window.addEventListener('toggle-payroll-menu', handleToggle);
    return () => window.removeEventListener('toggle-payroll-menu', handleToggle);
  }, []);

  // Listen for modal opening requests
  useEffect(() => {
    const handleOpenModal = (e) => {
      const modal = e.detail?.modal;
      if (modal === 'create-departments') {
        setEditingDepartment(null);
        setIsCreateDeptOpen(true);
      } else if (modal === 'manage-departments') {
        setIsManageDeptsOpen(true);
      } else if (modal === 'manage-levels') {
        setIsManageLevelsOpen(true);
      } else if (modal === 'create-level') {
        setEditingLevel(null);
        setIsCreateLevelOpen(true);
      }
    };
    window.addEventListener('open-org-modal', handleOpenModal);
    return () => window.removeEventListener('open-org-modal', handleOpenModal);
  }, []);

  const handlePayrollSelect = (option) => {
    if (option.isFlyout) {
      setFlyoutType(option.id);
    } else if (option.path) {
      setIsPayrollOpen(false);
      setFlyoutType(null);
      navigate(option.path);
    }
  };

  const handleFlyoutAction = (action) => {
    setFlyoutType(null);
    setIsPayrollOpen(false);
    if (action === 'create-departments') {
      setEditingDepartment(null);
      setIsCreateDeptOpen(true);
    } else if (action === 'manage-departments') {
      setIsManageDeptsOpen(true);
    } else if (action === 'manage-levels') {
      setIsManageLevelsOpen(true);
    }
  };

  return (
    <header className="w-full flex flex-col">
      <div className="flex items-center justify-between xl:gap-x-6 w-full">
        {/* Brand Logo & Greeting Card */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-xs">
            <img src={logo} alt="CebizPay" className="w-full h-full object-cover" />
          </div>

          <div
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="bg-white rounded-2xl py-2.5 px-4 sm:py-3 sm:px-5 flex items-center justify-center space-x-3 sm:space-x-4 shadow-xs border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors select-none"
            role="button"
            tabIndex={0}
            aria-label="Toggle user profile"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsProfileOpen((prev) => !prev);
              }
            }}
          >
            <p className="font-bold text-primary-text text-xs sm:text-sm">Hello {displayName}</p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-[#C3E3BE]/40">
              <img src={logo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links & Notification */}
        <div className="hidden xl:flex flex-1 ml-4 items-center bg-white rounded-2xl px-3 py-2 justify-between border border-slate-100 shadow-xs">
          <nav className="flex items-center space-x-2.5" aria-label="Organization Main Navigation">
            {ORG_NAV_ITEMS.map((item) =>
              item.isDropdown ? (
                <div key={item.label} className="relative inline-flex">
                  <Button
                    icon={item.icon}
                    size="md"
                    variant={isFinanceActive ? 'primaryLink' : 'outline'}
                    onClick={() => {
                      if (isPayrollActive) {
                        setIsPayrollOpen((prev) => !prev);
                        setIsFinanceOpen(false);
                      } else {
                        setIsFinanceOpen((prev) => !prev);
                        setIsPayrollOpen(false);
                      }
                    }}
                    className="w-auto px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                    aria-haspopup="menu"
                    aria-expanded={isPayrollActive ? isPayrollOpen : isFinanceOpen}
                  >
                    <span>{isPayrollActive ? 'Payroll' : item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  </Button>

                  {isPayrollActive ? (
                    <>
                      <PayrollDropdown
                        isOpen={isPayrollOpen}
                        onClose={() => {
                          setIsPayrollOpen(false);
                          setFlyoutType(null);
                        }}
                        selectedId={
                          location.pathname === '/org/payroll/schedules'
                            ? 'schedule'
                            : location.pathname === '/org/payroll/history'
                            ? 'history'
                            : 'analytics'
                        }
                        onSelectOption={handlePayrollSelect}
                      />
                      <DepartmentLevelFlyout
                        isOpen={!!flyoutType}
                        type={flyoutType || 'departments'}
                        onClose={() => setFlyoutType(null)}
                        onAction={handleFlyoutAction}
                      />
                    </>
                  ) : (
                    <FinanceDropdown
                      isOpen={isFinanceOpen}
                      onClose={() => setIsFinanceOpen(false)}
                    />
                  )}
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} className="inline-flex">
                  {({ isActive }) => (
                    <Button
                      as="span"
                      icon={item.icon}
                      size="md"
                      variant={isActive ? 'primaryLink' : 'outline'}
                      className="w-auto px-4 py-2 text-xs sm:text-sm"
                    >
                      {item.label}
                    </Button>
                  )}
                </NavLink>
              )
            )}
          </nav>

          <button
            type="button"
            onClick={() => setIsAnnouncementsOpen(true)}
            className="rounded-full p-2.5 border hover:bg-primary/10 border-slate-200 text-slate-500 hover:text-primary cursor-pointer transition-colors"
            aria-label="View announcements"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile / Tablet Actions: Bell + Menu Toggle */}
        <div className="flex xl:hidden items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => setIsAnnouncementsOpen(true)}
            className="rounded-full p-2.5 border bg-white hover:bg-primary/10 border-slate-200 text-slate-500 hover:text-primary cursor-pointer transition-colors shadow-xs"
            aria-label="View announcements"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-2xl p-2.5 bg-white border border-slate-200 text-primary hover:bg-slate-50 cursor-pointer focus:outline-none shadow-xs"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <nav
          className="xl:hidden w-full bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex flex-col space-y-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-150"
          aria-label="Mobile Navigation"
        >
          {ORG_NAV_ITEMS.map((item) =>
            item.isDropdown ? (
              <div key={item.label} className="w-full flex flex-col space-y-1">
                <Button
                  icon={item.icon}
                  size="md"
                  variant={isFinanceActive ? 'primaryLink' : 'outline'}
                  onClick={() => setIsFinanceOpen((prev) => !prev)}
                  className="w-full justify-between px-4"
                >
                  <span className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{isPayrollActive ? 'Payroll' : item.label}</span>
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {isFinanceOpen && (
                  <div className="pl-6 flex flex-col space-y-1.5 py-1.5 border-l-2 border-primary/20 ml-4">
                    {isPayrollActive ? (
                      <>
                        <NavLink
                          to="/org/payroll"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • Analytics
                        </NavLink>
                        <NavLink
                          to="/org/payroll/schedules"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • Schedule
                        </NavLink>
                        <NavLink
                          to="/org/payroll/history"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • History
                        </NavLink>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/org/payroll"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • Payroll
                        </NavLink>
                        <NavLink
                          to="/org/inventory"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • Inventory
                        </NavLink>
                        <NavLink
                          to="/org/invoices"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • Invoice
                        </NavLink>
                        <NavLink
                          to="/org/vouchers"
                          onClick={() => {
                            setIsFinanceOpen(false);
                            setMobileOpen(false);
                          }}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                        >
                          • Voucher
                        </NavLink>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex"
              >
                {({ isActive }) => (
                  <Button
                    as="span"
                    icon={item.icon}
                    size="md"
                    variant={isActive ? 'primaryLink' : 'outline'}
                    className="w-full justify-start px-4"
                  >
                    {item.label}
                  </Button>
                )}
              </NavLink>
            )
          )}
        </nav>
      )}

      {/* Profile Modal Drawer */}
      <OrgProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
      />

      {/* Organization Departments & Levels Modals */}
      <CreateDepartmentModal
        key={isCreateDeptOpen ? `dept-${editingDepartment?.id || 'new'}` : 'dept-closed'}
        isOpen={isCreateDeptOpen}
        initialData={editingDepartment}
        onClose={() => {
          setIsCreateDeptOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={(dept) => {
          console.log('Saved department:', dept);
        }}
      />

      <ManageDepartmentsModal
        key={isManageDeptsOpen ? 'manage-depts-open' : 'manage-depts-closed'}
        isOpen={isManageDeptsOpen}
        onClose={() => setIsManageDeptsOpen(false)}
        onEditDepartment={(dept) => {
          setIsManageDeptsOpen(false);
          setEditingDepartment(dept);
          setIsCreateDeptOpen(true);
        }}
        onRemoveDepartment={(deptId) => {
          console.log('Removed department:', deptId);
        }}
      />

      <ManageLevelsModal
        key={isManageLevelsOpen ? 'manage-levels-open' : 'manage-levels-closed'}
        isOpen={isManageLevelsOpen}
        onClose={() => setIsManageLevelsOpen(false)}
        onCreateLevel={() => {
          setIsManageLevelsOpen(false);
          setEditingLevel(null);
          setIsCreateLevelOpen(true);
        }}
        onEditLevel={(lvl) => {
          setIsManageLevelsOpen(false);
          setEditingLevel(lvl);
          setIsCreateLevelOpen(true);
        }}
      />

      <CreateLevelModal
        key={isCreateLevelOpen ? `lvl-${editingLevel?.id || 'new'}` : 'lvl-closed'}
        isOpen={isCreateLevelOpen}
        initialData={editingLevel}
        onClose={() => {
          setIsCreateLevelOpen(false);
          setEditingLevel(null);
        }}
        onSubmit={(lvl) => {
          console.log('Saved level:', lvl);
        }}
      />
    </header>
  );
}
