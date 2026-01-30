import { FiCopy, FiCheck, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';

const WalletBalance = () => {
  const [copied, setCopied] = useState(false);

  const walletData = {
    walletBalance: '₦125,450.00',
    bonusBalance: '₦5,250.00',
    accountNumber: '0123456789',
    accountName: 'John Doe',
    bankName: 'Access Bank',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFundWallet = () => {
    console.log('Fund Wallet clicked');
  };

  const handleGenerateVirtualAccount = () => {
    console.log('Generate Virtual Account clicked');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center mb-0">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">Wallet Balance</h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col gap-5 p-6 md:p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <div className="p-5 md:p-4 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.1)] border border-[var(--accent-hover)] rounded-lg flex flex-col gap-2">
              <div className="text-[0.85rem] text-[var(--text-secondary)] font-medium">Wallet Balance</div>
              <div className="text-[1.75rem] md:text-2xl sm:text-xl font-bold text-[var(--success)]">{walletData.walletBalance}</div>
            </div>
            <div className="p-5 md:p-4 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.1)] border border-[var(--accent-hover)] rounded-lg flex flex-col gap-2">
              <div className="text-[0.85rem] text-[var(--text-secondary)] font-medium">Bonus Balance</div>
              <div className="text-[1.75rem] md:text-2xl sm:text-xl font-bold text-[var(--warning)]">{walletData.bonusBalance}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <button
              type="button"
              onClick={handleFundWallet}
              className="flex items-center justify-center gap-3 py-4 px-6 border-none rounded-lg text-base md:text-sm font-semibold cursor-pointer transition-all duration-300 text-center bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-[0_4px_12px_var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(168,85,247,0.4)] [&_span]:text-white [&_.btn-icon]:text-white"
            >
              <FiDollarSign className="btn-icon text-xl md:text-lg shrink-0" />
              <span>Fund Wallet</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateVirtualAccount}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-lg text-base md:text-sm font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.15)] text-[var(--text-primary)] border border-[var(--accent-hover)] hover:-translate-y-0.5 hover:border-[var(--accent-primary)] hover:shadow-[0_4px_12px_var(--accent-hover)]"
            >
              <FiCreditCard className="text-xl md:text-lg shrink-0" />
              <span>Generate Virtual Account</span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex flex-col">
          <div className="mb-4 pb-3 border-b border-[var(--border-color)] flex items-center justify-between gap-3">
            <h4 className="text-base font-semibold text-[var(--text-primary)] m-0">Bank Account Details</h4>
            <button
              type="button"
              onClick={() => console.log('View all banks')}
              className="py-2 px-3 rounded-lg text-sm font-medium text-[var(--accent-primary)] bg-[var(--accent-hover)] border border-[var(--accent-hover)] cursor-pointer transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] shrink-0"
            >
              View all banks
            </button>
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
