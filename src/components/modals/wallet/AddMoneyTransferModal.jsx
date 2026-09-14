import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';
import { MOCK_VIRTUAL_ACCOUNTS } from '../../../data/walletMockData.js';
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
      setCopiedId(account.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }
  };

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Money Via Transfer"
      subtitle="Kindly transfer to the bank account below"
      maxWidth="max-w-[390px]"
    >
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
    </WalletBaseModal>
  );
}
