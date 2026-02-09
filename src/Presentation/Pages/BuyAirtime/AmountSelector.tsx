import { useEffect, useState } from 'react';

type Props = {
  selectedAmount?: string;
  onAmountSelected: (amount: string) => void;
  amountToPay?: number;
  balance?: number;
};

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AmountSelector({ selectedAmount = '', onAmountSelected, amountToPay = 0, balance }: Props) {
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState(selectedAmount);

  useEffect(() => {
    setInputValue(selectedAmount);
    setSelectedChip(selectedAmount ? Number(selectedAmount) : null);
  }, [selectedAmount]);

  function handleInput(v: string) {
    const sanitized = v.replace(/[^0-9]/g, '');
    setInputValue(sanitized);
    onAmountSelected(sanitized);
    setSelectedChip(null);
  }

  function handleChip(amount: number) {
    setSelectedChip(amount);
    setInputValue(amount.toString());
    onAmountSelected(amount.toString());
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Enter Amount</span>
        {typeof balance === 'number' && <span className="text-xs">Balance: ₦{balance.toFixed(2)}</span>}
      </div>

      <div className="p-3 bg-white rounded-md shadow-sm">
        <input
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          inputMode="numeric"
          placeholder="Amount"
          className="w-full p-2 border rounded-md outline-none"
        />
        {amountToPay > 0 && <div className="text-sm text-yellow-600 mt-2">Amount to pay: ₦{amountToPay}</div>}

        <div className="flex flex-wrap gap-2 mt-3">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => handleChip(amt)}
              className={`px-3 py-1 rounded-md border ${selectedChip === amt ? 'bg-yellow-100 border-yellow-400' : 'bg-white'}`}
            >
              ₦{amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
