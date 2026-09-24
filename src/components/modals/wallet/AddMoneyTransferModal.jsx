import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';
import { walletService } from '../../../api/services/wallet.service.js';
import { Currency } from '../../../data/enums.js';

export default function AddMoneyTransferModal({
  isOpen,
  onClose,
  accounts: customAccounts,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const {
    data: liveAccounts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['primary-virtual-account', Currency.NGN],
    queryFn: async () => {
      return walletService.getPrimaryVirtualAccount({ currency: Currency.NGN });
    },
    enabled: isOpen && !customAccounts,
    staleTime: 30 * 1000,
  });

  if (!isOpen) return null;

  const resolveAccountList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.accounts)) return data.accounts;
    const target = data.data || data.virtualAccount || data;
    if (target?.accountNumber || target?.account_number) return [target];
    return [];
  };

  const accounts = customAccounts || resolveAccountList(liveAccounts);

  const handleCopy = async (account) => {
    const accNum = account.accountNumber || account.account_number;
    if (!accNum) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(accNum);
      }
    } catch {
      // Fallback if clipboard API restricted
    }
    setCopiedId(account.id || accNum);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Money Via Transfer"
      subtitle="Kindly transfer to the bank account below"
      maxWidth="max-w-[390px]"
    >
      {isLoading ? (
        <div className="py-10 flex flex-col items-center justify-center space-y-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-xs">Loading virtual accounts...</span>
        </div>
      ) : isError ? (
        <div className="py-6 px-4 rounded-xl bg-red-50/70 border border-red-100 flex flex-col items-center text-center space-y-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-xs text-red-600 font-medium">
            {error?.message || 'Unable to load virtual accounts at the moment.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : accounts.length === 0 ? (
        <div className="py-8 px-4 rounded-xl border border-slate-100 bg-slate-50/50 text-center flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Copy className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-700">No Virtual Accounts Available</p>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs">
            Dedicated virtual accounts have not been provisioned for this organization yet. You can fund via card or contact support.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100/90 bg-white shadow-2xs divide-y divide-slate-100">
          {accounts.map((acc, idx) => {
            const accId = acc.id || acc.accountNumber || idx;
            const isCopied = copiedId === accId;
            return (
              <div
                key={accId}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex flex-col pr-2">
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    {acc.bankName || acc.bank_name || 'Commercial Bank'}
                  </span>
                  {(acc.accountName || acc.account_name) && (
                    <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      {acc.accountName || acc.account_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-bold text-primary-text tracking-wider font-mono">
                    {acc.accountNumber || acc.account_number}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(acc)}
                    className="p-1 rounded text-primary hover:text-primary/80 transition-colors cursor-pointer relative group"
                    title="Copy account number"
                    aria-label={`Copy account number`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-150" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}

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
      )}
    </WalletBaseModal>
  );
}

