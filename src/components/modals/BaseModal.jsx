import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Shared BaseModal component supporting title, subtitle, close button,
 * backdrop blur, animation, and ESC key listener.
 */
export default function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-[440px]',
  showClose = true,
  className = '',
}) {
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
        className={`bg-white w-full ${maxWidth} rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between mb-4">
            {title ? (
              <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
                {title}
              </h2>
            ) : <div />}

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Optional Subtitle */}
        {subtitle && (
          <p className="text-xs text-slate-500 mb-5 font-normal -mt-2">
            {subtitle}
          </p>
        )}

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
