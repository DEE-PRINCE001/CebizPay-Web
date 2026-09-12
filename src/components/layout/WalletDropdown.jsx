import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function WalletDropdown({ isOpen, onClose, className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isOrgSelected = location.pathname.includes('/wallets/organization');
  const isIndSelected = location.pathname.includes('/wallets/individual');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (targetPath) => {
    onClose?.();
    navigate(targetPath);
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute left-0 top-full mt-2 w-44 sm:w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50 select-none ${className}`}
      role="dialog"
      aria-label="Show for"
    >
      <h3 className="text-sm font-semibold text-primary-text mb-4">Show for</h3>

      <div className="space-y-3.5">
        {/* Organization option */}
        <div
          onClick={() => handleSelect('/wallets/organization')}
          className="flex items-center space-x-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelect('/wallets/organization');
            }
          }}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isOrgSelected
                ? 'border-2 border-primary'
                : 'border border-slate-300 group-hover:border-slate-400'
            }`}
          >
            {isOrgSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Organization
          </span>
        </div>

        {/* Individual option */}
        <div
          onClick={() => handleSelect('/wallets/individual')}
          className="flex items-center space-x-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelect('/wallets/individual');
            }
          }}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isIndSelected
                ? 'border-2 border-primary'
                : 'border border-slate-300 group-hover:border-slate-400'
            }`}
          >
            {isIndSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Individual
          </span>
        </div>
      </div>
    </div>
  );
}
