import React from 'react';

type Props = {
  selectedAmount?: string;
  onAmountChange: (amount: string) => void;
  amountToPay?: number;
};

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AmountSelector({
  selectedAmount = '',
  onAmountChange,
  amountToPay = 0,
}: Props) {
  const [selectedChip, setSelectedChip] = React.useState<number | null>(null);
  const [inputValue, setInputValue] = React.useState(selectedAmount);

  React.useEffect(() => {
    setInputValue(selectedAmount);
    setSelectedChip(selectedAmount ? Number(selectedAmount) : null);
  }, [selectedAmount]);

  function handleInput(v: string) {
    const sanitized = v.replace(/[^0-9]/g, '');
    setInputValue(sanitized);
    onAmountChange(sanitized);
    setSelectedChip(null);
  }

  function handleChip(amount: number) {
    setSelectedChip(amount);
    setInputValue(amount.toString());
    onAmountChange(amount.toString());
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-[var(--text-secondary)]">Select Amount</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => handleChip(amt)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedChip === amt
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
            }`}
          >
            ₦{amt}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Amount</label>
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="0"
          className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
        {amountToPay > 0 && (
          <p className="text-xs text-[var(--accent-primary)]">
            Amount to pay: ₦{amountToPay.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
