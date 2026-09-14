import React from 'react';
import { Wallet } from 'lucide-react';

export default function IndividualWalletTab({ wallet = null }) {
  if (!wallet) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Wallet className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-primary-text">No Wallet Connected</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
          This individual has not linked or initialized an external or virtual wallet account yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 font-medium">Available Balance</p>
        <p className="text-xl font-bold text-primary-text mt-1">₦{wallet.availableBalance?.toLocaleString() || '0.00'}</p>
      </div>
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 font-medium">Virtual Account Number</p>
        <p className="text-xl font-bold text-primary-text mt-1">{wallet.virtualAccountNumber || 'N/A'}</p>
      </div>
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 font-medium">Bank Name</p>
        <p className="text-xl font-bold text-primary-text mt-1">{wallet.bankName || 'Wema Bank'}</p>
      </div>
    </div>
  );
}
