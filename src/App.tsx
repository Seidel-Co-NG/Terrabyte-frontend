import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import BuyData from './Pages/BuyData/BuyData';
import BuyAirtime from './Pages/BuyAirtime/BuyAirtime';
import Electricity from './Pages/Electricity/Electricity';
import CableTV from './Pages/CableTV/CableTV';
import Internet from './Pages/Internet/Internet';
import BetFunding from './Pages/BetFunding/BetFunding';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="services/buy-data" element={<BuyData />} />
              <Route path="services/buy-airtime" element={<BuyAirtime />} />
              <Route path="services/buy-electricity" element={<Electricity />} />
              <Route path="services/buy-cable-tv" element={<CableTV />} />
              <Route path="services/internet" element={<Internet />} />
              <Route path="services/bet-funding" element={<BetFunding />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
