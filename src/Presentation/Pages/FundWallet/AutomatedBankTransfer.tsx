import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShare2, FiCheckCircle } from 'react-icons/fi';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';
import { useAuthStore } from '../../../core/stores/auth.store';

interface ReservedAccount {
  account_number?: string;
  bank_name?: string;
  account_name?: string;
}

const AutomatedBankTransfer = () => {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const accounts: ReservedAccount[] = Array.isArray(user?.reserved_account) ? user.reserved_account : [];
  const isEmpty = accounts.length === 0;

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const shareAccount = (account: ReservedAccount) => {
    const accountNumber = account.account_number ?? '';
    const bankName = account.bank_name ?? '';
    const accountName = account.account_name ?? '';
    const text = `🏦 Bank Account Details\n\n📌 Account Number: ${accountNumber}\n🏛️ Bank Name: ${bankName}\n👤 Account Name: ${accountName}\n\n💡 Transfer funds to this account and your wallet will be credited automatically.\n\n---\nShared from Terrabyte`;
    if (navigator.share) {
      navigator.share({
        title: `Bank Account - ${bankName}`,
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
            <p className="text-sm text-[var(--text-tertiary)] max-w-sm mb-4">
              Complete KYC verification to get your reserved bank account for wallet funding.
            </p>
            <Link
              to="/dashboard/profile/kyc"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-dark"
            >
              <FiCheckCircle size={18} strokeWidth={2} />
              Verify to get account
            </Link>
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
                  <DetailRow label="Account Number" value={account.account_number ?? ''} isCopyable />
                  <DetailRow label="Bank Name" value={account.bank_name ?? ''} />
                  <DetailRow label="Account Name" value={account.account_name ?? ''} />
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
