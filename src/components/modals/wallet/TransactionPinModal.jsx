import React, { useState, useRef, useEffect } from 'react';
import WalletBaseModal from './WalletBaseModal.jsx';
import { MOCK_SECURITY } from '../../../data/walletMockData.js';

export default function TransactionPinModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  errorMessage = '',
}) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [internalError, setInternalError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setInternalError('');
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setInternalError('');

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((d) => d !== '')) {
      const fullPin = newPin.join('');
      setTimeout(() => {
        handleSubmit(fullPin);
      }, 150);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (!pasted) return;

    const newPin = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newPin[i] = pasted[i];
    }
    setPin(newPin);
    setInternalError('');

    if (pasted.length === 4) {
      inputRefs.current[3]?.focus();
      setTimeout(() => {
        handleSubmit(pasted);
      }, 150);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleSubmit = (pinValue) => {
    const fullPin = pinValue || pin.join('');
    if (fullPin.length < 4) {
      setInternalError('Please enter your complete 4-digit PIN.');
      return;
    }

    onSubmit?.(fullPin);
  };

  const displayError = errorMessage || internalError;

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Pin"
      subtitle="Enter transaction 4-digit PIN-Code or use your biometrics to perform action"
      maxWidth="max-w-[390px]"
    >
      <div className="space-y-6">
        {displayError && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium animate-in fade-in duration-150 text-center">
            {displayError}
          </div>
        )}

        <div className="flex items-center justify-center gap-3.5 sm:gap-4 py-3">
          {pin.map((digit, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition-all flex items-center justify-center bg-white ${
                digit
                  ? 'border-primary/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                ref={(el) => (inputRefs.current[idx] = el)}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className="w-full h-full text-center text-2xl font-bold text-primary-text bg-transparent focus:outline-hidden caret-primary"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              const testPin = MOCK_SECURITY.validPin.split('');
              setPin(testPin);
              setTimeout(() => {
                handleSubmit(MOCK_SECURITY.validPin);
              }, 150);
            }}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Quick test: auto-fill PIN ({MOCK_SECURITY.validPin})
          </button>
        </div>
      </div>
    </WalletBaseModal>
  );
}
