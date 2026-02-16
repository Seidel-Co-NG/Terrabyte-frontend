import { Link } from 'react-router-dom';
import { FiCopy, FiCheck, FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../../../../core/stores/auth.store';

function formatMoney(value: string | number | undefined): string {
  if (value == null || value === '') return '₦0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return '₦0.00';
  return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const WalletBalance = () => {
  const [copied, setCopied] = useState(false);
  const user = useAuthStore((s) => s.user);
  const walletBalance = formatMoney(user?.wallet);
  const bonusBalance = formatMoney(user?.bonus);
  const firstAccount = Array.isArray(user?.reserved_account) && user.reserved_account.length > 0
    ? user.reserved_account[0]
    : null;
  const walletData = {
    walletBalance,
    bonusBalance,
    accountNumber: firstAccount?.account_number ?? '—',
    accountName: firstAccount?.account_name ?? user?.name ?? '—',
    bankName: firstAccount?.bank_name ?? '—',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center mb-0">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">Wallet Balance</h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-5 md:p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 min-w-0 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.1)] border border-[var(--accent-hover)] rounded-lg flex flex-col gap-1.5 sm:gap-2">
              <div className="text-xs sm:text-[0.85rem] text-[var(--text-secondary)] font-medium">Wallet Balance</div>
              <div className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[var(--success)] truncate" title={walletData.walletBalance}>{walletData.walletBalance}</div>
            </div>
            <div className="p-4 sm:p-5 min-w-0 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.1)] border border-[var(--accent-hover)] rounded-lg flex flex-col gap-1.5 sm:gap-2">
              <div className="text-xs sm:text-[0.85rem] text-[var(--text-secondary)] font-medium">Bonus Balance</div>
              <div className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[var(--warning)] truncate" title={walletData.bonusBalance}>{walletData.bonusBalance}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/dashboard/fund-wallet"
              className="flex items-center justify-center gap-2 sm:gap-3 py-3.5 sm:py-4 px-4 sm:px-6 border-none rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 text-center bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-[0_4px_12px_var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(168,85,247,0.4)] [&_span]:text-white [&_.btn-icon]:text-white no-underline min-w-0"
            >
              <span className="btn-icon text-lg sm:text-xl shrink-0 font-bold" aria-hidden>₦</span>
              <span>Fund Wallet</span>
            </Link>
            <Link
              to="/dashboard/transfer-to-bank"
              className="flex items-center justify-center gap-2 sm:gap-3 py-3.5 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.15)] text-[var(--text-primary)] border border-[var(--accent-hover)] hover:-translate-y-0.5 hover:border-[var(--accent-primary)] hover:shadow-[0_4px_12px_var(--accent-hover)] min-w-0 no-underline"
            >
              <FiCreditCard className="text-lg sm:text-xl shrink-0" />
              <span className="text-center">Withdraw balance</span>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex flex-col min-w-0">
          <div className="mb-3 sm:mb-4 pb-3 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <h4 className="text-base font-semibold text-[var(--text-primary)] m-0">Bank Account Details</h4>
            <Link
            to="fund-wallet/automated-transfer"
              type="button" 
              onClick={() => console.log('View all banks')}
              className="py-2 px-3 rounded-lg text-sm font-medium text-[var(--accent-primary)] bg-[var(--accent-hover)] border border-[var(--accent-hover)] cursor-pointer transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] shrink-0"
            >
              View all banks
            </Link>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 py-2">
              <span className="text-sm text-[var(--text-secondary)] font-medium">Account Number:</span>
              <div className="flex items-center gap-3 md:w-auto w-full md:justify-end justify-between">
                <span className="text-[0.95rem] text-[var(--text-primary)] font-semibold font-mono">{walletData.accountNumber}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(walletData.accountNumber)}
                  title="Copy account number"
                  className="p-1.5 rounded-md bg-[var(--accent-hover)] border border-[var(--accent-hover)] text-[var(--accent-primary)] cursor-pointer flex items-center justify-center transition-all hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] hover:scale-105"
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 py-2">
              <span className="text-sm text-[var(--text-secondary)] font-medium">Bank Name:</span>
              <span className="text-[0.95rem] text-[var(--text-primary)] font-semibold font-mono">{walletData.bankName}</span>
            </div>
          </div>

          <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-[0.85rem] text-[var(--warning)] m-0 leading-relaxed text-center">
              Make transfer to this account to fund your wallet, 1.5% charges apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
