import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import WalletBaseModal from './WalletBaseModal.jsx';
import { walletService } from '../../../api/services/wallet.service.js';

export default function SetupPinModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const step1Refs = useRef([]);
  const step2Refs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setErrorMessage('');
      setIsLoading(false);
      setTimeout(() => {
        step1Refs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index, value, isConfirm = false) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const targetArr = isConfirm ? [...confirmPin] : [...pin];
    targetArr[index] = digit;
    setErrorMessage('');

    if (isConfirm) {
      setConfirmPin(targetArr);
      if (digit && index < 3) {
        step2Refs.current[index + 1]?.focus();
      }

      if (targetArr.every((d) => d !== '')) {
        const fullConfirm = targetArr.join('');
        const fullInitial = pin.join('');
        setTimeout(() => {
          handleValidateAndSubmit(fullInitial, fullConfirm);
        }, 150);
      }
    } else {
      setPin(targetArr);
      if (digit && index < 3) {
        step1Refs.current[index + 1]?.focus();
      }

      if (targetArr.every((d) => d !== '')) {
        setTimeout(() => {
          setStep(2);
          setConfirmPin(['', '', '', '']);
          setErrorMessage('');
          setTimeout(() => {
            step2Refs.current[0]?.focus();
          }, 100);
        }, 150);
      }
    }
  };

  const handleKeyDown = (index, e, isConfirm = false) => {
    const targetArr = isConfirm ? confirmPin : pin;
    const currentRefs = isConfirm ? step2Refs : step1Refs;
    const setTarget = isConfirm ? setConfirmPin : setPin;

    if (e.key === 'Backspace') {
      if (!targetArr[index] && index > 0) {
        currentRefs.current[index - 1]?.focus();
      } else {
        const updated = [...targetArr];
        updated[index] = '';
        setTarget(updated);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      currentRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      currentRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e, isConfirm = false) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (!pasted) return;

    const newArr = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newArr[i] = pasted[i];
    }
    setErrorMessage('');

    const currentRefs = isConfirm ? step2Refs : step1Refs;

    if (isConfirm) {
      setConfirmPin(newArr);
      if (pasted.length === 4) {
        currentRefs.current[3]?.focus();
        setTimeout(() => {
          handleValidateAndSubmit(pin.join(''), pasted);
        }, 150);
      } else {
        currentRefs.current[pasted.length]?.focus();
      }
    } else {
      setPin(newArr);
      if (pasted.length === 4) {
        setTimeout(() => {
          setStep(2);
          setConfirmPin(['', '', '', '']);
          setTimeout(() => {
            step2Refs.current[0]?.focus();
          }, 100);
        }, 150);
      } else {
        currentRefs.current[pasted.length]?.focus();
      }
    }
  };

  const handleValidateAndSubmit = async (initialPin, confirmationPin) => {
    if (initialPin.length < 4 || confirmationPin.length < 4) {
      setErrorMessage('Please enter all 4 digits.');
      return;
    }

    if (initialPin !== confirmationPin) {
      setErrorMessage('PINs do not match. Please verify and re-enter, or go back to change it.');
      setConfirmPin(['', '', '', '']);
      setTimeout(() => {
        step2Refs.current[0]?.focus();
      }, 100);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      await walletService.setupPin({
        pin: initialPin,
        transactionPin: initialPin,
        confirmPin: confirmationPin,
      });

      onSuccess?.();
    } catch (err) {
      setErrorMessage(
        err?.message || 'Failed to setup transaction PIN. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setConfirmPin(['', '', '', '']);
    setErrorMessage('');
    setTimeout(() => {
      step1Refs.current[3]?.focus();
    }, 100);
  };

  const isStep1 = step === 1;

  return (
    <WalletBaseModal
      isOpen={isOpen}
      onClose={isLoading ? undefined : onClose}
      title={isStep1 ? 'Set Transaction PIN' : 'Confirm Transaction PIN'}
      subtitle={
        isStep1
          ? 'Create a 4-digit PIN to secure and authorize your transfers and payments.'
          : 'Re-enter your 4-digit PIN to confirm and activate your security code.'
      }
      maxWidth="max-w-[400px]"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-500">
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold ${
                isStep1
                  ? 'bg-primary text-white'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              1
            </span>
            <span className={isStep1 ? 'text-primary font-semibold' : 'text-slate-600'}>
              Enter PIN
            </span>
            <span className="text-slate-300">/</span>
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold ${
                !isStep1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={!isStep1 ? 'text-primary font-semibold' : 'text-slate-400'}>
              Confirm
            </span>
          </div>

          {!isStep1 && !isLoading && (
            <button
              type="button"
              onClick={handleBackToStep1}
              className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Change PIN
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-start space-x-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {isStep1 ? (
          <div className="flex items-center justify-center gap-3.5 sm:gap-4 py-2">
            {pin.map((digit, idx) => (
              <div
                key={`step1-${idx}`}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition-all flex items-center justify-center bg-white ${
                  digit
                    ? 'border-primary/60 shadow-xs ring-2 ring-primary/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  ref={(el) => (step1Refs.current[idx] = el)}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value, false)}
                  onKeyDown={(e) => handleKeyDown(idx, e, false)}
                  onPaste={(e) => handlePaste(e, false)}
                  disabled={isLoading}
                  className="w-full h-full text-center text-2xl font-bold text-primary-text bg-transparent focus:outline-hidden caret-primary"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3.5 sm:gap-4 py-2">
            {confirmPin.map((digit, idx) => (
              <div
                key={`step2-${idx}`}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition-all flex items-center justify-center bg-white ${
                  digit
                    ? 'border-primary/60 shadow-xs ring-2 ring-primary/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  ref={(el) => (step2Refs.current[idx] = el)}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(idx, e, true)}
                  onPaste={(e) => handlePaste(e, true)}
                  disabled={isLoading}
                  className="w-full h-full text-center text-2xl font-bold text-primary-text bg-transparent focus:outline-hidden caret-primary"
                />
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center space-x-2 text-xs text-primary pt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Setting up your secure PIN...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center text-slate-400 text-xs space-x-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Never share your PIN with anyone</span>
          </div>
        )}
      </div>
    </WalletBaseModal>
  );
}
