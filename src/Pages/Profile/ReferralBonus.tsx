import { useState } from 'react';
import { Copy } from 'lucide-react';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const ReferralBonus = () => {
  const [copied, setCopied] = useState<string | null>(null);
  // TODO: from user context/API
  const username = 'johndoe';
  const bonusBalance = '150.00';
  const referralLink = `https://terrabyte.com.ng/ref/${username}`;
  const recentReferrals: { fullname: string; date: string; wallet: string }[] = [
    { fullname: 'Jane Doe', date: '28/01/2025', wallet: '500' },
    { fullname: 'John Smith', date: '25/01/2025', wallet: '200' },
  ];
  const canConvert = parseFloat(bonusBalance) >= 200;
  const [isConverting, setIsConverting] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConvert = () => {
    setIsConverting(true);
    // TODO: API convert bonus to wallet
    setTimeout(() => setIsConverting(false), 800);
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">
          Referral & Bonus
        </h1>

        {/* Referral link card */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-[150px] h-[150px] rounded-xl bg-white flex items-center justify-center border border-[var(--border-color)] mb-3">
              <span className="text-xs text-[var(--text-muted)] text-center px-2">
                QR code (e.g. terrabyte.com.ng/ref/{username})
              </span>
            </div>
            <div className="flex items-center gap-2 w-full justify-center flex-wrap">
              <span className="text-sm text-[var(--text-primary)] truncate max-w-[200px]">
                {referralLink}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(referralLink, 'link')}
                className="p-2 rounded-lg text-brand-primary hover:bg-brand-primary-lightest transition-colors"
                title="Copy link"
              >
                <Copy size={18} />
              </button>
            </div>
            {copied === 'link' && (
              <span className="text-xs text-[var(--success)] mt-1">Link copied!</span>
            )}
          </div>
        </div>

        {/* Referral code */}
        <p className="text-sm text-[var(--text-secondary)] mb-2">Referral Code</p>
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 mb-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-semibold text-[var(--text-primary)]">{username}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(username, 'code')}
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Copy code"
            >
              <Copy size={18} />
            </button>
          </div>
          {copied === 'code' && (
            <span className="text-xs text-[var(--success)] mt-2 block">Code copied!</span>
          )}
        </div>

        {/* Earnings summary */}
        <p className="text-sm text-[var(--text-secondary)] mb-2">Earnings Summary</p>
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden mb-6">
          <DetailRow label="Bonus Balance" value={`₦${bonusBalance}`} />
          <div className="p-4 border-t border-[var(--border-color)]">
            {canConvert ? (
              <button
                type="button"
                disabled={isConverting}
                onClick={handleConvert}
                className="py-2.5 px-4 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-dark disabled:opacity-70"
              >
                {isConverting ? 'Converting...' : 'Convert Bonus to Wallet'}
              </button>
            ) : (
              <p className="text-sm text-brand-primary">
                You need at least ₦200 in bonus to convert to wallet
              </p>
            )}
          </div>
        </div>

        {/* Recent referrals */}
        <p className="text-sm text-[var(--text-secondary)] mb-2">Recent Referrals</p>
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
          {recentReferrals.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--text-muted)]">
              You haven&apos;t referred anyone yet. Share your referral code to start earning!
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border-color)]">
              {recentReferrals.map((ref, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-lightest text-brand-primary font-bold text-sm">
                    {ref.fullname.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{ref.fullname}</p>
                    <p className="text-xs text-[var(--text-muted)]">{ref.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    ₦{ref.wallet}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralBonus;
