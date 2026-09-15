import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, Check, Search, Loader2 } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';
import { walletService } from '../../../api/services/wallet.service.js';

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
  const [bankSearch, setBankSearch] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const isBankMode = mode === 'bank';
  const title = isBankMode ? 'Transfer to Bank' : 'Transfer to Wallet';

  const { data: banksData, isLoading: isBanksLoading } = useQuery({
    queryKey: ['supported-banks-list'],
    queryFn: () => walletService.getBanks(),
    enabled: isOpen && isBankMode,
    staleTime: 5 * 60 * 1000,
  });

  const banksList = Array.isArray(banksData) ? banksData : (banksData?.items || []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIdentifier('');
      setAmount('');
      setError('');
      setBeneficiary(null);
      setSelectedBank(null);
      setIsBankDropdownOpen(false);
      setBankSearch('');
      setIsResolving(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleStep1Proceed = async () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setError(isBankMode ? 'Please enter an account number.' : 'Please enter a Wallet ID or phone number.');
      return;
    }

    if (isBankMode) {
      if (!selectedBank) {
        setError('Please select a destination bank.');
        return;
      }
      const clean = trimmed.replace(/\s/g, '');
      if (clean.length < 10) {
        setError('Please enter a valid 10-digit NUBAN account number.');
        return;
      }

      setIsResolving(true);
      setError('');
      try {
        const res = await walletService.resolveAccount({
          bankCode: selectedBank.code,
          accountNumber: clean,
        });

        const accountName = res?.accountName || res?.account_name || 'Account Verified';
        setBeneficiary({
          accountNumber: clean,
          formattedAccountNumber: `${selectedBank.shortName || selectedBank.name} - ${clean}`,
          bankName: selectedBank.name,
          accountName,
          confirmedRecipientName: accountName,
        });
        setStep(2);
      } catch (err) {
        setError(err?.message || 'Unable to resolve destination bank account name. Please verify bank and account number.');
      } finally {
        setIsResolving(false);
      }
    } else {
      const clean = trimmed.replace(/\s/g, '');
      setIsResolving(true);
      setError('');
      try {
        const res = await walletService.resolveWallet(clean);
        const holderName = res?.holderName || res?.name || res?.fullName || res?.email || 'Verified User';
        setBeneficiary({
          walletId: clean,
          formattedWalletId: `Wallet ID - ${clean}`,
          holderName,
          confirmedRecipientName: holderName,
        });
        setStep(2);
      } catch (err) {
        setError(err?.message || 'Destination wallet or user not found. Please verify recipient identifier.');
      } finally {
        setIsResolving(false);
      }
    }
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

  const filteredBanks = banksList.filter((b) =>
    (b.name || '').toLowerCase().includes(bankSearch.toLowerCase()) ||
    (b.shortName || '').toLowerCase().includes(bankSearch.toLowerCase()) ||
    (b.code || '').includes(bankSearch)
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
              {isBankMode ? 'Account Number' : 'Recipient Wallet ID / Phone'}
            </label>

            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError('');
              }}
              placeholder={isBankMode ? 'Enter 10-digit account number' : 'Enter recipient Wallet ID or phone'}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:border-primary focus:outline-hidden transition-colors"
              autoFocus
            />
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
                  <span className={`text-xs sm:text-sm font-medium truncate ${selectedBank ? 'text-slate-800' : 'text-slate-400'}`}>
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
                      {isBanksLoading ? (
                        <div className="py-4 flex items-center justify-center text-xs text-slate-400 space-x-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          <span>Loading banks...</span>
                        </div>
                      ) : filteredBanks.map((bank, idx) => (
                        <button
                          key={`${bank.code}-${bank.slug || idx}`}
                          type="button"
                          onClick={() => {
                            setSelectedBank(bank);
                            setIsBankDropdownOpen(false);
                            setError('');
                            setBankSearch('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-blue-50/50 cursor-pointer transition-colors"
                        >
                          <span className="font-medium text-slate-800 truncate pr-2">
                            {bank.name}
                          </span>
                          {selectedBank?.code === bank.code && (
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                      {!isBanksLoading && filteredBanks.length === 0 && (
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
              disabled={isResolving}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResolving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resolving...
                </>
              ) : (
                'Proceed'
              )}
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
                    {beneficiary?.accountName}
                  </h3>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {beneficiary?.formattedAccountNumber}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <h3 className="text-sm sm:text-base font-bold text-primary-text font-mono">
                    {beneficiary?.walletId}
                  </h3>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {beneficiary?.holderName}
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
