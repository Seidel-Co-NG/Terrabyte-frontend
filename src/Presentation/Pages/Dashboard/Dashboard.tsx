import { useEffect } from 'react';
import WelcomeHeader from './Components/WelcomeHeader';
import Marquee from './Components/Marquee';
import WalletBalance from './Components/WalletBalance';
import ServicesCard from './Components/ServicesCard';
import RecentTransactions from './Components/RecentTransactions';
import ReferralList from './Components/ReferralList';
import RecentActivity from './Components/RecentActivity';
import { useAuthStore } from '../../../core/stores/auth.store';
import { useTransactionsStore } from '../../../core/stores/transactions.store';
import { apiConfig } from '../../../core/config/api.config';
import AppDownloadBanner from '../../Components/AppDownloadBanner';

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);
  const username = user?.name ?? user?.username ?? 'User';
  const userType = (user?.user_type ?? user?.user_level ?? 'User').replace(/_/g, ' ');
  const showAdminButton = Boolean(apiConfig.adminUrl) && Boolean(user?.is_staff || user?.isAdmin);

  useEffect(() => {
    fetchUser().catch(() => { });
  }, [fetchUser]);

  useEffect(() => {
    fetchTransactions({ limit: 10 }).catch(() => { });
  }, [fetchTransactions]);

  return (
    <div className="p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <AppDownloadBanner forceShow />
      {showAdminButton && (
        <div className="mb-4 flex justify-end">
          <a
            href={apiConfig.adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium bg-[var(--accent-hover)] border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
          >
            <span>Admin</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
      <Marquee />
      <WelcomeHeader username={username} userType={userType} />
      <div className="mb-6 col-span-12 xl:col-span-4 min-h-[280px] md:min-h-[250px]">
        <WalletBalance />
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-6">
        <div className="col-span-12 xl:col-span-6 min-h-[280px] md:min-h-[250px]">
          <ServicesCard />
        </div>
        <div className="col-span-12 xl:col-span-6 min-h-[280px] md:min-h-[250px]">
          <RecentTransactions />
        </div>
        <div className="col-span-12 xl:col-span-8 min-h-[280px] md:min-h-[250px]">
          <ReferralList />
        </div>
        <div className="col-span-12 xl:col-span-4 min-h-[280px] md:min-h-[250px]">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
