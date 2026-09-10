import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable modal for critical action confirmations and success dialogs.
 * Implements the exact design patterns from:
 * - verify-popup.png (Reject / Verify confirmation and success)
 * - verify-popup2.png (Suspend / Re-activate confirmation and success)
 */
export default function ActionConfirmModal({
  isOpen,
  onClose,
  step = 'confirm', // 'confirm' | 'success'
  title,
  message,
  subMessage,
  showCloseButton = false,
  cancelText = 'Cancel',
  proceedText = 'Proceed',
  successButtonText = 'Okay', // 'Thanks' | 'Okay'
  onProceed,
  onSuccessClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Optional Close Icon */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-primary-text mb-4">
          {title}
        </h2>

        {/* Message Content */}
        <div className="text-xs sm:text-sm text-slate-600 space-y-1 mb-8">
          <p>{message}</p>
          {subMessage && <p>{subMessage}</p>}
        </div>

        {/* Action Buttons */}
        {step === 'confirm' ? (
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-rejected/15 text-rejected hover:bg-rejected/25 active:bg-rejected/30 transition-colors cursor-pointer select-none"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onProceed}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none"
            >
              {proceedText}
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onSuccessClose || onClose}
              className="inline-flex items-center justify-center px-9 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none"
            >
              {successButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
