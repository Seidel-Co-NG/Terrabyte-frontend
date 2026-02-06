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
}

const ConfirmPaymentModal = ({ isOpen, onClose, networkName, product, amount, mobileNumber, amountToPay, onConfirmPayment, isLoading = false, }: ConfirmPaymentModalProps & { isLoading?: boolean }) => {
  const [pin, setPin] = useState('');
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (pin.length < 4) {
      alert('Please enter a 4-digit PIN');
      return;
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
          <p className="text-sm text-[var(--text-secondary)] mb-4">{product} · {networkName}</p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Mobile Number</span><span className="font-medium">{mobileNumber}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Amount</span><span className="font-medium">₦{Number(amount).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Amount to pay</span><span className="font-medium">₦{String(amountToPay)}</span></div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-[var(--text-secondary)] block mb-2">Enter Transaction PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm mb-4">
            <input type="checkbox" checked={saveAsBeneficiary} onChange={(e) => setSaveAsBeneficiary(e.target.checked)} />
            <span className="text-[var(--text-secondary)]">Save as beneficiary</span>
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] disabled:opacity-60">Cancel</button>
            <button type="button" onClick={handleConfirm} disabled={isLoading} className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmPaymentModal;
