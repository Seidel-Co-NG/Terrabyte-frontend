import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';
import { FiClock, FiAlertCircle, FiCopy, FiCheckCircle } from 'react-icons/fi';
import { client } from '../../../core/config/client';
import { endpoints } from '../../../core/config/endpoints';
import toast from 'react-hot-toast';

interface DynamicAccountData {
  account_number: string;
  account_name: string;
  bank_name: string;
  amount: number;
  expires_at: string;
  reference?: string;
}

const DynamicAccountFunding = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState<DynamicAccountData | null>(null);
  const [expired, setExpired] = useState(false);

  const handleGenerate = async () => {
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum < 100) {
      toast.error('Please enter a valid amount (minimum ₦100)');
      return;
    }

    setLoading(true);
    try {
      const response = await client.post<{
        status: string;
        message: string;
        data: DynamicAccountData;
      }>(endpoints.fundingDynamicAccount, { amount: amountNum });

      console.log('Dynamic account response:', response);

      if (response.status === 'successful' && response.data) {
        setAccountData(response.data);
        // Start countdown timer
        const expiresAt = new Date(response.data.expires_at);
        const checkExpiry = setInterval(() => {
          if (new Date() >= expiresAt) {
            setExpired(true);
            clearInterval(checkExpiry);
          }
        }, 1000);

        // Clear interval after 1 hour
        setTimeout(() => {
          clearInterval(checkExpiry);
        }, 3600000);
      } else {
        console.error('Failed to generate account:', response);
        toast.error(response.message || 'Failed to generate account');
      }
    } catch (error: any) {
      console.error('Error generating dynamic account:', error);
      toast.error(error.message || 'Failed to generate dynamic account');
    } finally {
      setLoading(false);
    }
  };

  const shareAccount = () => {
    if (!accountData) return;
    const text = `🏦 Dynamic Bank Account Details\n\n📌 Account Number: ${accountData.account_number}\n🏛️ Bank Name: ${accountData.bank_name}\n👤 Account Name: ${accountData.account_name}\n💰 Amount: ₦${accountData.amount.toLocaleString()}\n⏰ Valid for 1 hour\n\n💡 Send the exact amount to this account and your wallet will be funded automatically.\n\n---\nShared from Terrabyte`;
    if (navigator.share) {
      navigator.share({
        title: 'Dynamic Bank Account',
        text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success('Details copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Details copied to clipboard');
    }
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/fund-wallet" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Dynamic Bank Transfer</h1>
        </div>

        {!accountData ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Enter the amount you want to fund</li>
                    <li>We'll generate a temporary account number</li>
                    <li>This account is valid for 1 hour</li>
                    <li>Send the exact amount to the account</li>
                    <li>Your wallet will be funded automatically</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Amount to Fund
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (minimum ₦100)"
                  min="100"
                  className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading || !amount || parseFloat(amount) < 100}
                  className="px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white font-semibold hover:bg-[var(--accent-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Account'}
                </button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Minimum amount: ₦100
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {expired && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <FiAlertCircle className="w-5 h-5" />
                  <span className="font-semibold">This account has expired. Please generate a new one.</span>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-1">⏰ This account is valid for 1 hour</p>
                  <p>Send the exact amount (₦{accountData.amount.toLocaleString()}) to this account. Once payment is made, your wallet will be funded automatically.</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <div className="space-y-4">
                <DetailRow
                  label="Account Number"
                  value={accountData.account_number}
                  isCopyable
                />
                <DetailRow label="Bank Name" value={accountData.bank_name} />
                <DetailRow label="Account Name" value={accountData.account_name} />
                <DetailRow
                  label="Amount to Send"
                  value={`₦${accountData.amount.toLocaleString()}`}
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={shareAccount}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <FiCopy className="w-4 h-4" />
                  Share Details
                </button>
                <button
                  onClick={() => {
                    setAccountData(null);
                    setAmount('');
                    setExpired(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dark)] transition-colors"
                >
                  Generate New Account
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-semibold mb-1">Payment Status</p>
                  <p>We'll automatically detect your payment and credit your wallet. You can check your wallet balance or transaction history to confirm.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicAccountFunding;
