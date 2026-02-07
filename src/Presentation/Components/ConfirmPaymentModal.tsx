import React, { useState } from 'react';

export interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkName: string;
  product: string;
  amount: string;
  mobileNumber: string;
  amountToPay?: string | number;
  onConfirmPayment: (pin: string, saveAsBeneficiary: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
  onErrorClear?: () => void;
}

const ConfirmPaymentModal = ({
  isOpen,
  onClose,
  networkName,
  product,
  amount,
  mobileNumber,
  amountToPay,
  onConfirmPayment,
  isLoading = false,
  error = null,
  onErrorClear,
}: ConfirmPaymentModalProps) => {
  const [pin, setPin] = useState('');
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);

  if (!isOpen) return null;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value.replace(/\D/g, ''));
    // Clear error when user starts typing
    if (error && onErrorClear) {
      onErrorClear();
    }
  };

  const handleConfirm = () => {
    if (pin.length < 4) {
      return; // Don't call onConfirmPayment, let parent handle validation
    }
    onConfirmPayment(pin, saveAsBeneficiary);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={onClose} />
      <div className="absolute inset-0 z-[1001] flex items-end md:items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-[var(--bg-card)] rounded-t-2xl md:rounded-2xl p-6 pointer-events-auto border border-[var(--border-color)] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Confirm Payment</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {product} · {networkName}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Mobile Number</span>
              <span className="font-medium">{mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Amount</span>
              <span className="font-medium">₦{Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Amount to pay</span>
              <span className="font-medium">₦{String(amountToPay)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-[var(--text-secondary)] block mb-2">
              Enter Transaction PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={handlePinChange}
              disabled={isLoading}
              placeholder="••••"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-60"
            />
            {error && (
              <p className="text-xs text-[var(--error)] mt-2 bg-[var(--error)]/10 p-2 rounded">
                {error}
              </p>
            )}
            {pin.length > 0 && pin.length < 4 && !error && (
              <p className="text-xs text-[var(--text-muted)] mt-2">
                PIN must be 4 digits
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm mb-4">
            <input
              type="checkbox"
              checked={saveAsBeneficiary}
              onChange={(e) => setSaveAsBeneficiary(e.target.checked)}
              disabled={isLoading}
            />
            <span className="text-[var(--text-secondary)]">Save as beneficiary</span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] disabled:opacity-60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading || pin.length < 4}
              className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:bg-opacity-90"
            >
              {isLoading ? (
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
};

export default ConfirmPaymentModal;
