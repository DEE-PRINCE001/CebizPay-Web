import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Check, Search } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';
import { MOCK_BENEFICIARIES, MOCK_BANKS } from '../../../data/walletMockData.js';

export default function TransferProcessModal({
  isOpen,
  onClose,
  mode = 'bank',
  onProceed,
}) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [beneficiary, setBeneficiary] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');

  const isBankMode = mode === 'bank';
  const title = isBankMode ? 'Transfer to Bank' : 'Transfer to Wallet';

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIdentifier('');
      setAmount('');
      setError('');
      setBeneficiary(null);
      setSelectedBank(null);
      setIsBankDropdownOpen(false);
      setIsWalletDropdownOpen(false);
      setBankSearch('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleAccountNumberChange = (val) => {
    setIdentifier(val);
    setError('');

    const clean = val.replace(/\s/g, '');
    const matchedBeneficiary = MOCK_BENEFICIARIES.bank.find((b) => b.accountNumber === clean);
    if (matchedBeneficiary) {
      const bank = MOCK_BANKS.find((b) => b.code === matchedBeneficiary.bankCode);
      if (bank) {
        setSelectedBank(bank);
      }
    }
  };

  const handleStep1Proceed = () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setError(isBankMode ? 'Please enter an account number.' : 'Please enter or select a Wallet ID.');
      return;
    }

    if (isBankMode) {
      if (!selectedBank) {
        setError('Please select a destination bank.');
        return;
      }

      const match = MOCK_BENEFICIARIES.bank.find(
        (b) => b.accountNumber === trimmed.replace(/\s/g, '') && b.bankCode === selectedBank.code
      );

      const resolved = match || {
        accountNumber: trimmed,
        formattedAccountNumber: `${selectedBank.shortName}-${trimmed}`,
        bankName: selectedBank.name,
        accountName: 'Johnson Adebiyi',
        confirmedRecipientName: 'Micheal Johnson',
      };
      setBeneficiary(resolved);
    } else {
      const match = MOCK_BENEFICIARIES.wallet.find((b) => b.walletId === trimmed.replace(/\s/g, ''));
      const resolved = match || {
        walletId: trimmed,
        formattedWalletId: `Wallet ID-${trimmed}`,
        holderName: 'Mike Adenuga',
        confirmedRecipientName: 'Micheal Johnson',
      };
      setBeneficiary(resolved);
    }

    setError('');
    setStep(2);
  };

  const handleStep2Proceed = () => {
    const cleanAmount = amount.replace(/[^0-9]/g, '');
    if (!cleanAmount || Number(cleanAmount) <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    setError('');
    onProceed?.({
      mode,
      identifier,
      selectedBank,
      beneficiary,
      amount: cleanAmount,
      formattedAmount: `₦${Number(cleanAmount).toLocaleString()}`,
    });
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setError('');
    if (!val) {
      setAmount('');
      return;
    }
    setAmount(Number(val).toLocaleString());
  };

  const filteredBanks = MOCK_BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    b.shortName.toLowerCase().includes(bankSearch.toLowerCase())
  );

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-[400px]"
    >
      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium animate-in fade-in duration-150">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              {isBankMode ? 'Account Number' : 'Wallet ID'}
            </label>

            {isBankMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => handleAccountNumberChange(e.target.value)}
                  placeholder="e.g. 092729197"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:border-primary focus:outline-hidden transition-colors"
                  autoFocus
                />
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Quick test:</span>
                  <button
                    type="button"
                    onClick={() => handleAccountNumberChange('092729197')}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    092729197 (UBA - Johnson Adebiyi)
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter or pick Wallet ID"
                    className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:border-primary focus:outline-hidden transition-colors"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsWalletDropdownOpen((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isWalletDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {isWalletDropdownOpen && (
                  <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    {MOCK_BENEFICIARIES.wallet.map((w) => (
                      <button
                        key={w.walletId}
                        type="button"
                        onClick={() => {
                          setIdentifier(w.walletId);
                          setIsWalletDropdownOpen(false);
                          setError('');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-blue-50/50 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-800 font-mono">
                            {w.walletId}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {w.holderName}
                          </span>
                        </div>
                        {identifier === w.walletId && (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {isBankMode && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Select Bank
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBankDropdownOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-hidden text-left cursor-pointer transition-colors"
                >
                  <span className={`text-xs sm:text-sm font-medium ${selectedBank ? 'text-slate-800' : 'text-slate-400'}`}>
                    {selectedBank ? selectedBank.name : 'Choose destination bank'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isBankDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isBankDropdownOpen && (
                  <div className="mt-2 p-2 bg-white border border-slate-100 rounded-xl shadow-xl space-y-2 animate-in fade-in zoom-in-98 duration-150 z-20 relative">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        placeholder="Search banks..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-primary"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => {
                            setSelectedBank(bank);
                            setIsBankDropdownOpen(false);
                            setError('');
                            setBankSearch('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-blue-50/50 cursor-pointer transition-colors"
                        >
                          <span className="font-medium text-slate-800">
                            {bank.name}
                          </span>
                          {selectedBank?.code === bank.code && (
                            <Check className="w-3.5 h-3.5 text-primary" />
                          )}
                        </button>
                      ))}
                      {filteredBanks.length === 0 && (
                        <div className="text-center py-3 text-xs text-slate-400">
                          No banks found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleStep1Proceed}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none"
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center text-xs text-slate-400 hover:text-slate-600 mb-3 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Change {isBankMode ? 'Account' : 'Wallet ID'}
            </button>

            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs mb-4">
              {isBankMode ? (
                <div className="flex flex-col">
                  <h3 className="text-sm sm:text-base font-bold text-primary-text">
                    {beneficiary?.accountName || 'Johnson Adebiyi'}
                  </h3>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {beneficiary?.formattedAccountNumber || `${selectedBank?.shortName || 'Bank'}-${identifier}`}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <h3 className="text-sm sm:text-base font-bold text-primary-text font-mono">
                    {beneficiary?.walletId || identifier || '615541851885'}
                  </h3>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {beneficiary?.holderName || 'Mike Adenuga'}
                  </span>
                </div>
              )}
            </div>

            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₦
              </span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:border-primary focus:outline-hidden transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleStep2Proceed}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none"
            >
              Proceed
            </button>
          </div>
        </div>
      )}
    </WalletBaseModal>
  );
}
