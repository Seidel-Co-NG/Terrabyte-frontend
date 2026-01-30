import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import LandingPage from './Pages/Landingpage/LandingPage';
import Welcome from './Pages/Auth/Welcome';
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import Dashboard from './Pages/Dashboard/Dashboard';
import BuyData from './Pages/BuyData/BuyData';
import BuyAirtime from './Pages/BuyAirtime/BuyAirtime';
import Electricity from './Pages/Electricity/Electricity';
import CableTV from './Pages/CableTV/CableTV';
import Internet from './Pages/Internet/Internet';
import BetFunding from './Pages/BetFunding/BetFunding';
import BulkSMS from './Pages/BulkSMS/BulkSMS';
import BuyPins from './Pages/BuyPins/BuyPins';
import BonusToWallet from './Pages/BonusToWallet/BonusToWallet';
import AirtimeToCash from './Pages/AirtimeToCash/AirtimeToCash';
import TermsPrivacy from './Pages/Terms/Terms';
import Profile from './Pages/Profile/Profile';
import EditProfile from './Pages/Profile/EditProfile';
import ChangePassword from './Pages/Profile/ChangePassword';
import ChangePin from './Pages/Profile/ChangePin';
import ResetPin from './Pages/Profile/ResetPin';
import NotificationSettings from './Pages/Profile/NotificationSettings';
import BiometricSettings from './Pages/Profile/BiometricSettings';
import ReferralBonus from './Pages/Profile/ReferralBonus';
import Support from './Pages/Profile/Support';
import UserLimit from './Pages/Profile/UserLimit';
import Transactions from './Pages/Transactions/Transactions';
import TransactionDetails from './Pages/Transactions/TransactionDetails';
import Notifications from './Pages/Notifications/Notifications';
import NotificationDetails from './Pages/Notifications/NotificationDetails';
import FundWallet from './Pages/FundWallet/FundWallet';
import MonnifyFunding from './Pages/FundWallet/MonnifyFunding';
import PaystackFunding from './Pages/FundWallet/PaystackFunding';
import AutomatedBankTransfer from './Pages/FundWallet/AutomatedBankTransfer';
import CouponFunding from './Pages/FundWallet/CouponFunding';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms-of-service" element={<TermsPrivacy />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="services/buy-data" element={<BuyData />} />
              <Route path="services/buy-airtime" element={<BuyAirtime />} />
              <Route path="services/buy-electricity" element={<Electricity />} />
              <Route path="services/buy-cable-tv" element={<CableTV />} />
              <Route path="services/internet" element={<Internet />} />
              <Route path="services/bet-funding" element={<BetFunding />} />
              <Route path="services/bulk-sms" element={<BulkSMS />} />
              <Route path="services/buy-pins" element={<BuyPins />} />
              <Route path="services/bonus-to-wallet" element={<BonusToWallet />} />
              <Route path="services/airtime-to-cash" element={<AirtimeToCash />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="profile/change-password" element={<ChangePassword />} />
              <Route path="profile/change-pin" element={<ChangePin />} />
              <Route path="profile/reset-pin" element={<ResetPin />} />
              <Route path="profile/notification-settings" element={<NotificationSettings />} />
              <Route path="profile/biometric-settings" element={<BiometricSettings />} />
              <Route path="profile/referral-bonus" element={<ReferralBonus />} />
              <Route path="profile/support" element={<Support />} />
              <Route path="profile/user-limit" element={<UserLimit />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/:id" element={<TransactionDetails />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="notifications/:id" element={<NotificationDetails />} />
              <Route path="fund-wallet" element={<FundWallet />} />
              <Route path="fund-wallet/monnify" element={<MonnifyFunding />} />
              <Route path="fund-wallet/paystack" element={<PaystackFunding />} />
              <Route path="fund-wallet/automated-transfer" element={<AutomatedBankTransfer />} />
              <Route path="fund-wallet/coupon" element={<CouponFunding />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
