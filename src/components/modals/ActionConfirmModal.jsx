import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import Input from '../forms/Input.jsx';

/**
 * Reusable modal for critical action confirmations, loading, error, and success dialogs.
 * Implements the exact design patterns from:
 * - verify-popup.png (Reject / Verify confirmation and success)
 * - verify-popup2.png (Suspend / Re-activate confirmation and success)
 */
export default function ActionConfirmModal({
  isOpen,
  onClose,
  step = 'confirm', // 'confirm' | 'success' | 'error'
  title,
  message,
  subMessage,
  showCloseButton = false,
  cancelText = 'Cancel',
  proceedText = 'Proceed',
  successButtonText = 'Okay', // 'Thanks' | 'Okay'
  isLoading = false,
  errorMessage = '',
  onProceed,
  onSuccessClose,
  requireReason = false,
  reasonLabel = 'Reason',
  reasonPlaceholder = 'Please enter a reason...',
  reasonValue,
  onReasonChange,
  reasonError = '',
  multilineReason = true,
}) {
  const [internalReason, setInternalReason] = useState('');
  const [internalReasonError, setInternalReasonError] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setInternalReason('');
      setInternalReasonError('');
    }
  }

  if (!isOpen) return null;

  const isControlled = reasonValue !== undefined;
  const currentReason = isControlled ? reasonValue : internalReason;
  const currentReasonError = reasonError || internalReasonError;

  const handleReasonChange = (e) => {
    if (internalReasonError) {
      setInternalReasonError('');
    }
    if (isControlled && onReasonChange) {
      onReasonChange(e);
    } else {
      setInternalReason(e.target.value);
    }
  };

  const handleProceedClick = () => {
    const trimmed = (currentReason || '').trim();
    if (requireReason && !trimmed) {
      setInternalReasonError('Please provide a reason before proceeding.');
      return;
    }
    onProceed?.(trimmed);
  };

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
            disabled={isLoading}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
        <div className="text-xs sm:text-sm text-slate-600 space-y-1 mb-5">
          {typeof message === 'string' ? <p>{message}</p> : <div>{message}</div>}
          {subMessage && (typeof subMessage === 'string' ? <p>{subMessage}</p> : <div>{subMessage}</div>)}
        </div>

        {/* Reason Input (when requireReason is true and in 'confirm' step) */}
        {step === 'confirm' && requireReason && (
          <div className="mb-5">
            <Input
              id="action-confirm-reason"
              name="actionReason"
              label={reasonLabel}
              placeholder={reasonPlaceholder}
              value={currentReason}
              onChange={handleReasonChange}
              error={currentReasonError}
              multiline={multilineReason}
              rows={3}
              required
              disabled={isLoading}
            />
          </div>
        )}

        {/* Customer-friendly Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rejected/10 border border-rejected/25 rounded-xl text-xs sm:text-sm text-rejected flex items-start space-x-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Action Buttons */}
        {step === 'confirm' ? (
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-rejected/15 text-rejected hover:bg-rejected/25 active:bg-rejected/30 transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={handleProceedClick}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2 shrink-0" />}
              {isLoading ? 'Processing...' : proceedText}
            </button>
          </div>
        ) : step === 'error' ? (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer select-none"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleProceedClick}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer shadow-xs select-none disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2 shrink-0" />}
              {isLoading ? 'Processing...' : 'Retry'}
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
