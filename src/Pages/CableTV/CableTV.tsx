import { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import CableProviderSelector from './Components/CableProviderSelector';
import CablePlanSelector, { type CablePlan } from './Components/CablePlanSelector';

// Mock plans per provider (plan name + amount)
const MOCK_PLANS_BY_PROVIDER: Record<string, CablePlan[]> = {
  DSTV: [
    { id: 'dstv-compact', plan: 'DStv Compact', amount: 10500 },
    { id: 'dstv-compact-plus', plan: 'DStv Compact Plus', amount: 16200 },
    { id: 'dstv-premium', plan: 'DStv Premium', amount: 21000 },
    { id: 'dstv-asian', plan: 'DStv Asian', amount: 8500 },
  ],
  GOTV: [
    { id: 'gotv-max', plan: 'GoTV Max', amount: 3300 },
    { id: 'gotv-plus', plan: 'GoTV Plus', amount: 2200 },
    { id: 'gotv-supa', plan: 'GoTV Supa', amount: 5400 },
    { id: 'gotv-supa-plus', plan: 'GoTV Supa Plus', amount: 6600 },
  ],
  STARTIMES: [
    { id: 'startimes-nova', plan: 'Nova', amount: 1500 },
    { id: 'startimes-basic', plan: 'Basic', amount: 2500 },
    { id: 'startimes-classic', plan: 'Classic', amount: 4500 },
    { id: 'startimes-nova-plus', plan: 'Nova Plus', amount: 3200 },
  ],
  SHOWMAX: [
    { id: 'showmax-mobile', plan: 'Showmax Mobile', amount: 1200 },
    { id: 'showmax-standard', plan: 'Showmax Standard', amount: 2400 },
    { id: 'showmax-premium', plan: 'Showmax Premium', amount: 4200 },
  ],
};

const CableTV = () => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CablePlan | null>(null);
  const [iucNumber, setIucNumber] = useState('');
  const [isIucValidated, setIsIucValidated] = useState(false);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans = selectedProvider ? MOCK_PLANS_BY_PROVIDER[selectedProvider] ?? [] : [];

  // Clear plan when provider changes
  useEffect(() => {
    setSelectedPlan(null);
  }, [selectedProvider]);

  const canValidate =
    !!selectedProvider &&
    !!selectedPlan &&
    iucNumber.trim().length > 0 &&
    !isSubmitting;

  const canPay = isIucValidated && !!selectedProvider && !!selectedPlan && iucNumber.trim().length > 0 && !isSubmitting;

  const handleValidate = () => {
    if (!canValidate) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsIucValidated(true);
      setIsSubmitting(false);
    }, 800);
  };

  const handlePay = () => {
    if (!canPay) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        `Cable TV subscription successful.\nProvider: ${selectedProvider}\nPlan: ${selectedPlan?.plan}\nIUC: ${iucNumber}\nAmount: ₦${selectedPlan?.amount.toLocaleString()}`
      );
    }, 1000);
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
      />
    </div>
  );
};

export default CableTV;
