import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { MOCK_VIRTUAL_ACCOUNTS } from '../../../data/walletMockData.js';

/**
 * AddMoneyTransferModal
 * Reference: src/designs/todo/td/AddMoneyProcessModal.png (Screen 1: Add Money Via Transfer)
 *
 * Displays dedicated virtual bank accounts for organization funding.
 * Features one-click clipboard copying with visual confirmation.
 */
export default function AddMoneyTransferModal({
  isOpen,
  onClose,
  accounts = MOCK_VIRTUAL_ACCOUNTS,
}) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = async (account) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(account.accountNumber);
      }
      setCopiedId(account.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      // Fallback if clipboard API fails
      setCopiedId(account.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[390px] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
            Add Money Via Transfer
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-[11px] sm:text-xs text-slate-500 mb-5 font-normal">
          Kindly transfer to the bank account below
        </p>

        {/* Dedicated Accounts Container */}
        <div className="rounded-xl border border-slate-100/90 bg-white shadow-2xs divide-y divide-slate-100">
          {accounts.map((acc) => {
            const isCopied = copiedId === acc.id;
            return (
              <div
                key={acc.id}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs sm:text-sm text-slate-700 font-normal">
                  {acc.bankName}
                </span>

                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-bold text-primary-text tracking-wider font-mono">
                    {acc.accountNumber}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(acc)}
                    className="p-1 rounded text-primary hover:text-primary/80 transition-colors cursor-pointer relative group"
                    title="Copy account number"
                    aria-label={`Copy ${acc.bankName} account number`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-150" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}

                    {/* Tooltip feedback */}
                    {isCopied && (
                      <span className="absolute -top-7 right-0 px-2 py-0.5 text-[10px] font-medium bg-emerald-600 text-white rounded shadow-xs whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
