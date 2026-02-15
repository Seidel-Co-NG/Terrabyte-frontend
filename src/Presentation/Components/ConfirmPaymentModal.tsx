import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const PIN_LENGTH = 5;

export interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Simple mode: title and subtitle above PIN */
  title?: string;
  subtitle?: string;
  /** Simple mode: called with 5-digit PIN; modal closes on success, shows error on reject */
  onConfirm?: (transactionPin: string) => Promise<void>;
  /** Detailed mode: product/amount summary */
  networkName?: string;
  product?: string;
  amount?: string;
  mobileNumber?: string;
  amountToPay?: string | number;
  /** Detailed mode: called with PIN and saveAsBeneficiary; parent handles close/loading */
  onConfirmPayment?: (pin: string, saveAsBeneficiary: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
  onErrorClear?: () => void;
  showCloseButton?: boolean;
}

export default function ConfirmPaymentModal({
  isOpen,
  onClose,
  title = 'Enter Payment PIN',
  subtitle,
  onConfirm,
  networkName,
  product,
  amount,
  mobileNumber,
  amountToPay,
  onConfirmPayment,
  isLoading = false,
  error = null,
  onErrorClear,
  showCloseButton = true,
}: ConfirmPaymentModalProps) {
  const [pinValue, setPinValue] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);

  const isSimpleMode = typeof onConfirm === 'function';
  const pinValid = pinValue.length === PIN_LENGTH && /^\d+$/.test(pinValue);

  useEffect(() => {
    if (!isOpen) {
      setPinValue('');
      setModalError(null);
    }
  }, [isOpen]);

  const handlePinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digitsOnly = raw.replace(/\D/g, '').slice(0, PIN_LENGTH);
      setPinValue(digitsOnly);
      setModalError(null);
      onErrorClear?.();
    },
    [onErrorClear]
  );

  const handleConfirmClick = useCallback(() => {
    if (!pinValid) return;
    if (isSimpleMode && onConfirm) {
      setLoading(true);
      setModalError(null);
      onConfirm(pinValue)
        .then(() => onClose())
        .catch((e) => {
          setModalError(e instanceof Error ? e.message : 'Transaction failed');
          setPinValue('');
        })
        .finally(() => setLoading(false));
      return;
    }
    if (onConfirmPayment) {
      onConfirmPayment(pinValue, saveAsBeneficiary);
      setPinValue('');
    }
  }, [pinValid, pinValue, isSimpleMode, onConfirm, onConfirmPayment, onClose, saveAsBeneficiary]);

  useEffect(() => {
    if (error) setModalError(error);
  }, [error]);

  if (!isOpen) return null;

  const displayError = modalError ?? error;
  const isProcessing = loading || isLoading;

  const hasDetails =
    product != null ||
    amount != null ||
    mobileNumber != null ||
    networkName != null ||
    amountToPay != null;

  return (
    <>
      <div
        className="absolute inset-0 z-[1000] bg-black/50"
        onClick={showCloseButton ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[1001] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-[400px] flex flex-col bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {isProcessing && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-card)]/95 backdrop-blur-[2px]"
              aria-live="polite"
              aria-busy="true"
            >
              <span className="w-12 h-12 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Verifying PIN...</span>
            </div>
          )}

          {/* Header: title + close */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mb-4">{subtitle}</p>
          )}

          {/* Transaction details */}
          {hasDetails && (
            <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-4 mb-5 space-y-2">
              {networkName != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Network</span>
                  <span className="font-medium text-[var(--text-primary)]">{networkName}</span>
                </div>
              )}
              {product != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Product</span>
                  <span className="font-medium text-[var(--text-primary)]">{product}</span>
                </div>
              )}
              {mobileNumber != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Number</span>
                  <span className="font-medium text-[var(--text-primary)]">{mobileNumber}</span>
                </div>
              )}
              {amount != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Amount</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    ₦{Number(amount).toLocaleString()}
                  </span>
                </div>
              )}
              {amountToPay != null && amountToPay !== amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Amount to pay</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    ₦{Number(amountToPay).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Payment PIN label + Forgot link */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <label htmlFor="confirm-payment-pin" className="text-sm font-medium text-[var(--text-primary)]">
              Payment PIN
            </label>
            <Link
              to="/dashboard/profile/reset-pin"
              onClick={() => onClose()}
              className="text-sm font-medium text-[var(--accent-primary)] hover:underline"
            >
              Forgot payment PIN
            </Link>
          </div>

          {/* Single 5-digit input (numbers only) with show/hide */}
          <div className="relative mb-1">
            <input
              id="confirm-payment-pin"
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              autoComplete="off"
              maxLength={PIN_LENGTH}
              value={pinValue}
              onChange={handlePinChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmClick();
              }}
              placeholder="Please enter your 5 digit Payment PIN"
              className="w-full py-3 px-4 pr-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              disabled={isProcessing}
            />
            <button
              type="button"
              onClick={() => setShowPin((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
            >
              {showPin ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {displayError && (
            <p className="text-sm text-[var(--error)] mb-4 mt-2 text-center bg-[var(--error)]/10 py-2 px-3 rounded-lg">
              {displayError}
            </p>
          )}

          {/* Save as beneficiary (detailed mode) */}
          {onConfirmPayment != null && (
            <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsBeneficiary}
                onChange={(e) => setSaveAsBeneficiary(e.target.checked)}
                disabled={isProcessing}
                className="rounded border-[var(--border-color)]"
              />
              <span className="text-[var(--text-secondary)]">Save as beneficiary</span>
            </label>
          )}

          {/* Cancel + Confirm */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-hover)] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClick}
              disabled={isProcessing || !pinValid}
              className="flex-1 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
