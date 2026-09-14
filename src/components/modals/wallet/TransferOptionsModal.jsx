import React, { useState, useEffect } from 'react';
import WalletBaseModal from './WalletBaseModal.jsx';
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
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Via"
      maxWidth="max-w-[380px]"
    >
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
    </WalletBaseModal>
  );
}
