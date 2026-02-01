import { useState, useEffect } from 'react';

export interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Optional subtitle e.g. "Amount: ₦1,000" */
  subtitle?: string;
  /** Called with the 5-digit PIN when user confirms. Return promise; modal shows loading until it resolves. */
  onConfirm: (transactionPin: string) => Promise<void>;
}

const PIN_LENGTH = 5;

export default function ConfirmPaymentModal({
  isOpen,
  onClose,
  title = 'Enter transaction PIN',
  subtitle,
  onConfirm,
}: ConfirmPaymentModalProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (pin.length !== PIN_LENGTH) return;
    setError(null);
    setLoading(true);
    try {
      await onConfirm(pin);
      onClose();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Transaction failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] bg-black/50 min-h-[100dvh]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm flex flex-col bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mb-3">{subtitle}</p>
          )}
          <input
            type="password"
            inputMode="numeric"
            maxLength={PIN_LENGTH}
            value={pin}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
              setPin(v);
              setError(null);
            }}
            placeholder="Enter 5-digit PIN"
            className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-center text-lg tracking-[0.3em] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            disabled={loading}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-[var(--error)]">{error}</p>
          )}
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pin.length !== PIN_LENGTH || loading}
              className="flex-1 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
