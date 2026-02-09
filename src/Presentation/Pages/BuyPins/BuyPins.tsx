import { useState } from 'react';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import { servicesApi } from '../../../core/api';

const EXAM_TYPE_LOGOS: Record<string, string> = {
  JAMB: '/img/jamb.png',
  NECO: '/img/neco.png',
  WAEC: '/img/waec.png',
  NABTEB: '/img/nabteb.png',
};

const EXAM_TYPES = [
  { name: 'JAMB', amount: 5000 },
  { name: 'NECO', amount: 1500 },
  { name: 'WAEC', amount: 1500 },
  { name: 'NABTEB', amount: 1500 },
] as const;

const BuyPins = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [nameOnCard, setNameOnCard] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const exam = EXAM_TYPES.find((e) => e.name === selectedExam);
  const amountPerPin = exam?.amount ?? 0;
  const qty = quantity ? parseInt(quantity, 10) : 0;
  const totalAmount = amountPerPin * (Number.isNaN(qty) ? 0 : Math.max(0, qty));

  const isFormValid =
    !!selectedExam &&
    nameOnCard.trim().length > 0 &&
    qty >= 1;

  const handleContinue = () => {
    if (!isFormValid) return;
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    if (!selectedExam || qty < 1 || !exam) return;
    await servicesApi.buyRechargePins({
      pin_name: selectedExam,
      name_on_card: nameOnCard.trim(),
      quantity: qty,
      amount: amountPerPin,
      transaction_pin: transactionPin,
    });
    toast.success(`Exam pin purchase: ${selectedExam} x ${qty} - ₦${totalAmount.toLocaleString()} successful.`);
    setSelectedExam(null);
    setNameOnCard('');
    setQuantity('');
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Buy Pins</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Select Exam Type
            </label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {EXAM_TYPES.map((type) => {
                const isSelected = selectedExam === type.name;
                return (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() => setSelectedExam(type.name)}
                    className={`flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px] py-2 sm:py-3 rounded-xl border-2 shrink-0 transition-all
                      ${isSelected
                        ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                        : 'bg-[var(--bg-tertiary)] border-transparent border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                      }`}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 shrink-0 p-0.5">
                      <img
                        src={EXAM_TYPE_LOGOS[type.name]}
                        alt={type.name}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold truncate max-w-full px-0.5">
                      {type.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                      ₦{type.amount.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedExam && (
            <div className="rounded-xl p-4 bg-[var(--accent-hover)] border border-[var(--accent-primary)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Amount per Pin:
                </span>
                <span className="text-base font-bold text-[var(--accent-primary)]">
                  ₦{amountPerPin.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Name on Card
            </label>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              placeholder="Enter name"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Quantity
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter quantity"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <p className="text-xs text-[var(--text-muted)]">Minimum quantity: 1</p>
          </div>

          {totalAmount > 0 && (
            <div className="rounded-xl p-4 bg-[var(--success)]/10 border border-[var(--success)]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-[var(--success)]">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            text="Continue"
            loading={false}
            loadingText="Processing..."
            disabled={!isFormValid}
            onClick={handleContinue}
          />
        </div>
      </div>
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Exam Pin Purchase"
        subtitle={selectedExam ? `${selectedExam} x ${qty} • ₦${totalAmount.toLocaleString()}` : undefined}
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default BuyPins;
