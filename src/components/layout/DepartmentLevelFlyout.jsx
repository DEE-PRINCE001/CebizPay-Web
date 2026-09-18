import React, { useEffect, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';

/**
 * DepartmentLevelFlyout matches LevelnDepartmentDropDown.png:
 * Contextual popover card for either "Levels" or "Departments" with close button
 * and navigable action cards with chevron right icons.
 */
export default function DepartmentLevelFlyout({
  isOpen,
  type = 'departments', // 'departments' | 'levels'
  onClose,
  onAction,
  className = '',
}) {
  const flyoutRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={flyoutRef}
        className={`bg-white w-full max-w-[360px] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 p-6 relative flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="menu"
        aria-label={type === 'levels' ? 'Levels Menu' : 'Departments Menu'}
      >
        {/* Header with Title and Close X button */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-primary-text select-none">
            {type === 'levels' ? 'Levels' : 'Departments'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col space-y-2.5 pt-1">
          {type === 'levels' ? (
            <>
              <button
                type="button"
                onClick={() => onAction?.('create-level')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-transparent bg-[#EEF2F6] hover:bg-blue-100/60 transition-colors text-left cursor-pointer group"
              >
                <span className="text-xs sm:text-sm font-semibold text-primary-text group-hover:text-primary transition-colors">
                  Create Level
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onAction?.('manage-levels')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer group"
              >
                <span className="text-xs sm:text-sm font-semibold text-primary-text group-hover:text-primary transition-colors">
                  Manage Levels
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onAction?.('create-departments')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-transparent bg-[#EEF2F6] hover:bg-blue-100/60 transition-colors text-left cursor-pointer group"
              >
                <span className="text-xs sm:text-sm font-semibold text-primary-text group-hover:text-primary transition-colors">
                  Create Departments
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onAction?.('manage-departments')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer group"
              >
                <span className="text-xs sm:text-sm font-semibold text-primary-text group-hover:text-primary transition-colors">
                  Manage Departments
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
