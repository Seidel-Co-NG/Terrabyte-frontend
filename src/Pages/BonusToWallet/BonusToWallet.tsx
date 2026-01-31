import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';

// Mock user (replace with auth/API)
const MOCK_USER = {
  username: 'TB12345',
  bonus: '5250',
};
const REFERRAL_LINK = `https://terrabyte.com.ng/ref/${MOCK_USER.username}`;
const MIN_BONUS_TO_CONVERT = 200;

// Mock referred users (replace with API)
const MOCK_REFERRALS = [
  { fullname: 'John Doe', created_at: '2024-01-15', wallet: '1250' },
  { fullname: 'Alice Smith', created_at: '2024-01-14', wallet: '800' },
  { fullname: 'Mayor Kelly', created_at: '2024-01-13', wallet: '500' },
];

const BonusToWallet = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<'link' | 'code' | null>(null);

  const bonusNum = parseFloat(MOCK_USER.bonus) || 0;
  const canConvert = bonusNum >= MIN_BONUS_TO_CONVERT && !isConverting;

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch {
      // fallback ignored
    }
  };

  const handleConvert = () => {
    if (!canConvert) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      alert('Bonus converted to wallet successfully!');
    }, 1000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Bonus to Wallet</h1>
        </div>

        <div className="flex flex-col gap-6">
          {/* QR Code & Referral Link */}
          <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(REFERRAL_LINK)}`}
                alt="Referral QR"
                width={150}
                height={150}
                className="rounded-lg bg-white p-1"
              />
              <div className="flex items-center gap-2 mt-3 w-full justify-center">
                <span className="text-sm text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-none">
                  terrabyte.com.ng/ref/{MOCK_USER.username}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(REFERRAL_LINK, 'link')}
                  className="p-2 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors shrink-0"
                  title="Copy referral link"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
              {copyFeedback === 'link' && (
                <span className="text-xs text-[var(--success)] mt-1">Link copied!</span>
              )}
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
              Referral Code
            </label>
            <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
              <span className="font-semibold text-[var(--text-primary)]">{MOCK_USER.username}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(MOCK_USER.username, 'code')}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-primary)] transition-colors"
                title="Copy referral code"
              >
                <FiCopy className="w-4 h-4" />
              </button>
            </div>
            {copyFeedback === 'code' && (
              <span className="text-xs text-[var(--success)] mt-1 block">Code copied!</span>
            )}
          </div>

          {/* Earnings Summary */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
              Earnings Summary
            </label>
            <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[var(--text-secondary)]">Bonus Balance</span>
                <span className="font-bold text-[var(--text-primary)]">
                  ₦{Number(MOCK_USER.bonus).toLocaleString()}
                </span>
              </div>
              {bonusNum >= MIN_BONUS_TO_CONVERT ? (
                <PayButton
                  fullWidth
                  text={isConverting ? 'Converting...' : 'Convert Bonus to Wallet'}
                  loading={isConverting}
                  loadingText="Converting..."
                  disabled={!canConvert}
                  onClick={handleConvert}
                />
              ) : (
                <p className="text-sm text-[var(--accent-primary)]">
                  You need at least ₦{MIN_BONUS_TO_CONVERT.toLocaleString()} in bonus to convert to wallet.
                </p>
              )}
            </div>
          </div>

          {/* Recent Referrals */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
              Recent Referrals
            </label>
            {MOCK_REFERRALS.length === 0 ? (
              <div className="rounded-2xl p-8 bg-[var(--bg-card)] border border-[var(--border-color)] text-center">
                <p className="text-[var(--text-primary)] font-medium">No Referred Users</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  You haven&apos;t referred anyone yet. Share your referral code to start earning!
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)]">
                <ul className="divide-y divide-[var(--border-color)]">
                  {MOCK_REFERRALS.map((ref, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-4 hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-hover)] flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm shrink-0">
                        {(ref.fullname || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] text-sm truncate">
                          {ref.fullname}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {formatDate(ref.created_at)}
                        </p>
                      </div>
                      <span className="font-semibold text-[var(--text-primary)] text-sm shrink-0">
                        ₦{Number(ref.wallet).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusToWallet;
