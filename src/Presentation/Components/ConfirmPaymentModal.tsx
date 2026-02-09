import { useState, useEffect, useCallback } from 'react';

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

const KEYPAD_ROWS: (string | 'back')[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['0', 'back'],
];

export default function ConfirmPaymentModal({
  isOpen,
  onClose,
  title = 'Enter transaction PIN',
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
  const [pin, setPin] = useState<string[]>(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);

  const pinString = pin.join('');
  const isSimpleMode = typeof onConfirm === 'function';

  useEffect(() => {
    if (!isOpen) {
      setPin(['', '', '', '', '']);
      setModalError(null);
    }
  }, [isOpen]);


  const addDigit = useCallback(
    (digit: string) => {
      if (pinString.length >= PIN_LENGTH) return;
      const idx = pin.findIndex((d) => d === '');
      if (idx === -1) return;
      const next = [...pin];
      next[idx] = digit;
      setPin(next);
      setModalError(null);
      onErrorClear?.();

      const newPin = next.join('');
      if (newPin.length === PIN_LENGTH && isSimpleMode && onConfirm) {
        setLoading(true);
        setModalError(null);
        onConfirm(newPin)
          .then(() => {
            onClose();
          })
          .catch((e) => {
            const message = e instanceof Error ? e.message : 'Transaction failed';
            setModalError(message);
            setPin(['', '', '', '', '']);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [pin, pinString.length, isSimpleMode, onConfirm, onConfirmPayment, onClose, saveAsBeneficiary, onErrorClear]
  );

  const backspace = useCallback(() => {
    let i = pin.length - 1;
    while (i >= 0 && pin[i] === '') i--;
    if (i >= 0) {
      const next = [...pin];
      next[i] = '';
      setPin(next);
      setModalError(null);
      onErrorClear?.();
    }
  }, [pin, onErrorClear]);

  useEffect(() => {
    if (error) setModalError(error);
  }, [error]);

  if (!isOpen) return null;

  const displayError = modalError ?? error;
  const isProcessing = loading || isLoading;

  return (
    <>
      <div
        className="absolute inset-0 z-[1000] bg-black/50"
        onClick={showCloseButton ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[1001] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-sm flex flex-col bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Processing overlay - covers modal with centered loader */}
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

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
              {subtitle && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={loading || isLoading}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>

          {/* Detailed summary (when product/amount etc. provided) */}
          {(product != null || amount != null || mobileNumber != null) && (
            <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-4 mb-4 space-y-2">
              {product != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Product</span>
                  <span className="font-medium text-[var(--text-primary)]">{product}</span>
                </div>
              )}
              {networkName != null && networkName !== product && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Network</span>
                  <span className="font-medium text-[var(--text-primary)]">{networkName}</span>
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

          {/* PIN dots (5 circles, like Flutter) */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            {pin.map((digit, i) => (
              <div
                key={i}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-tertiary)]"
              >
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    digit ? 'bg-[var(--text-primary)]' : 'bg-transparent'
                  }`}
                />
              </div>
            ))}
          </div>

          {displayError && (
            <p className="text-sm text-[var(--error)] mb-4 text-center bg-[var(--error)]/10 py-2 px-3 rounded-lg">
              {displayError}
            </p>
          )}

          {/* Keypad (Flutter-style: 1-9, 0, backspace) */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {KEYPAD_ROWS.map((row) =>
              row.map((key) =>
                key === 'back' ? (
                  <button
                    key="back"
                    type="button"
                    onClick={backspace}
                    disabled={loading || isLoading || pinString.length === 0}
                    className="aspect-[1.2] rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--bg-hover)] active:scale-95 disabled:opacity-50 transition-all"
                    aria-label="Backspace"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    key={key}
                    type="button"
                    onClick={() => addDigit(key)}
                    disabled={loading || isLoading}
                    className="aspect-[1.2] rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-2xl font-bold hover:bg-[var(--bg-hover)] active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {key}
                  </button>
                )
              )
            )}
          </div>

          {/* Save as beneficiary (detailed mode only) */}
          {onConfirmPayment != null && (
            <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsBeneficiary}
                onChange={(e) => setSaveAsBeneficiary(e.target.checked)}
                disabled={loading || isLoading}
                className="rounded border-[var(--border-color)]"
              />
              <span className="text-[var(--text-secondary)]">Save as beneficiary</span>
            </label>
          )}

          {/* Confirm button (for detailed mode or if user prefers not to auto-submit) */}
          {onConfirmPayment != null && (
            <button
              type="button"
              onClick={() => {
                if (pinString.length === PIN_LENGTH) {
                  onConfirmPayment(pinString, saveAsBeneficiary);
                  setPin(['', '', '', '', '']);
                }
              }}
              disabled={loading || isLoading || pinString.length !== PIN_LENGTH}
              className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </button>
          )}

          <p className="text-xs text-[var(--text-muted)] text-center mt-3">
            Enter your {PIN_LENGTH}-digit transaction PIN
          </p>
        </div>
      </div>
    </>
  );
}
