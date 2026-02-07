import { useState, useMemo, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import DataNetworkSelector from './Components/DataNetworkSelector';
import DataTypeSelect from './Components/DataTypeSelect';
import PlanSelector, { type DataPlan } from './Components/PlanSelector';
import { getNetworkFromPhone } from './utils/phoneNetwork';
import { pickContact, isContactPickerSupported } from './utils/contactPicker';
import { servicesApi } from '../../../core/api';

/** Map API plan (id may be number) to DataPlan */
function mapApiPlanToDataPlan(raw: { id?: number | string; network?: string; type?: string; amount?: number | string; size?: string }): DataPlan {
  const id = raw.id != null ? String(raw.id) : '';
  const amount = typeof raw.amount === 'number' ? raw.amount : parseFloat(String(raw.amount ?? 0)) || 0;
  return {
    id,
    network: String(raw.network ?? ''),
    type: String(raw.type ?? ''),
    amount,
    size: String(raw.size ?? ''),
  };
}

/** Display order for networks in Buy Data */
const DATA_NETWORK_ORDER = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];

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
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [allPlans, setAllPlans] = useState<DataPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    servicesApi
      .getDataPlans()
      .then((res) => {
        const data = res?.data as unknown;
        let list: unknown[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === 'object') {
          const obj = data as Record<string, unknown>;
          list = (obj.plans ?? obj.data_plans ?? obj.data ?? []) as unknown[];
        }
        if (Array.isArray(list) && list.length > 0) {
          setAllPlans(list.map((p: Record<string, unknown>) => mapApiPlanToDataPlan(p)));
        }
      })
      .catch(() => {
        toast.error('Failed to load data plans');
      })
      .finally(() => {
        setLoadingPlans(false);
      });
  }, []);

  /** Networks that have at least one plan (from API), in order: MTN, AIRTEL, GLO, 9MOBILE */
  const networksFromApi = useMemo(() => {
    const set = new Set(allPlans.map((p) => p.network).filter((n) => n.trim() !== ''));
    if (set.size === 0) return DATA_NETWORK_ORDER;
    const ordered: string[] = [];
    for (const name of DATA_NETWORK_ORDER) {
      const found = Array.from(set).find((n) => n.toUpperCase() === name);
      if (found) {
        ordered.push(found);
        set.delete(found);
      }
    }
    return ordered.concat(Array.from(set).sort((a, b) => a.localeCompare(b)));
  }, [allPlans]);

  /** Data types for the selected network (from API). Fallback when none. */
  const dataTypesFromApi = useMemo(() => {
    if (!selectedNetwork) return [];
    const set = new Set(
      allPlans
        .filter((p) => p.network.toLowerCase() === selectedNetwork.toLowerCase())
        .map((p) => p.type)
        .filter((t) => t.trim() !== '')
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b)).map((code) => ({
      code,
      name: code.charAt(0).toUpperCase() + code.slice(1).toLowerCase(),
    }));
  }, [allPlans, selectedNetwork]);

  const filteredPlans = useMemo(() => {
    if (!selectedNetwork) return [];
    return allPlans.filter(
      (p) =>
        p.network.toLowerCase() === selectedNetwork?.toLowerCase() &&
        (!selectedDataType || p.type.toLowerCase() === selectedDataType.toLowerCase())
    );
  }, [allPlans, selectedNetwork, selectedDataType]);

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
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    if (!selectedNetwork || !selectedPlan || !phone) return;
    await servicesApi.buyData({
      network: selectedNetwork,
      phone_number: phone,
      plan_id: selectedPlan.id,
      transaction_pin: transactionPin,
    });
    toast.success(`Data purchase: ${selectedPlan.size} - ₦${selectedPlan.amount.toLocaleString()} to ${displayPhone} successful.`);
    setPhone('');
    setSelectedPlan(null);
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

          {/* Network Selector (networks from API) */}
          <DataNetworkSelector
            networks={networksFromApi}
            selectedNetwork={selectedNetwork}
            onSelect={setSelectedNetwork}
            loading={loadingPlans}
          />

          {/* Data Type (types from API for selected network) */}
          <DataTypeSelect
            dataTypes={dataTypesFromApi}
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
            text="Pay"
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handlePay}
          />
        </div>
      </div>

      <PlanSelector
        isOpen={planSheetOpen}
        onClose={() => setPlanSheetOpen(false)}
        plans={filteredPlans}
        selectedPlan={selectedPlan}
        onSelect={setSelectedPlan}
        isLoading={loadingPlans}
      />
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Data Purchase"
        subtitle={selectedPlan ? `${selectedPlan.size} • ₦${selectedPlan.amount.toLocaleString()} • ${displayPhone}` : undefined}
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default BuyData;
