import React from 'react';
import { CreditCard } from 'lucide-react';
import { MOCK_SAVED_CARDS } from '../../../data/walletMockData.js';
export default function CardsDropdown({
  cards = MOCK_SAVED_CARDS,
  selectedCardId,
  onSelectCard,
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-2.5 border border-slate-100/90 shadow-sm space-y-2 ${className}`}
    >
      {cards.map((card) => {
        const isSelected = selectedCardId === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCard?.(card)}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border text-left transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-[#F2F5FE] border-blue-200/70 shadow-2xs'
                : 'bg-white border-slate-100/90 hover:border-slate-200'
            }`}
          >
            {/* Left: Card Icon & Details */}
            <div className="flex items-center space-x-3.5">
              <div
                className={`p-1.5 rounded-lg ${
                  isSelected ? 'bg-blue-100/60 text-primary' : 'bg-slate-50 text-blue-500/80'
                }`}
              >
                <CreditCard className="w-5 h-5 stroke-[1.5]" />
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-wide">
                  **** {card.last4}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-normal">
                  {card.cardType}
                </span>
              </div>
            </div>

            {/* Right: Radio Button */}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isSelected
                  ? 'border-2 border-primary'
                  : 'border border-blue-400/60'
              }`}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
