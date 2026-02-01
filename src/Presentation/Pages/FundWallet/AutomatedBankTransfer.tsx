import { useState } from 'react';
import { FiShare2 } from 'react-icons/fi';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';

interface ReservedAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

const MOCK_ACCOUNTS: ReservedAccount[] = [
  { accountNumber: '8012345678', bankName: 'Providus Bank', accountName: 'Terrabyte / Your Name' },
  { accountNumber: '9012345678', bankName: 'Wema Bank', accountName: 'Terrabyte / Your Name' },
];

const AutomatedBankTransfer = () => {
  const [accounts] = useState<ReservedAccount[]>(MOCK_ACCOUNTS);
  const isEmpty = accounts.length === 0;

  const shareAccount = (account: ReservedAccount) => {
    const text = `🏦 Bank Account Details\n\n📌 Account Number: ${account.accountNumber}\n🏛️ Bank Name: ${account.bankName}\n👤 Account Name: ${account.accountName}\n\n💡 Transfer funds to this account and your wallet will be credited automatically.\n\n---\nShared from Terrabyte`;
    if (navigator.share) {
      navigator.share({
        title: `Bank Account - ${account.bankName}`,
        text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert('Details copied to clipboard.');
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Details copied to clipboard.');
    }
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/fund-wallet" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Automated Bank Transfer</h1>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
              <FiShare2 className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">No Reserved Account</h2>
            <p className="text-sm text-[var(--text-tertiary)] max-w-sm">
              Your reserved account is being generated. Please check back later.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--text-secondary)] mb-6 px-2">
              Transfer funds to any of these accounts. Your wallet will be credited automatically.
            </p>

            <div className="flex flex-col gap-4">
              {accounts.map((account, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm"
                >
                  <DetailRow label="Account Number" value={account.accountNumber} isCopyable />
                  <DetailRow label="Bank Name" value={account.bankName} />
                  <DetailRow label="Account Name" value={account.accountName} />
                  <div className="pt-3 mt-2">
                    <button
                      type="button"
                      onClick={() => shareAccount(account)}
                      className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] rounded-lg transition-colors"
                    >
                      <FiShare2 className="w-4 h-4" />
                      Share details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AutomatedBankTransfer;
