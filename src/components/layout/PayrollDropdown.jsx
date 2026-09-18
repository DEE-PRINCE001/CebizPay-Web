import React, { useEffect, useRef } from 'react';

const PAYROLL_MENU_OPTIONS = [
  { id: 'analytics', label: 'Analytics', path: '/org/payroll' },
  { id: 'schedule', label: 'Schedule', path: '/org/payroll/schedules' },
  { id: 'history', label: 'History', path: '/org/payroll/history' },
  { id: 'departments', label: 'Departments', isFlyout: true },
  { id: 'levels', label: 'Levels', isFlyout: true },
];

/**
 * PayrollDropdown matches PayrollDropdown.png:
 * "Show for" header with circular radio selectors for Analytics, Schedule, History, Departments, Levels.
 */
export default function PayrollDropdown({
  isOpen,
  onClose,
  selectedId = '',
  onSelectOption,
  className = '',
}) {
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
      className={`absolute left-0 top-full mt-2 w-52 sm:w-56 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150 ${className}`}
      role="menu"
      aria-label="Payroll Options"
    >
      <h3 className="text-sm sm:text-base font-bold text-primary-text select-none">
        Show for
      </h3>

      <div className="flex flex-col space-y-3.5">
        {PAYROLL_MENU_OPTIONS.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onSelectOption?.(option);
              }}
              className="flex items-center space-x-3 text-left group cursor-pointer select-none transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-slate-400 group-hover:border-primary'
                }`}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-xs sm:text-sm transition-colors ${
                  isSelected
                    ? 'font-semibold text-primary'
                    : 'font-normal text-primary-text group-hover:text-primary'
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
