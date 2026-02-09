import { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import CableProviderSelector, { type CableProviderItem } from './Components/CableProviderSelector';
import CablePlanSelector, { type CablePlan } from './Components/CablePlanSelector';
import { servicesApi } from '../../../core/api';

const FALLBACK_CABLE_PROVIDERS: CableProviderItem[] = [
  { name: 'GOTV', code: 'GOTV' },
  { name: 'DSTV', code: 'DSTV' },
  { name: 'STARTIMES', code: 'STARTIMES' },
  { name: 'SHOWMAX', code: 'SHOWMAX' },
];

/** Normalize API cable plan (id, plan, amount; id may be number). */
function mapApiPlanToCablePlan(raw: { id?: number | string; plan?: string; amount?: number | string }): CablePlan {
  const id = raw.id != null ? String(raw.id) : '';
  const amount = typeof raw.amount === 'number' ? raw.amount : parseFloat(String(raw.amount ?? 0)) || 0;
  return {
    id,
    plan: String(raw.plan ?? ''),
    amount,
  };
}

/** Normalize API response for cable companies/providers. */
function normalizeCableProviders(raw: unknown): CableProviderItem[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    list = (obj.companies ?? obj.providers ?? obj.data ?? []) as unknown[];
  }
  return list
    .filter((c): c is Record<string, unknown> => c != null && typeof c === 'object')
    .map((c) => {
      const name = String(c.name ?? c.cable ?? c.provider ?? '').trim().toUpperCase();
      const code = String(c.code ?? c.cable ?? c.name ?? '').trim().toUpperCase() || name;
      return { name: name || code, code: code || name };
    })
    .filter((c) => c.name && c.code);
}

const CableTV = () => {
  const [cableProviders, setCableProviders] = useState<CableProviderItem[]>(FALLBACK_CABLE_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CablePlan | null>(null);
  const [plans, setPlans] = useState<CablePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [iucNumber, setIucNumber] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [isIucValidated, setIsIucValidated] = useState(false);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  // Load cable providers from API
  useEffect(() => {
    servicesApi.getCableCompanies().then((res) => {
      const raw = res?.data;
      const list = normalizeCableProviders(raw);
      if (Array.isArray(list) && list.length > 0) setCableProviders(list);
    }).catch(() => {});
  }, []);

  // Clear plan when provider changes
  useEffect(() => {
    setSelectedPlan(null);
    setPlans([]);
    if (!selectedProvider) {
      setLoadingPlans(false);
      return;
    }
    setLoadingPlans(true);
    servicesApi
      .getCablePlans(selectedProvider)
      .then((res) => {
        const raw = res?.data;
        let list: unknown[] = [];
        if (Array.isArray(raw)) list = raw;
        else if (raw && typeof raw === 'object') {
          const obj = raw as Record<string, unknown>;
          list = (obj.plans ?? obj.data ?? []) as unknown[];
        }
        const mapped = list
          .filter((p): p is Record<string, unknown> => p != null && typeof p === 'object')
          .map((p) => mapApiPlanToCablePlan(p))
          .filter((p) => p.id && p.plan);
        setPlans(mapped);
      })
      .catch(() => {
        setPlans([]);
        toast.error('Failed to load cable plans');
      })
      .finally(() => setLoadingPlans(false));
  }, [selectedProvider]);

  const canValidate =
    !!selectedProvider &&
    !!selectedPlan &&
    iucNumber.trim().length > 0 &&
    !isSubmitting;

  const canPay = isIucValidated && !!selectedProvider && !!selectedPlan && iucNumber.trim().length > 0 && !isSubmitting;

  const handleValidate = async () => {
    if (!canValidate || !selectedProvider) return;
    setIsSubmitting(true);
    setCustomerDetails('');
    try {
      const res = await servicesApi.validateCable({
        iuc: iucNumber.trim(),
        cablename: selectedProvider,
      });
      const details = (res?.data as { customer_details?: string } | undefined)?.customer_details?.trim();
      if (details) setCustomerDetails(details);
      setIsIucValidated(true);
      toast.success('IUC validated successfully.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Validation failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePay = () => {
    if (!canPay) return;
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    if (!selectedProvider || !selectedPlan || !iucNumber.trim()) return;
    await servicesApi.buyCable({
      iuc: iucNumber.trim(),
      cablename: selectedProvider,
      cable_plan_id: selectedPlan.id,
      transaction_pin: transactionPin,
    });
    toast.success(`Cable TV subscription: ${selectedPlan.plan} - ₦${selectedPlan.amount.toLocaleString()} successful.`);
    setIucNumber('');
    setSelectedPlan(null);
    setIsIucValidated(false);
  };

  const handleAction = () => {
    if (isIucValidated) {
      handlePay();
    } else {
      handleValidate();
    }
  };

  const actionDisabled = isIucValidated ? !canPay : !canValidate;
  const buttonLabel = isSubmitting
    ? 'Processing...'
    : isIucValidated
      ? 'Continue'
      : 'Validate';

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Cable TV</h1>
        </div>

        <div className="flex flex-col gap-5">
          <CableProviderSelector
            providers={cableProviders}
            selectedProvider={selectedProvider}
            onSelect={setSelectedProvider}
          />

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Select Cable TV Plan
            </label>
            <button
              type="button"
              onClick={() => selectedProvider && setPlanSheetOpen(true)}
              disabled={!selectedProvider}
              className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={selectedPlan ? '' : 'text-[var(--text-muted)]'}>
                {selectedPlan
                  ? `${selectedPlan.plan} (₦${selectedPlan.amount.toLocaleString()})`
                  : 'Choose cable TV plan'}
              </span>
              <FiChevronDown className="w-5 h-5 text-[var(--text-muted)] shrink-0 ml-2" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter IUC Number
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={iucNumber}
                onChange={(e) => setIucNumber(e.target.value.replace(/\D/g, '').slice(0, 20))}
                placeholder="IUC Number"
                className="w-full py-3 px-4 pr-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              {isIucValidated && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--success)]"
                  title="Validated"
                >
                  ✓
                </span>
              )}
            </div>
          </div>

          {isIucValidated && customerDetails && (
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Customer details</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{customerDetails}</p>
            </div>
          )}

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            text={buttonLabel}
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={actionDisabled}
            onClick={handleAction}
          />
        </div>
      </div>

      <CablePlanSelector
        isOpen={planSheetOpen}
        onClose={() => setPlanSheetOpen(false)}
        plans={plans}
        selectedPlan={selectedPlan}
        onSelect={setSelectedPlan}
        isLoading={loadingPlans}
      />
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Cable TV Subscription"
        subtitle={selectedPlan ? `${selectedPlan.plan} • ₦${selectedPlan.amount.toLocaleString()} • IUC: ${iucNumber}` : undefined}
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default CableTV;
