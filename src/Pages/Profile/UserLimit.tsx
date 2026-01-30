import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const UserLimit = () => {
  // TODO: from user context/API
  const userLevel = 1;
  const userLimit = 500000;
  const dailyLimit = 125000;
  const remainingLimit = Math.max(0, userLimit - dailyLimit);

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">
          User Limit
        </h1>

        <p className="text-sm text-[var(--text-secondary)] mb-2">User Transaction Limit</p>
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden mb-6">
          <DetailRow label="User Level" value={`LEVEL ${userLevel}`} />
          <DetailRow label="User Limit" value={`₦${userLimit.toLocaleString()}`} />
          <DetailRow label="Daily Limit" value={`₦${dailyLimit.toLocaleString()}`} />
          <DetailRow label="Remaining Limit" value={`₦${remainingLimit.toLocaleString()}`} />
          <div className="p-4 border-t border-[var(--border-color)]">
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-dark"
            >
              <Award size={18} strokeWidth={2} />
              Verify Account
            </Link>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Complete verification to increase your transaction limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLimit;
