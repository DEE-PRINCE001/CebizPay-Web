import React from 'react';
import { Loader2 } from 'lucide-react';

const WalletCard = ({
  title = 'Wallet',
  balance = '0.00',
  currency = '₦',
  isLoading = false,
  isError = false,
  errorMessage = '',
  className = '',
}) => {
  return (
    <div
      className={`bg-white text-primary-text rounded-xl flex flex-col space-y-5 justify-center px-8 py-6 sm:py-8 ${className}`}
    >
      <h2 className="font-semibold">{title}</h2>
      {isLoading ? (
        <div className="flex items-center space-x-2 py-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs sm:text-sm font-medium">Loading balance...</span>
        </div>
      ) : isError ? (
        <p className="text-xs text-rejected font-medium">
          {errorMessage || 'Unable to load wallet balance'}
        </p>
      ) : (
        <h1 className="text-3xl font-satoshi sm:text-4xl lg:text-[45px] font-extrabold leading-none tracking-tight">
          {currency}{balance}
        </h1>
      )}
    </div>
  );
};

export default WalletCard;