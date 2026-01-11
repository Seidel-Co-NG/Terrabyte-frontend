import RecentTransactions from './RecentTransactions/RecentTransactions';
import WalletBalance from './WalletBalance/WalletBalance';
import ReferralList from './ReferralList/ReferralList';
import RecentActivity from './RecentActivity/RecentActivity';
import ServicesCard from './ServicesCard/ServicesCard';
import Marquee from './Marquee/Marquee';
import WelcomeHeader from './WelcomeHeader/WelcomeHeader';
import './Dashboard.css';
import React from 'react';

const Dashboard = () => {
  // In a real app, this would come from authentication context or API
  const username = 'Mr. Jack';
  const userType = 'Premium';

  return (
    <div className="dashboard">
       <Marquee />
      <WelcomeHeader username={username} userType={userType} />
      <div className="dashboard-widget dashboard-widget-large" style={{ marginBottom: '1.5rem' }}>
        <WalletBalance />
      </div>
      <div className="dashboard-grid">
        {/* Top Row */}
        <div className="dashboard-widget dashboard-widget-services">
          <ServicesCard />
        </div>
        <div className="dashboard-widget dashboard-widget-services">
          <RecentTransactions />
        </div>
        

        {/* Bottom Row */}
        <div className="dashboard-widget dashboard-widget-wide">
          <ReferralList />
        </div>
        <div className="dashboard-widget">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

