import { useState } from 'react';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import DiscoSelector, { type DiscoCompany } from './Components/DiscoSelector';
import MeterTypeSelector, { type MeterType } from './Components/MeterTypeSelector';
import AmountSelector from '../BuyAirtime/Components/AmountSelector';

const MOCK_DISCO_COMPANIES: DiscoCompany[] = [
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

const Electricity = () => {
  const [selectedDisco, setSelectedDisco] = useState<string | null>(null);
  const [selectedMeterType, setSelectedMeterType] = useState<MeterType | null>(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isMeterValidated, setIsMeterValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountError, setAmountError] = useState('');

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

  const handleValidate = () => {
    if (!canValidate) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsMeterValidated(true);
      setIsSubmitting(false);
    }, 800);
  };

  const handlePay = () => {
    if (!canPay) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const discoName =
        MOCK_DISCO_COMPANIES.find((c) => c.code === selectedDisco)?.name ?? selectedDisco;
      alert(
        `Electricity purchase successful.\nDisco: ${discoName}\nMeter: ${meterNumber}\nAmount: ₦${amountNum.toLocaleString()}`
      );
    }, 1000);
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
            discoCompanies={MOCK_DISCO_COMPANIES}
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
    </div>
  );
};

export default Electricity;
