import WelcomeHeader from './Components/WelcomeHeader';
import Marquee from './Components/Marquee';
import WalletBalance from './Components/WalletBalance';
import ServicesCard from './Components/ServicesCard';
import RecentTransactions from './Components/RecentTransactions';
import ReferralList from './Components/ReferralList';
import RecentActivity from './Components/RecentActivity';

const Dashboard = () => {
  const username = 'Mr. Jack';
  const userType = 'Premium';

  return (
    <div className="p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
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
