import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import BankSelector from './Components/BankSelector';
import { useAuthStore } from '../../../core/stores/auth.store';

function formatMoney(value: string | number | undefined): string {
  if (value == null || value === '') return '₦0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return '₦0.00';
  return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const TransferToBank = () => {
  const user = useAuthStore((s) => s.user);
  const walletBalance = formatMoney(user?.wallet);

  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire to transfer-to-bank API when available
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Transfer to Bank</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <BankSelector value={selectedBank} onChange={setSelectedBank} />

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Enter Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Account Number"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Account Name
            </label>
            <input
              id="accountName"
              type="text"
              value={accountName}
              readOnly
              placeholder="Resolved from account number"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="amount" className="block text-sm font-medium text-[var(--text-secondary)]">
                Enter Amount
              </label>
              <span className="text-sm text-[var(--text-muted)]">Balance: {walletBalance}</span>
            </div>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d.]/g, '');
                const parts = v.split('.');
                if (parts.length <= 2 && (parts[1]?.length ?? 0) <= 2) setAmount(v);
              }}
              placeholder="0.00"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="flex-1 min-h-[40px]" />

          <button
            type="submit"
            disabled={!selectedBank || !accountNumber.trim() || !amount || parseFloat(amount) <= 0 || isSubmitting}
            className="w-full py-3.5 sm:py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? 'Processing...' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferToBank;
