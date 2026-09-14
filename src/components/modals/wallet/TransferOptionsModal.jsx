import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * TransferOptionsModal
 * Reference: src/designs/todo/td/TransferOptionsModal.png
 *
 * Prompts user to choose transfer destination:
 * - Transfer to Bank
 * - Transfer to Wallet
 */
export default function TransferOptionsModal({
  isOpen,
  onClose,
  onSelectOption,
  defaultOption = 'bank',
}) {
  const [selected, setSelected] = useState(defaultOption);

  useEffect(() => {
    if (isOpen) {
      setSelected(defaultOption || 'bank');
    }
  }, [isOpen, defaultOption]);

  if (!isOpen) return null;

  const handleOptionClick = (optionKey) => {
    setSelected(optionKey);
    setTimeout(() => {
      onSelectOption?.(optionKey);
    }, 120);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[380px] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
            Transfer Via
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-3.5">
          {/* Option: Transfer to Bank */}
          <button
            type="button"
            onClick={() => handleOptionClick('bank')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
              selected === 'bank'
                ? 'border-primary/50 bg-blue-50/20 shadow-xs'
                : 'border-slate-100 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              Transfer to Bank
            </span>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                selected === 'bank'
                  ? 'border-2 border-primary'
                  : 'border border-blue-400/60'
              }`}
            >
              {selected === 'bank' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </button>

          {/* Option: Transfer to Wallet */}
          <button
            type="button"
            onClick={() => handleOptionClick('wallet')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
              selected === 'wallet'
                ? 'border-primary/50 bg-blue-50/20 shadow-xs'
                : 'border-slate-100 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              Transfer to Wallet
            </span>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                selected === 'wallet'
                  ? 'border-2 border-primary'
                  : 'border border-blue-400/60'
              }`}
            >
              {selected === 'wallet' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
