/**
 * Hook for handling API errors that require email verification.
 * When an error message indicates "verify email", show VerifyEmailModal instead of generic error.
 */
import { useState, useCallback } from 'react';
import { isEmailVerificationRequired } from './emailVerification';

export function useVerifyEmailModal() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleError = useCallback((errorMessage: string): boolean => {
    if (isEmailVerificationRequired(errorMessage)) {
      setMessage(errorMessage);
      setShowModal(true);
      return true;
    }
    return false;
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setMessage('');
  }, []);

  return { showModal, message, handleError, closeModal };
}
