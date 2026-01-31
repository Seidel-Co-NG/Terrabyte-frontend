import { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import InternetNetworkSelector from './Components/InternetNetworkSelector';
import InternetPlanSelector, { type InternetPlan } from './Components/InternetPlanSelector';
import { pickContact, isContactPickerSupported } from '../BuyData/utils/contactPicker';

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

// Mock plans per network
const MOCK_PLANS_BY_NETWORK: Record<string, InternetPlan[]> = {
  SMILE: [
    { id: 'smile-1gb', size: '1GB', amount: 1500, type: 'Monthly' },
    { id: 'smile-2gb', size: '2GB', amount: 2500, type: 'Monthly' },
    { id: 'smile-5gb', size: '5GB', amount: 5000, type: 'Monthly' },
    { id: 'smile-10gb', size: '10GB', amount: 9000, type: 'Monthly' },
  ],
  SPECTRANET: [
    { id: 'spectra-1gb', size: '1GB', amount: 1200, type: 'Monthly' },
    { id: 'spectra-2gb', size: '2GB', amount: 2200, type: 'Monthly' },
    { id: 'spectra-5gb', size: '5GB', amount: 4500, type: 'Monthly' },
    { id: 'spectra-unlimited', size: 'Unlimited', amount: 15000, type: 'Monthly' },
  ],
  RATEL: [
    { id: 'ratel-1gb', size: '1GB', amount: 1300, type: 'Monthly' },
    { id: 'ratel-2gb', size: '2GB', amount: 2300, type: 'Monthly' },
    { id: 'ratel-5gb', size: '5GB', amount: 4800, type: 'Monthly' },
    { id: 'ratel-10gb', size: '10GB', amount: 8800, type: 'Monthly' },
  ],
  KIRANI: [
    { id: 'kirani-1gb', size: '1GB', amount: 1400, type: 'Monthly' },
    { id: 'kirani-2gb', size: '2GB', amount: 2400, type: 'Monthly' },
    { id: 'kirani-5gb', size: '5GB', amount: 4900, type: 'Monthly' },
    { id: 'kirani-unlimited', size: 'Unlimited', amount: 14000, type: 'Monthly' },
  ],
};

const Internet = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InternetPlan | null>(null);
  const [phone, setPhone] = useState('');
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState<string | null>(null);

  const plans = selectedNetwork ? MOCK_PLANS_BY_NETWORK[selectedNetwork] ?? [] : [];

  useEffect(() => {
    setSelectedPlan(null);
  }, [selectedNetwork]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(raw);
    setContactMessage(null);
  };

  const handleSelectContact = async () => {
    setContactMessage(null);
    if (!isContactPickerSupported()) {
      setContactMessage('Contact picker is not supported. Enter the number manually.');
      return;
    }
    try {
      const result = await pickContact();
      if (result) setPhone(result.phone.replace(/\D/g, '').slice(0, 11));
      else setContactMessage('No contact selected or no phone number.');
    } catch {
      setContactMessage('Could not open contacts. Enter the number manually.');
    }
  };

  const displayPhone = formatPhone(phone);
  const isValidPhone = phone.length === 11;
  const canPay =
    !!selectedNetwork &&
    !!selectedPlan &&
    isValidPhone &&
    !isSubmitting;

  const handlePay = () => {
    if (!canPay) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        `Internet purchase successful.\nNetwork: ${selectedNetwork}\nPlan: ${selectedPlan?.size}\nPhone: ${displayPhone}\nAmount: ₦${selectedPlan?.amount.toLocaleString()}`
      );
    }, 1000);
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Internet Plans</h1>
        </div>

        <div className="flex flex-col gap-5">
          <InternetNetworkSelector
            selectedNetwork={selectedNetwork}
            onSelect={setSelectedNetwork}
          />

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Select Data Plan
            </label>
            <button
              type="button"
              onClick={() => selectedNetwork && setPlanSheetOpen(true)}
              disabled={!selectedNetwork}
              className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={selectedPlan ? '' : 'text-[var(--text-muted)]'}>
                {selectedPlan
                  ? `${selectedPlan.size} (₦${selectedPlan.amount.toLocaleString()})`
                  : 'Choose data plan'}
              </span>
              <FiChevronDown className="w-5 h-5 text-[var(--text-muted)] shrink-0 ml-2" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter Phone Number
            </label>
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

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            text="Pay"
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!canPay}
            onClick={handlePay}
          />
        </div>
      </div>

      <InternetPlanSelector
        isOpen={planSheetOpen}
        onClose={() => setPlanSheetOpen(false)}
        plans={plans}
        selectedPlan={selectedPlan}
        onSelect={setSelectedPlan}
      />
    </div>
  );
};

export default Internet;
