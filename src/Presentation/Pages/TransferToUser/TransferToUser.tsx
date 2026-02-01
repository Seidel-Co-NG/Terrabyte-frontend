import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import { useAuthStore } from '../../../core/stores/auth.store';
import { servicesApi } from '../../../core/api';
import toast from 'react-hot-toast';

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

const TransferToUser = () => {
  const user = useAuthStore((s) => s.user);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(raw);
  };

  const handlePresetClick = (value: number) => {
    const str = String(value);
    setAmount(str);
    setSelectedPreset(value);
    setAmountToPay(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAmount(raw);
    setSelectedPreset(null);
    const num = raw ? parseFloat(raw) : 0;
    setAmountToPay(num);
  };

  const displayPhone = formatPhone(phone);
  const isValidPhone = phone.length === 11;
  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= 100;
  const canSubmit = isValidPhone && isValidAmount && !isSubmitting;

  const handleTransfer = () => {
    if (!canSubmit) return;
    setPinModalOpen(true);
  };

  const handleConfirmTransfer = async (transactionPin: string) => {
    await servicesApi.transferToUser({
      phone_number: phone,
      amount: String(amountNum),
      transaction_pin: transactionPin,
    });
    toast.success(`Transfer of ₦${amountNum.toLocaleString()} to ${displayPhone} successful.`);
    setPhone('');
    setAmount('');
    setSelectedPreset(null);
    setAmountToPay(0);
  };

  const balance = user?.wallet ?? '0.00';
  const balanceDisplay = typeof balance === 'string' && balance.includes('₦') ? balance : `₦${Number(balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Transfer to User</h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Phone Number */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Phone Number</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={14}
              value={displayPhone}
              onChange={handlePhoneChange}
              placeholder="0801 234 5678"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {phone.length > 0 && phone.length !== 11 && (
              <p className="text-xs text-[var(--error)]">Phone number must be 11 digits</p>
            )}
          </div>

          {/* Select Amount (preset chips) */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Select Amount</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {PRESET_AMOUNTS.map((value) => {
                const isSelected = selectedPreset === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handlePresetClick(value)}
                    className={`shrink-0 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border
                      ${isSelected
                        ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-hover)]'
                      }`}
                  >
                    ₦{value.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enter Amount */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Amount</label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {amountToPay > 0 && (
              <p className="text-xs font-semibold text-[var(--accent-primary)]">
                Amount to Pay: ₦{amountToPay.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
            )}
            {amountNum > 0 && amountNum < 100 && (
              <p className="text-xs text-[var(--error)]">Minimum transfer amount is ₦100</p>
            )}
          </div>

          {/* Balance */}
          <div className="py-2">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Balance: <span className="font-semibold text-[var(--text-primary)]">{balanceDisplay}</span>
            </p>
          </div>

          <div className="flex-1 min-h-[40px]" />

          {/* Transfer Button */}
          <PayButton
            fullWidth
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handleTransfer}
          >
            Transfer
          </PayButton>
        </div>
      </div>
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Transfer"
        subtitle={`Amount: ₦${amountNum.toLocaleString()} • ${displayPhone}`}
        onConfirm={handleConfirmTransfer}
      />
    </div>
  );
};

export default TransferToUser;
