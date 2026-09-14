import React from 'react';
import { Loader2 } from 'lucide-react';

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
}) => {
  return (
    <div
      className={`bg-white text-primary-text rounded-2xl sm:rounded-3xl flex flex-col justify-center px-6 sm:px-8 py-6 sm:py-8 shadow-xs border border-slate-100 ${className}`}
    >
      <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-2">{title}</h2>
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
        <h1 className="text-3xl font-satoshi sm:text-4xl lg:text-[45px] font-extrabold leading-none tracking-tight text-primary-text py-2">
          {currency}{balance}
        </h1>
      )}

      {/* Action Buttons Slot */}
      {actions && <div className="mt-4 sm:mt-6 flex items-center gap-3">{actions}</div>}
      {children}
    </div>
  );
};

export default WalletCard;