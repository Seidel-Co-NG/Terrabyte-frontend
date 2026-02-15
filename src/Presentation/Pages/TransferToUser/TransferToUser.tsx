import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import { useAuthStore } from '../../../core/stores/auth.store';
import { servicesApi } from '../../../core/api';
import toast from 'react-hot-toast';

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

/** Classify user input as username, phone, or email and return the payload key + normalized value */
function parseRecipientInput(input: string): { key: 'username' | 'phone_number' | 'email'; value: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.includes('@')) {
    return { key: 'email', value: trimmed };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 10 && digits.length <= 11) {
    return { key: 'phone_number', value: digits.replace(/^0/, '') };
  }
  return { key: 'username', value: trimmed };
}

const TransferToUser = () => {
  const user = useAuthStore((s) => s.user);
  const [recipientInput, setRecipientInput] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [validating, setValidating] = useState(false);
  const [validatedRecipient, setValidatedRecipient] = useState<{
    name: string;
    username: string;
    identifier_type: string;
    identifier_value: string;
    phone_masked?: string | null;
    email_masked?: string | null;
  } | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);

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

  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= 100;
  const parsed = parseRecipientInput(recipientInput);
  const isValidRecipient = !!parsed;
  const canValidate = isValidRecipient && isValidAmount;

  const handleValidateAndContinue = async () => {
    if (!canValidate || !parsed) return;
    setValidating(true);
    setValidatedRecipient(null);
    try {
      const payload =
        parsed.key === 'phone_number'
          ? { phone_number: parsed.value }
          : parsed.key === 'email'
            ? { email: parsed.value }
            : { username: parsed.value };
      const res = await servicesApi.validateTransferRecipient(payload);
      if (res?.status === 'successful' && res?.data) {
        setValidatedRecipient(res.data);
        setPinModalOpen(true);
      } else {
        toast.error(res?.message ?? 'Recipient not found');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Validation failed';
      toast.error(msg);
    } finally {
      setValidating(false);
    }
  };

  const handleConfirmTransfer = async (transactionPin: string) => {
    if (!parsed) return;
    const payload: { username?: string; phone_number?: string; email?: string; amount: string; transaction_pin: string } = {
      amount: String(amountNum),
      transaction_pin: transactionPin,
    };
    if (parsed.key === 'username') payload.username = parsed.value;
    else if (parsed.key === 'phone_number') payload.phone_number = parsed.value;
    else payload.email = parsed.value;

    try {
      await servicesApi.transferToUser(payload);
      toast.success(
        `Transfer of ₦${amountNum.toLocaleString()} to ${validatedRecipient?.name ?? recipientInput} successful.`
      );
      setRecipientInput('');
      setAmount('');
      setSelectedPreset(null);
      setAmountToPay(0);
      setValidatedRecipient(null);
      setPinModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transfer failed');
      throw err;
    }
  };

  const balance = user?.wallet ?? '0.00';
  const balanceDisplay =
    typeof balance === 'string' && balance.includes('₦')
      ? balance
      : `₦${Number(balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

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
          {/* Recipient: username, phone or email – match app label style */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter username, phone or email
            </label>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              value={recipientInput}
              onChange={(e) => {
                setRecipientInput(e.target.value);
                setValidatedRecipient(null);
              }}
              placeholder="e.g. johndoe, 0801 234 5678, or user@email.com"
              className="w-full py-3 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {recipientInput.length > 0 && !parsed && (
              <p className="text-xs text-[var(--error)]">
                Enter a valid username, 10–11 digit phone number, or email address
              </p>
            )}
            {validatedRecipient && (
              <p className="text-xs text-[var(--success)]">
                Sending to: {validatedRecipient.name} ({validatedRecipient.username})
              </p>
            )}
          </div>

          {/* Select Amount – horizontal chips like app */}
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
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
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
              className="w-full py-3 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {amountToPay > 0 && (
              <p className="text-xs font-semibold text-[var(--accent-primary)]">
                Amount to pay: ₦{amountToPay.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
            )}
            {amountNum > 0 && amountNum < 100 && (
              <p className="text-xs text-[var(--error)]">Minimum transfer is ₦100</p>
            )}
          </div>

          {/* Balance – match app */}
          <div className="py-2">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Balance: <span className="font-semibold text-[var(--text-primary)]">{balanceDisplay}</span>
            </p>
          </div>

          <div className="flex-1 min-h-[40px]" />

          {/* Validate then confirm – single primary button like app */}
          <PayButton
            fullWidth
            loading={validating}
            loadingText="Validating..."
            disabled={!canValidate}
            onClick={handleValidateAndContinue}
          >
            Continue
          </PayButton>
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => {
          setPinModalOpen(false);
        }}
        title="Confirm Transfer"
        subtitle={
          validatedRecipient
            ? `₦${amountNum.toLocaleString()} to ${validatedRecipient.name} (${validatedRecipient.username})`
            : `Amount: ₦${amountNum.toLocaleString()}`
        }
        onConfirm={handleConfirmTransfer}
      />
    </div>
  );
};

export default TransferToUser;
