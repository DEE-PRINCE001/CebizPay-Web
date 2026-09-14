import React, { useEffect } from 'react';
import { X } from 'lucide-react';
export default function WalletBaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-[390px]',
  showClose = true,
}) {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between mb-1">
            {title ? (
              <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
                {title}
              </h2>
            ) : <div />}

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Optional Subtitle */}
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-500 mb-5 font-normal">
            {subtitle}
          </p>
        )}

        {/* Modal Body */}
        <div className={!title && !subtitle ? '' : 'mt-4'}>
          {children}
        </div>
      </div>
    </div>
  );
}
