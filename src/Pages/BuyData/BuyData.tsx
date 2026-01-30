import { useState, useMemo, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import DataNetworkSelector from './Components/DataNetworkSelector';
import DataTypeSelect from './Components/DataTypeSelect';
import PlanSelector, { type DataPlan } from './Components/PlanSelector';
import { getNetworkFromPhone } from './utils/phoneNetwork';
import { pickContact, isContactPickerSupported } from './utils/contactPicker';

// Mock plans – replace with API later (include SME, GIFTING, DIRECT so Pay can enable for any type)
const MOCK_PLANS: DataPlan[] = [
  { id: '1', size: '500MB', amount: 200, type: 'SME', network: 'MTN' },
  { id: '2', size: '1GB', amount: 300, type: 'SME', network: 'MTN' },
  { id: '3', size: '2GB', amount: 500, type: 'SME', network: 'MTN' },
  { id: '4', size: '5GB', amount: 1000, type: 'SME', network: 'MTN' },
  { id: '5', size: '10GB', amount: 2000, type: 'SME', network: 'MTN' },
  { id: '6', size: '1GB', amount: 350, type: 'SME', network: 'GLO' },
  { id: '7', size: '2GB', amount: 550, type: 'SME', network: 'GLO' },
  { id: '8', size: '1GB', amount: 320, type: 'SME', network: 'AIRTEL' },
  { id: '9', size: '2GB', amount: 520, type: 'SME', network: 'AIRTEL' },
  { id: '10', size: '1GB', amount: 300, type: 'SME', network: '9MOBILE' },
  { id: '11', size: '1GB', amount: 350, type: 'GIFTING', network: 'MTN' },
  { id: '12', size: '2GB', amount: 550, type: 'GIFTING', network: 'MTN' },
  { id: '13', size: '1GB', amount: 330, type: 'DIRECT', network: 'MTN' },
  { id: '14', size: '2GB', amount: 520, type: 'DIRECT', network: 'MTN' },
];

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

const BuyData = () => {
  const [phone, setPhone] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedDataType, setSelectedDataType] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPlans = useMemo(() => {
    if (!selectedNetwork) return [];
    return MOCK_PLANS.filter(
      (p) =>
        p.network.toLowerCase() === selectedNetwork?.toLowerCase() &&
        (!selectedDataType || p.type.toLowerCase() === selectedDataType.toLowerCase())
    );
  }, [selectedNetwork, selectedDataType]);

  // Clear selected plan when network or data type changes so it always matches current filter
  useEffect(() => {
    if (!selectedPlan) return;
    const stillInList = filteredPlans.some((p) => p.id === selectedPlan.id);
    if (!stillInList) setSelectedPlan(null);
  }, [selectedNetwork, selectedDataType, filteredPlans, selectedPlan]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(raw);
    setContactMessage(null);
    // Auto-detect network after first 5 digits and set active on network selection
    if (raw.length >= 5) {
      const detected = getNetworkFromPhone(raw);
      if (detected) setSelectedNetwork(detected);
    }
  };

  const handleSelectContact = async () => {
    setContactMessage(null);
    if (!isContactPickerSupported()) {
      setContactMessage('Contact picker is not supported in this browser. Please enter the number manually.');
      return;
    }
    try {
      const result = await pickContact();
      if (result) {
        setPhone(result.phone);
        const detected = getNetworkFromPhone(result.phone);
        if (detected) setSelectedNetwork(detected);
      } else {
        setContactMessage('No contact selected or contact has no phone number.');
      }
    } catch {
      setContactMessage('Could not open contacts. Please enter the number manually.');
    }
  };

  const displayPhone = formatPhone(phone);
  const isValidPhone = phone.length === 11;
  const hasDataType = selectedDataType != null && selectedDataType.trim() !== '';
  const canSubmit =
    isValidPhone && !!selectedNetwork && hasDataType && !!selectedPlan && !isSubmitting;

  const handlePay = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Data purchase: ${selectedPlan?.size} to ${displayPhone} on ${selectedNetwork}. Amount: ₦${selectedPlan?.amount}`);
    }, 1000);
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Buy Data</h1>
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
          <DataNetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />

          {/* Data Type */}
          <DataTypeSelect
            selectedDataType={selectedDataType}
            onSelect={setSelectedDataType}
            disabled={!selectedNetwork}
          />

          {/* Data Plan */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Select Data Plan</label>
            <button
              type="button"
              onClick={() => setPlanSheetOpen(true)}
              disabled={!selectedNetwork || !selectedDataType}
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

          <div className="flex-1 min-h-[40px]" />

          {/* Pay Button */}
          <PayButton
            fullWidth
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handlePay}
          >
            
          </PayButton>
        </div>
      </div>

      <PlanSelector
        isOpen={planSheetOpen}
        onClose={() => setPlanSheetOpen(false)}
        plans={filteredPlans}
        selectedPlan={selectedPlan}
        onSelect={setSelectedPlan}
      />
    </div>
  );
};

export default BuyData;
