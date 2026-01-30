import { useState } from 'react';
import { FiShield } from 'react-icons/fi';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 1500, 2000, 2500];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 2500;
const FEE = '1.5%';

const MonnifyFunding = () => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= MIN_AMOUNT && amountNum <= MAX_AMOUNT;
  const canProceed = isValidAmount && !isSubmitting;

  const handleProceed = () => {
    if (!canProceed) return;
    if (amountNum < MIN_AMOUNT) {
      alert('Minimum amount is ₦100');
      return;
    }
    if (amountNum > MAX_AMOUNT) {
      alert('Maximum amount for card payment is ₦2,500. Use bank transfer for larger amounts.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Redirecting to Monnify payment... (Demo: integrate Monnify payment URL/WebView)');
    }, 1000);
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/fund-wallet" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Monnify (Card Payment)</h1>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6 px-2">
          Maximum amount for card payment is ₦2,500. Use bank transfer for larger amounts. Fee: {FEE}
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Enter Amount (₦100 – ₦2,500)
            </label>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <input
                type="tel"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Amount"
                className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_AMOUNTS.map((a) => {
                  const isSelected = amount === String(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(isSelected ? '' : String(a))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <PayButton
            fullWidth
            text="Proceed to Payment"
            loading={isSubmitting}
            loadingText="Initializing payment..."
            disabled={!canProceed}
            onClick={handleProceed}
          />

          <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-xs">
            <FiShield className="w-4 h-4 shrink-0" />
            <span>Secure payment powered by Monnify</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonnifyFunding;
