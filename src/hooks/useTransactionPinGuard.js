import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth.js';

export function useTransactionPinGuard() {
  const { hasTransactionPin, refetchUser } = useAuth();
  const [isSetupPinOpen, setIsSetupPinOpen] = useState(false);
  const pendingActionRef = useRef(null);

  const executeWithPinGuard = useCallback(
    (action) => {
      if (hasTransactionPin) {
        action?.();
      } else {
        pendingActionRef.current = action;
        setIsSetupPinOpen(true);
      }
    },
    [hasTransactionPin]
  );

  const handlePinSetupSuccess = useCallback(async () => {
    setIsSetupPinOpen(false);
    try {
      await refetchUser();
    } catch (err) {
      console.error('Failed to refetch user after setting PIN:', err);
    }

    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  }, [refetchUser]);

  const handleClose = useCallback(() => {
    setIsSetupPinOpen(false);
    pendingActionRef.current = null;
  }, []);

  return {
    hasTransactionPin,
    executeWithPinGuard,
    isSetupPinOpen,
    closeSetupPin: handleClose,
    onPinSetupSuccess: handlePinSetupSuccess,
  };
}
