import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';
import CardsDropdown from './CardsDropdown.jsx';
import { cardsService } from '../../../api/services/cards.service.js';

export default function AddMoneyCardModal({
  isOpen,
  onClose,
  cards: customCards,
  onProceed,
}) {
  const [step, setStep] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const {
    data: liveCards,
    isLoading: isCardsLoading,
    isError: isCardsError,
    error: cardsQueryError,
  } = useQuery({
    queryKey: ['saved-cards-list'],
    queryFn: () => cardsService.getSavedCards(),
    enabled: isOpen && !customCards,
    staleTime: 30 * 1000,
  });

  const cards = customCards || (Array.isArray(liveCards) ? liveCards : []);

  // Reset state when modal opens or cards change
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedCardId(cards[0]?.id || '');
      setIsDropdownOpen(false);
      setAmount('');
      setError('');
    }
  }, [isOpen, cards]);

  if (!isOpen) return null;

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleSelectCard = (card) => {
    setSelectedCardId(card.id);
    setIsDropdownOpen(false);
    setError('');
  };

  const handleStep1Proceed = () => {
    if (!selectedCard) {
      setError('Please select a card to proceed.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2Proceed = () => {
    const cleanAmount = amount.replace(/[^0-9]/g, '');
    if (!cleanAmount || Number(cleanAmount) <= 0) {
      setError('Please enter a valid funding amount.');
      return;
    }
    setError('');
    onProceed?.({
      card: selectedCard,
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
    // Format with commas
    setAmount(Number(val).toLocaleString());
  };

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Money Via Card"
      maxWidth="max-w-[400px]"
    >
      {/* Error Notice */}
      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium animate-in fade-in duration-150">
          {error}
        </div>
      )}

      {/* STEP 1: Select Card */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {isCardsLoading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-xs">Loading saved cards...</span>
            </div>
          ) : cards.length === 0 ? (
            <div className="py-8 px-4 rounded-xl border border-slate-100 bg-slate-50/50 text-center flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700">No Saved Cards Found</p>
              <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs">
                You do not have any tokenized cards saved for this organization yet.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Select Card
              </label>

              {/* Custom Input Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-hidden text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">
                      {selectedCard
                        ? `${selectedCard.cardType || selectedCard.brand || 'Card'} (**** ${selectedCard.last4})`
                        : 'Choose saved card'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Render CardsDropdown when open */}
                {isDropdownOpen && (
                  <div className="mt-2 animate-in fade-in zoom-in-98 duration-150">
                    <CardsDropdown
                      cards={cards}
                      selectedCardId={selectedCardId}
                      onSelectCard={handleSelectCard}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStep1Proceed}
              disabled={isCardsLoading || cards.length === 0}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-xs select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Enter Amount */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            {/* Back button to Step 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center text-xs text-slate-400 hover:text-slate-600 mb-3 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Change Card ({selectedCard?.cardType} **** {selectedCard?.last4})
            </button>

            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              How Much Do You want to be Fund
            </label>

            {/* Amount Input */}
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

          {/* Proceed Button */}
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
