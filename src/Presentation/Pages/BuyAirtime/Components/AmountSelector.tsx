const DEFAULT_AMOUNT_CHIPS = [100, 200, 500, 1000, 2000, 5000];
export const ELECTRICITY_AMOUNT_CHIPS = [2000, 3000, 5000, 10000, 20000, 50000];

interface AmountSelectorProps {
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
  amountToPay?: number;
  balance?: string;
  /** Custom amount chips (e.g. for electricity). Defaults to airtime amounts. */
  amountChips?: number[];
  /** Minimum valid amount for validation. */
  minAmount?: number;
}

const AmountSelector = ({
  selectedAmount,
  onAmountChange,
  amountToPay = 0,
  balance,
  amountChips,
  minAmount = 0,
}: AmountSelectorProps) => {
  const chips = amountChips ?? DEFAULT_AMOUNT_CHIPS;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onAmountChange(value);
  };

  const selectedChip = selectedAmount ? parseInt(selectedAmount, 10) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Amount</label>
        {balance != null && (
          <span className="text-xs text-[var(--text-muted)]">Balance: {balance}</span>
        )}
      </div>
      <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-4">
        <input
          type="number"
          inputMode="numeric"
          min={minAmount}
          value={selectedAmount}
          onChange={handleInputChange}
          placeholder="Amount"
          className="w-full py-3 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
        {amountToPay > 0 && (
          <p className="text-xs text-[var(--accent-primary)] font-medium mt-2">Amount to pay: ₦{amountToPay.toLocaleString()}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {chips.map((amount) => {
            const isSelected = selectedChip === amount;
            return (
              <button
                key={amount}
                type="button"
                onClick={() => onAmountChange(isSelected ? '' : String(amount))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                  ${isSelected
                    ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                  }`}
              >
                ₦{amount.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AmountSelector;
