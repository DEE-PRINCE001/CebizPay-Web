import React from 'react';
import { Check } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';

export default function TransactionSuccessModal({
  isOpen,
  onClose,
  data,
}) {
  if (!isOpen) return null;

  const formattedAmount = data?.formattedAmount || '₦23,000';
  const recipientName = data?.recipientName || data?.beneficiary?.accountName || data?.beneficiary?.holderName || 'Micheal Johnson';
  const detailText = data?.details || data?.beneficiary?.formattedAccountNumber || data?.beneficiary?.formattedWalletId || (data?.card ? `${data.card.cardType} **** ${data.card.last4}` : 'UBA-092 729 197');

  const isFunding = data?.type === 'fund';
  const message = isFunding
    ? `Has been successfully funded via ${data?.card?.cardType || 'Card'}`
    : `Has been successfully transfer to ${recipientName}`;

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[390px]"
    >
      <div className="flex flex-col items-center text-center py-4 px-2">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/90 flex items-center justify-center text-emerald-600 mb-6 animate-in zoom-in-75 duration-200">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mb-2.5">
          {formattedAmount}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-[280px]">
          {message}
        </p>

        {detailText && (
          <span className="text-xs text-slate-500 font-medium mt-1">
            {detailText}
          </span>
        )}

        <div className="w-full pt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none"
          >
            Done
          </button>
        </div>
      </div>
    </WalletBaseModal>
  );
}
