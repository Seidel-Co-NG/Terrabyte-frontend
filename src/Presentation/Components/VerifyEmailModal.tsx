/**
 * Modal shown when API error indicates email verification is required.
 * "Verify Email" sets pending email and navigates to verify-otp; uses project design.
 */
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type AuthState } from '../../core/stores/auth.store';

export interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  /** After setting email and closing, navigate to this path (e.g. /verify-otp?redirect=/dashboard). */
  redirectToVerifyPath?: string;
}

const VerifyEmailModal = ({
  isOpen,
  onClose,
  message,
  title = 'Email not verified',
  redirectToVerifyPath = '/verify-otp?redirect=/dashboard',
}: VerifyEmailModalProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((s: AuthState) => s.user);
  const setEmailForVerification = useAuthStore((s: AuthState) => s.setEmailForVerification);

  const email = user?.email ?? '';

  const handleVerifyClick = () => {
    if (email) {
      setEmailForVerification(email);
      onClose();
      navigate(redirectToVerifyPath);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-email-title"
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--error)]/10 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 id="verify-email-title" className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] transition-colors"
            >
              Dismiss
            </button>
            {email ? (
              <button
                type="button"
                onClick={handleVerifyClick}
                className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary-dark transition-colors"
              >
                Verify Email
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
