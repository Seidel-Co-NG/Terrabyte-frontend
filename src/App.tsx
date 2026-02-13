import SEOWrapper from "./Presentation/Components/SEOWrapper";
import AppDownloadBanner from "./Presentation/Components/AppDownloadBanner";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuthStore } from "./core/stores/auth.store";
import { useTransactionsStore } from "./core/stores/transactions.store";
import DashboardLayout from "./Presentation/layouts/DashboardLayout";
import LandingPage from "./Presentation/Pages/Landingpage/LandingPage";
// import Welcome from './Presentation/Pages/Auth/Welcome';
import Login from "./Presentation/Pages/Auth/Login";
import SignUp from "./Presentation/Pages/Auth/SignUp";
import VerifyOtp from "./Presentation/Pages/Auth/VerifyOtp";
import SetTransactionPin from "./Presentation/Pages/Auth/SetTransactionPin";
import ForgotPassword from "./Presentation/Pages/Auth/ForgotPassword";
import Dashboard from "./Presentation/Pages/Dashboard/Dashboard";
import BuyData from "./Presentation/Pages/BuyData/BuyData";
import BuyAirtime from "./Presentation/Pages/BuyAirtime/BuyAirtimePage";
import Electricity from "./Presentation/Pages/Electricity/Electricity";
import CableTV from "./Presentation/Pages/CableTV/CableTV";
import Internet from "./Presentation/Pages/Internet/Internet";
import BetFunding from "./Presentation/Pages/BetFunding/BetFunding";
import BulkSMS from "./Presentation/Pages/BulkSMS/BulkSMS";
import BuyPins from "./Presentation/Pages/BuyPins/BuyPins";
import RechargeCardPrinting from "./Presentation/Pages/RechargeCardPrinting/RechargeCardPrinting";
import BonusToWallet from "./Presentation/Pages/BonusToWallet/BonusToWallet";
import AirtimeToCash from "./Presentation/Pages/AirtimeToCash/AirtimeToCash";
import TermsPrivacy from "./Presentation/Pages/Terms/Terms";
import Profile from "./Presentation/Pages/Profile/Profile";
import EditProfile from "./Presentation/Pages/Profile/EditProfile";
import ChangePassword from "./Presentation/Pages/Profile/ChangePassword";
import ChangePin from "./Presentation/Pages/Profile/ChangePin";
import ResetPin from "./Presentation/Pages/Profile/ResetPin";
import NotificationSettings from "./Presentation/Pages/Profile/NotificationSettings";
import ReferralBonus from "./Presentation/Pages/Profile/ReferralBonus";
import Support from "./Presentation/Pages/Profile/Support";
import UserLimit from "./Presentation/Pages/Profile/UserLimit";
import KycVerification from "./Presentation/Pages/Profile/KycVerification";
import ApiKey from "./Presentation/Pages/Profile/ApiKey";
import ApiDocs from "./Presentation/Pages/Profile/ApiDocs";
import DownloadApp from "./Presentation/Pages/DownloadApp/DownloadApp";
import Transactions from "./Presentation/Pages/Transactions/Transactions";
import TransactionDetails from "./Presentation/Pages/Transactions/TransactionDetails";
import Notifications from "./Presentation/Pages/Notifications/Notifications";
import NotificationDetails from "./Presentation/Pages/Notifications/NotificationDetails";
import FundWallet from "./Presentation/Pages/FundWallet/FundWallet";
import CardBankPayment from "./Presentation/Pages/FundWallet/CardBankPayment";
import PaystackFunding from "./Presentation/Pages/FundWallet/PaystackFunding";
import AutomatedBankTransfer from "./Presentation/Pages/FundWallet/AutomatedBankTransfer";
import CouponFunding from "./Presentation/Pages/FundWallet/CouponFunding";
import ManualBankFunding from "./Presentation/Pages/FundWallet/ManualBankFunding";
import TransferToBank from './Presentation/Pages/TransferToBank/TransferToBank';
import TransferToUser from "./Presentation/Pages/TransferToUser/TransferToUser";
import SocialMediaBoost from "./Presentation/Pages/SocialMediaBoost/SocialMediaBoost";

function AuthInit() {
  const navigate = useNavigate();
  const hydrate = useAuthStore((s: any) => s.hydrate);
  const resetState = useAuthStore((s: any) => s.resetState);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleLogout = () => {
      resetState();
      useTransactionsStore.getState().reset();
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [navigate, resetState]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SEOWrapper />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
        <AuthInit />
        <AppDownloadBanner />
        <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/welcome" element={<Welcome />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route
              path="/set-transaction-pin"
              element={<SetTransactionPin />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms-of-service" element={<TermsPrivacy />} />
            <Route path="/download-app" element={<DownloadApp />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="services/buy-data" element={<BuyData />} />
              <Route path="services/buy-airtime" element={<BuyAirtime />} />
              <Route
                path="services/buy-electricity"
                element={<Electricity />}
              />
              <Route path="services/buy-cable-tv" element={<CableTV />} />
              <Route path="services/internet" element={<Internet />} />
              <Route path="services/bet-funding" element={<BetFunding />} />
              <Route path="services/bulk-sms" element={<BulkSMS />} />
              <Route path="services/buy-pins" element={<BuyPins />} />
              <Route path="services/recharge-card-printing" element={<RechargeCardPrinting />} />
              <Route
                path="services/bonus-to-wallet"
                element={<BonusToWallet />}
              />
              <Route
                path="services/airtime-to-cash"
                element={<AirtimeToCash />}
              />
              <Route
                path="services/transfer-to-user"
                element={<TransferToUser />}
              />
              <Route path="transfer-to-bank" element={<TransferToBank />} />
              <Route
                path="services/social-media-boost"
                element={<SocialMediaBoost />}
              />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route
                path="profile/change-password"
                element={<ChangePassword />}
              />
              <Route path="profile/change-pin" element={<ChangePin />} />
              <Route path="profile/reset-pin" element={<ResetPin />} />
              <Route
                path="profile/notification-settings"
                element={<NotificationSettings />}
              />
              <Route
                path="profile/referral-bonus"
                element={<ReferralBonus />}
              />
              <Route path="profile/support" element={<Support />} />
              <Route path="profile/user-limit" element={<UserLimit />} />
              <Route path="profile/kyc" element={<KycVerification />} />
              <Route path="profile/api-key" element={<ApiKey />} />
              <Route path="api-docs" element={<ApiDocs />} />
              <Route path="download-app" element={<DownloadApp />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/:id" element={<TransactionDetails />} />
              <Route path="notifications" element={<Notifications />} />
              <Route
                path="notifications/:id"
                element={<NotificationDetails />}
              />
              <Route path="transfer-to-bank" element={<TransferToBank />} />
              <Route path="transfer-to-user" element={<TransferToUser />} />
              <Route path="fund-wallet" element={<FundWallet  />} />
              <Route path="fund-wallet/card-bank-payment" element={<CardBankPayment />} />
              <Route
                path="fund-wallet/paystack"
                element={<PaystackFunding />}
              />
              <Route
                path="fund-wallet/automated-transfer"
                element={<AutomatedBankTransfer />}
              />
              <Route path="fund-wallet/coupon" element={<CouponFunding />} />
              <Route path="fund-wallet/manual-bank" element={<ManualBankFunding />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
