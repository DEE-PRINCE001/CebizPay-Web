import React, { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';

const WalletCard = ({
  title = 'Wallet',
  balance = '0.00',
  currency = '₦',
  isLoading = false,
  isError = false,
  errorMessage = '',
  actions = null,
  children = null,
  className = '',
  virtualAccount = null,
}) => {
  const [isAmountVisible, setIsAmountVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(virtualAccount.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const showVirtualAccount =
    virtualAccount?.accountNumber && virtualAccount.accountNumber.trim() !== '';

  return (
    <div
      className={`bg-white text-primary-text rounded-2xl sm:rounded-3xl flex flex-col justify-center px-6 sm:px-8 py-6 sm:py-8 shadow-xs border border-slate-100 ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-500">{title}</h2>

        {showVirtualAccount && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-slate-400 leading-none">
              {virtualAccount.bankName}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[11px] font-medium text-slate-500 tracking-wide leading-none">
                {virtualAccount.accountNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                aria-label="Copy account number"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            {virtualAccount.accountName && (
              <span className="text-[10px] text-slate-400 leading-none">
                {virtualAccount.accountName}
              </span>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center space-x-2 py-4 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs sm:text-sm font-medium">Loading balance...</span>
        </div>
      ) : isError ? (
        <p className="text-xs text-rejected font-medium py-2">
          {errorMessage || 'Unable to load wallet balance'}
        </p>
      ) : (
        <h1
          onClick={() => setIsAmountVisible((v) => !v)}
          className={`text-3xl font-satoshi sm:text-4xl lg:text-[45px] font-extrabold leading-none tracking-tight text-primary-text py-2 cursor-pointer select-none transition-all duration-200 ${
            isAmountVisible ? '' : 'blur-sm'
          }`}
        >
          {currency}{balance}
        </h1>
      )}

      {actions && <div className="mt-4 sm:mt-6 flex items-center gap-3">{actions}</div>}
      {children}
    </div>
  );
};

export default WalletCard;