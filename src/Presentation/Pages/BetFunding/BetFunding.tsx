import { useState } from 'react';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import BetCompanySelector from './Components/BetCompanySelector';
import AmountSelector from '../BuyAirtime/Components/AmountSelector';

const BetFunding = () => {
  const [userId, setUserId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNum = amount ? parseFloat(amount) : 0;
  const amountToPay = amountNum;
  const isValidAmount = amountNum > 0;
  const hasUserId = userId.trim().length > 0;
  const canPay =
    hasUserId &&
    !!selectedCompany &&
    isValidAmount &&
    !isSubmitting;

  const handlePay = () => {
    if (!canPay) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        `Bet funding successful.\nPlatform: ${selectedCompany}\nUser: ${userId}\nAmount: ₦${amountNum.toLocaleString()}`
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
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Bet Funding</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter UserId / Phone Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={userId}
              onChange={(e) => setUserId(e.target.value.replace(/\D/g, '').slice(0, 20))}
              placeholder="User Id / Phone Number"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <BetCompanySelector
            selectedCompany={selectedCompany}
            onSelect={setSelectedCompany}
          />

          <AmountSelector
            selectedAmount={amount}
            onAmountChange={setAmount}
            amountToPay={amountToPay}
            balance="₦125,450.00"
          />

          {amountNum > 0 && !isValidAmount && (
            <p className="text-xs text-[var(--error)]">Please enter a valid amount greater than ₦0</p>
          )}

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
    </div>
  );
};

export default BetFunding;
