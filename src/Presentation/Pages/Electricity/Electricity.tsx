import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import DiscoSelector, { type DiscoCompany } from './Components/DiscoSelector';
import MeterTypeSelector, { type MeterType } from './Components/MeterTypeSelector';
import AmountSelector from '../BuyAirtime/Components/AmountSelector';
import { servicesApi } from '../../../core/api';

const FALLBACK_DISCO_COMPANIES: DiscoCompany[] = [
  { name: 'EKEDC', code: 'ekedc' },
  { name: 'IKEDC', code: 'ikedc' },
  { name: 'KAEDCO', code: 'kaedco' },
  { name: 'KEDCO', code: 'kedco' },
  { name: 'PHED', code: 'phed' },
  { name: 'IBEDC', code: 'ibedc' },
  { name: 'EEDC', code: 'eedc' },
  { name: 'AEDC', code: 'aedc' },
  { name: 'JED', code: 'jed' },
];

/** Normalize API response: support data as array, data.companies, and snake_case (company_name, company_code). */
function normalizeElectricityCompanies(raw: unknown): DiscoCompany[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    list = (obj.companies ?? obj.data ?? []) as unknown[];
  }
  return list
    .filter((c): c is Record<string, unknown> => c != null && typeof c === 'object')
    .map((c) => {
      const name = String(c.name ?? c.company_name ?? '').trim();
      const code = String(c.code ?? c.company_code ?? '').trim();
      return { name: name || code || 'Unknown', code: code || name.toLowerCase().replace(/\s+/g, '_') };
    })
    .filter((c) => c.name && c.code);
}

const Electricity = () => {
  const [discoCompanies, setDiscoCompanies] = useState<DiscoCompany[]>(FALLBACK_DISCO_COMPANIES);
  const [selectedDisco, setSelectedDisco] = useState<string | null>(null);
  const [selectedMeterType, setSelectedMeterType] = useState<MeterType | null>(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isMeterValidated, setIsMeterValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);

  useEffect(() => {
    servicesApi.getElectricityCompanies().then((res) => {
      const raw = res?.data;
      const list = normalizeElectricityCompanies(raw);
      if (Array.isArray(list) && list.length > 0) {
        setDiscoCompanies(list);
      }
    }).catch(() => {});
  }, []);

  const amountNum = amount ? parseFloat(amount) : 0;
  const amountToPay = amountNum; // Dashboard: no charge discount for now
  const hasValidAmount = amountNum > 0;

  const updateAmountError = (value: string) => {
    if (!value) {
      setAmountError('');
      return;
    }
    const num = parseFloat(value);
    if (Number.isNaN(num) || num <= 0) {
      setAmountError('Please enter a valid amount greater than ₦0');
    } else {
      setAmountError('');
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    updateAmountError(value);
  };

  const canValidate =
    !!selectedDisco &&
    !!selectedMeterType &&
    meterNumber.trim().length > 0 &&
    !isSubmitting;

  const canPay =
    isMeterValidated &&
    !!selectedDisco &&
    !!selectedMeterType &&
    meterNumber.trim().length > 0 &&
    hasValidAmount &&
    !amountError &&
    !isSubmitting;

  const handleValidate = async () => {
    if (!canValidate || !selectedDisco || !selectedMeterType) return;
    setIsSubmitting(true);
    setCustomerName('');
    try {
      const res = await servicesApi.validateMeter({
        meter_number: meterNumber.trim(),
        meter_type: selectedMeterType,
        company_code: selectedDisco,
      });
      const data = res?.data as { customer_name?: string; customer_details?: string } | undefined;
      const name = data?.customer_details?.trim() || data?.customer_name?.trim();
      if (name) setCustomerName(name);
      setIsMeterValidated(true);
      toast.success('Meter validated successfully.');
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
    if (!selectedDisco || !selectedMeterType || !amount) return;
    await servicesApi.buyElectricity({
      meter_number: meterNumber.trim(),
      meter_type: selectedMeterType,
      company_code: selectedDisco,
      amount,
      customer_name: customerName || 'Customer',
      transaction_pin: transactionPin,
    });
    toast.success(`Electricity purchase of ₦${amountNum.toLocaleString()} successful.`);
    setMeterNumber('');
    setAmount('');
    setCustomerName('');
    setIsMeterValidated(false);
  };

  const handleAction = () => {
    if (isMeterValidated) {
      handlePay();
    } else {
      handleValidate();
    }
  };

  const actionDisabled = isMeterValidated ? !canPay : !canValidate;
  const buttonLabel = isSubmitting
    ? 'Processing...'
    : isMeterValidated
      ? 'Continue'
      : 'Validate';

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Buy Electricity</h1>
        </div>

        <div className="flex flex-col gap-5">
          <DiscoSelector
            selectedDisco={selectedDisco}
            discoCompanies={discoCompanies}
            onDiscoSelected={setSelectedDisco}
          />

          <MeterTypeSelector
            selectedMeterType={selectedMeterType}
            onMeterTypeSelected={setSelectedMeterType}
          />

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter Meter Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, '').slice(0, 20))}
              placeholder="Meter Number"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {isMeterValidated && customerName && (
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Customer details</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{customerName}</p>
            </div>
          )}

          <AmountSelector
            selectedAmount={amount}
            onAmountChange={handleAmountChange}
            amountToPay={amountToPay}
            balance="₦125,450.00"
          />

          {amountError && (
            <p className="text-xs text-[var(--error)]">{amountError}</p>
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
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Electricity Purchase"
        subtitle={`Meter: ${meterNumber} • Amount: ₦${amountNum.toLocaleString()}`}
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default Electricity;
