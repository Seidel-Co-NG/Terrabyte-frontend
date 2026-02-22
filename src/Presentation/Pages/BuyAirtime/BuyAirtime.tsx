import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import NetworkSelector from './Components/NetworkSelector';
import AmountSelector from './Components/AmountSelector';
import { servicesApi } from '../../../core/api';
import { userApi } from '../../../core/api/user.api';
import { useAuthStore } from '../../../core/stores/auth.store';
import { getNetworkFromPhone } from '../BuyData/utils/phoneNetwork';
import { pickContact } from '../BuyData/utils/contactPicker';

interface AirtimeChargeConfig {
  charge: number;
  percentage: number;
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

const BuyAirtime = () => {
  const user = useAuthStore((s) => s.user);
  const [phone, setPhone] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [chargeConfig, setChargeConfig] = useState<Record<string, AirtimeChargeConfig>>({});

  useEffect(() => {
    userApi.getConfigurations().then((res) => {
      const data = res?.data as { data?: { Charge_Percentage_Discount_Switch?: Array<{ service_name?: string; smart_user_charge?: number; smart_earner_charge?: number; top_user_charge?: number; smart_user_percentage?: number; smart_earner_percentage?: number; top_user_percentage?: number }> } } | undefined;
      const list = data?.data?.Charge_Percentage_Discount_Switch ?? (data as { Charge_Percentage_Discount_Switch?: unknown[] })?.Charge_Percentage_Discount_Switch ?? [];
      const userType = (user?.user_type ?? 'smart_user').toLowerCase();
      const configs: Record<string, AirtimeChargeConfig> = {};
      for (const s of list as Array<{ service_name?: string; smart_user_charge?: number; smart_earner_charge?: number; top_user_charge?: number; smart_user_percentage?: number; smart_earner_percentage?: number; top_user_percentage?: number }>) {
        const name = (s.service_name ?? '').toLowerCase();
        if (!name.endsWith('_vtu')) continue;
        const charge = userType === 'top_user' ? Number(s.top_user_charge ?? 0) : userType === 'smart_earner' ? Number(s.smart_earner_charge ?? 0) : Number(s.smart_user_charge ?? 0);
        const percentage = userType === 'top_user' ? Number(s.top_user_percentage ?? 0) : userType === 'smart_earner' ? Number(s.smart_earner_percentage ?? 0) : Number(s.smart_user_percentage ?? 0);
        configs[name] = { charge, percentage };
      }
      setChargeConfig(configs);
    }).catch(() => {});
  }, [user?.user_type]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(raw);
    setContactMessage(null);
    // Auto-detect network after first 4 digits are entered (length > 3)
    if (raw.length > 3) {
      const detected = getNetworkFromPhone(raw);
      if (detected) setSelectedNetwork(detected);
    }
  };

  const handleSelectContact = async () => {
    setContactMessage(null);
    try {
      const result = await pickContact();
      if (result) {
        // Set phone number (similar to Flutter: _phoneController.text = contact ?? '')
        setPhone(result.phone);
        // Auto-detect network (similar to Flutter: _autoselctnetworkbyphone)
        const detected = getNetworkFromPhone(result.phone);
        if (detected) setSelectedNetwork(detected);
        // Clear any previous error messages
        setContactMessage(null);
      } else {
        // User cancelled - don't show error message
        setContactMessage(null);
      }
    } catch (error) {
      // Handle different error types with appropriate messages
      if (error && typeof error === 'object' && 'message' in error) {
        setContactMessage((error as { message: string }).message);
      } else {
        setContactMessage('Could not open contacts. Please enter the number manually.');
      }
    }
  };

  const displayPhone = formatPhone(phone);
  const isValidPhone = phone.length === 11;
  const amountNum = amount ? parseFloat(amount) : 0;

  const amountToPay = useMemo(() => {
    if (amountNum <= 0 || !selectedNetwork) return 0;
    const key = `${selectedNetwork.toLowerCase()}_vtu`;
    const config = chargeConfig[key];
    if (!config) return amountNum;
    let total = amountNum + config.charge;
    if (config.percentage > 0) {
      const discount = (amountNum * config.percentage) / 100;
      total = amountNum - discount;
    }
    return Math.round(total * 100) / 100;
  }, [amountNum, selectedNetwork, chargeConfig]);

  const isValidAmount = amountNum > 0;
  const canSubmit = isValidPhone && !!selectedNetwork && isValidAmount;

  const handlePay = () => {
    if (!canSubmit) return;
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    if (!selectedNetwork || !phone || !amount) return;
    await servicesApi.buyAirtime({
      network_name: selectedNetwork,
      phone_number: phone,
      amount,
      transaction_pin: transactionPin,
    });
    toast.success(`Airtime purchase: ₦${amountNum.toLocaleString()} to ${displayPhone} successful.`);
    setPhone('');
    setAmount('');
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Buy Airtime</h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Phone Number */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                inputMode="numeric"
                maxLength={14}
                value={displayPhone}
                onChange={handlePhoneChange}
                placeholder="0801 234 5678"
                className="w-full py-3 px-4 pr-28 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={handleSelectContact}
                className="absolute right-2 top-1/2 -translate-y-1/2 py-2 px-3 rounded-lg text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-hover)]"
              >
                Select Contact
              </button>
            </div>
            {phone.length > 0 && phone.length !== 11 && (
              <p className="text-xs text-[var(--error)]">Phone number must be 11 digits</p>
            )}
            {contactMessage && (
              <p className="text-xs text-[var(--text-muted)] mt-1">{contactMessage}</p>
            )}
          </div>

          {/* Network Selector */}
          <NetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />

          {/* Amount Selector */}
          <AmountSelector
            selectedAmount={amount}
            onAmountChange={setAmount}
            amountToPay={amountToPay}
            balance={
              user?.wallet != null
                ? `₦${Number(user.wallet).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
                : undefined
            }
          />

          {amountNum > 0 && !isValidAmount && (
            <p className="text-xs text-[var(--error)]">Please enter a valid amount greater than ₦0</p>
          )}

          <div className="flex-1 min-h-[40px]" />

          {/* Pay Button */}
          <PayButton
            fullWidth
            loading={false}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handlePay}
          >
            Pay
          </PayButton>
        </div>
      </div>
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Airtime Purchase"
        subtitle={`Amount: ₦${amountNum.toLocaleString()} • ${displayPhone}`}
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default BuyAirtime;
