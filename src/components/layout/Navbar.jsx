import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import Button from '../common/Button';
import { Bell, Coins, LayoutDashboard, User, UsersRound, Wallet, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import ProfileModal from '../modals/ProfileModal.jsx';
import AnnouncementsModal from '../modals/AnnouncementsModal.jsx';
import WalletDropdown from './WalletDropdown.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/organization', label: 'Organization', icon: UsersRound },
  { to: '/individual', label: 'Individual', icon: User },
  { to: '/wallets', label: 'Wallets', icon: Wallet, isDropdown: true },
  { to: '/saving-plan', label: 'Saving Plan', icon: Coins },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'Tayo';

  const isWalletActive =
    location.pathname.startsWith('/wallets') ||
    location.pathname.startsWith('/wallet');

  return (
    <header className="w-full flex flex-col">
      <div className="flex items-center justify-between xl:gap-x-7 w-full">
        {/* Brand Logo & Greeting Card */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full overflow-hidden shrink-0">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <div
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="bg-white rounded-xl py-3 px-4 sm:py-4 sm:px-5 flex items-center justify-center space-x-3 sm:space-x-5 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors select-none"
            role="button"
            tabIndex={0}
            aria-label="Toggle user profile"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsProfileOpen((prev) => !prev);
              }
            }}
          >
            <p className="font-bold text-primary-text text-sm sm:text-base">Hello {displayName}</p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100">
              <img src={logo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links & Notification */}
        <div className="hidden xl:flex flex-1 ml-5 items-center bg-white rounded-xl px-3 py-2 justify-between">
          <nav className="flex space-x-3" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) =>
              item.isDropdown ? (
                <div key={item.label} className="relative inline-flex">
                  <Button
                    icon={item.icon}
                    size="lg"
                    variant={isWalletActive ? 'primaryLink' : 'outline'}
                    onClick={() => setIsWalletOpen((prev) => !prev)}
                    aria-haspopup="dialog"
                    aria-expanded={isWalletOpen}
                  >
                    {item.label}
                  </Button>
                  <WalletDropdown
                    isOpen={isWalletOpen}
                    onClose={() => setIsWalletOpen(false)}
                  />
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} className="inline-flex">
                  {({ isActive }) => (
                    <Button
                      as="span"
                      icon={item.icon}
                      size="lg"
                      variant={isActive ? 'primaryLink' : 'outline'}
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
            className="rounded-full p-2 border hover:bg-primary/20 border-primary/30 cursor-pointer transition-colors"
            aria-label="View announcements"
          >
            <Bell className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Mobile / Tablet Actions: Bell + Menu Toggle */}
        <div className="flex xl:hidden items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => setIsAnnouncementsOpen(true)}
            className="rounded-full p-2 border hover:bg-primary/20 border-primary/30 cursor-pointer transition-colors"
            aria-label="View announcements"
          >
            <Bell className="w-5 h-5 text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-xl p-2 bg-white border border-slate-200 text-primary hover:bg-slate-50 cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <nav
          className="xl:hidden w-full bg-white rounded-xl p-4 shadow-lg border border-slate-100 flex flex-col space-y-2 mt-3"
          aria-label="Mobile Navigation"
        >
          {NAV_ITEMS.map((item) =>
            item.isDropdown ? (
              <div key={item.label} className="w-full flex flex-col space-y-1">
                <Button
                  icon={item.icon}
                  size="md"
                  variant={isWalletActive ? 'primaryLink' : 'outline'}
                  onClick={() => setIsWalletOpen((prev) => !prev)}
                  className="w-full justify-start px-4"
                >
                  {item.label}
                </Button>
                {isWalletOpen && (
                  <div className="pl-6 flex flex-col space-y-1 py-1">
                    <NavLink
                      to="/wallets/organization"
                      onClick={() => {
                        setIsWalletOpen(false);
                        setMobileOpen(false);
                      }}
                      className="text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                    >
                      • Organization
                    </NavLink>
                    <NavLink
                      to="/wallets/individual"
                      onClick={() => {
                        setIsWalletOpen(false);
                        setMobileOpen(false);
                      }}
                      className="text-sm font-medium text-slate-700 hover:text-primary py-1 px-2 rounded-lg hover:bg-slate-50"
                    >
                      • Individual
                    </NavLink>
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

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* All Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
      />
    </header>
  );
};

export default Navbar;