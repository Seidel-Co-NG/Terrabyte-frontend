import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { userApi } from '../../../../core/api/user.api';
import { useAuthStore } from '../../../../core/stores/auth.store';

interface ReferredUser {
  id?: number;
  fullname?: string;
  name?: string;
  created_at?: string;
  date?: string;
  wallet?: string;
}

const ReferralList = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const username = user?.username ?? user?.name ?? 'user';
  const referralLink = `https://terrabyte.com.ng/signup/?ref=${username}`;
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);

  const handleReferralLinkClick = () => {
    navigate(`/signup?ref=${username}`);
  };

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type === 'link' ? 'Referral link' : 'Referral code'} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };
 
  useEffect(() => {
    userApi
      .getReferredUsers()
      .then((res) => {
        const data = res?.data as ReferredUser[] | { data?: ReferredUser[] } | undefined;
        const list = Array.isArray(data)
          ? data
          : data && 'data' in data && Array.isArray((data as { data?: ReferredUser[] }).data)
            ? (data as { data: ReferredUser[] }).data
            : [];
        setReferrals(list);
      })
      .catch(() => setReferrals([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return referrals;
    const q = search.trim().toLowerCase();
    return referrals.filter(
      (r) =>
        (r.fullname ?? r.name ?? '').toLowerCase().includes(q)
    );
  }, [referrals, search]);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  const initials = (r: ReferredUser) =>
    (r.fullname ?? r.name ?? '?').charAt(0).toUpperCase();
  const displayName = (r: ReferredUser) => r.fullname ?? r.name ?? '—';
  const walletDisplay = (r: ReferredUser) => `₦${r.wallet ?? '0'}`;

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      {/* Referral Link Section */}
      <div className="mb-6 pb-6 border-b border-[var(--border-color)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Your Referral Link</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleReferralLinkClick}
              className="flex-1 text-sm text-[var(--text-primary)] truncate font-mono text-left hover:text-[var(--accent-primary)] transition-colors"
              title="Click to go to registration page"
            >
              {referralLink}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(referralLink, 'link')}
              className="p-2 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors shrink-0"
              title="Copy referral link"
            >
              <FiCopy size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <span className="text-sm font-semibold text-[var(--text-primary)]">{username}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(username, 'code')}
              className="p-2 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors shrink-0"
              title="Copy referral code"
            >
              <FiCopy size={16} />
            </button>
          </div>
        </div>
        {copied && (
          <p className="text-xs text-[var(--success)] mt-2">
            {copied === 'link' ? 'Referral link copied!' : 'Referral code copied!'}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 mb-6">
        <div className="flex-1 relative flex items-center">
          <FiSearch className="absolute left-4 text-[var(--text-muted)] text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Search referrals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 px-4 pl-10 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:bg-[var(--bg-hover)]"
          />
        </div>
      </div>
      <div className="mt-6 overflow-x-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-[var(--text-muted)] text-sm">
            Loading referrals...
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]">
                <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Referral Name
                </th>
                <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide hidden sm:table-cell">
                  Joined Date
                </th>
                <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Wallet
                </th>
                <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Status
                </th>
                <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-[var(--text-muted)]">
                    {referrals.length === 0
                      ? "You haven't referred anyone yet. Share your referral code to start earning!"
                      : 'No referrals match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((referral, index) => (
                  <tr
                    key={referral.id ?? index}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="p-4 text-[var(--text-primary)] text-sm md:text-[0.85rem]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-8 md:h-8 shrink-0 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white font-semibold text-[0.8rem] md:text-[0.7rem]">
                          {initials(referral)}
                        </div>
                        <span className="font-medium text-[var(--text-primary)] text-sm">
                          {displayName(referral)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--text-primary)] text-sm md:text-[0.85rem] hidden sm:table-cell">
                      {formatDate(referral.created_at ?? referral.date)}
                    </td>
                    <td className="p-4 font-semibold text-[var(--success)] text-sm">
                      {walletDisplay(referral)}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center py-1 px-3 rounded-xl text-xs font-medium bg-emerald-500/20 text-[var(--success)]">
                        <FiCheckCircle size={12} className="mr-1 shrink-0" />
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        to="/dashboard/profile/referral-bonus"
                        className="py-2 px-4 md:py-1.5 md:px-3 bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] text-[0.85rem] md:text-[0.75rem] transition-colors hover:bg-[var(--brand-primary-lightest)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] no-underline inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReferralList;
