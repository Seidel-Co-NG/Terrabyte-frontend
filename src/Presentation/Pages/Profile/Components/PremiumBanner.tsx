import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

const levelDescriptions: Record<number, string> = {
  1: 'Upgrade to level 2 to reach your full potential',
  2: 'Upgrade to level 3 to unlock premium features',
  3: 'You have reached the highest level!',
};

const PremiumBanner = ({ userLevel = 1 }: { userLevel?: number }) => {
  const description = levelDescriptions[userLevel] ?? levelDescriptions[1];
  const canUpgrade = userLevel < 3;

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary-lightest text-brand-primary">
          <Award size={18} strokeWidth={2} />
        </span>
        <span className="text-sm font-bold text-[var(--text-primary)]">LEVEL {userLevel}</span>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mt-2">{description}</p>
      {canUpgrade && (
        <Link
          to="/dashboard/profile/user-limit"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark"
        >
          <span>Verify Account</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v7" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default PremiumBanner;
