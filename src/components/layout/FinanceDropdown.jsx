import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, ClipboardCheck, FileText, Receipt } from 'lucide-react';

const FINANCE_MENU_ITEMS = [
  { to: '/org/payroll', label: 'Payroll', icon: Wallet },
  { to: '/org/inventory', label: 'Inventory', icon: ClipboardCheck },
  { to: '/org/invoices', label: 'Invoice', icon: FileText },
  { to: '/org/vouchers', label: 'Voucher', icon: Receipt },
];

export default function FinanceDropdown({ isOpen, onClose, className = '' }) {
  const dropdownRef = useRef(null);

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

  return (
    <div
      ref={dropdownRef}
      className={`absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 p-3.5 sm:p-4 z-50 flex flex-col space-y-2.5 animate-in fade-in zoom-in-95 duration-150 ${className}`}
      role="menu"
      aria-label="Finance Menu"
    >
      {FINANCE_MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-full border text-xs sm:text-sm font-medium transition-all cursor-pointer select-none ${
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-blue-200/80 bg-white text-primary hover:border-primary hover:bg-blue-50/50'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
