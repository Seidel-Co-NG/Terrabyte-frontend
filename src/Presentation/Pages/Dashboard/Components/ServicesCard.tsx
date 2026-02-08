import { Link } from 'react-router-dom';
import {
  FiDatabase,
  FiPhone,
  FiZap,
  FiTv,
  FiWifi,
  FiAward,
  FiMessageSquare,
  FiGift,
  FiKey,
  FiPrinter,
  FiRefreshCw,
  FiSend,
  FiTrendingUp,
} from 'react-icons/fi';

interface Service {
  name: string;
  icon: React.ReactNode;
  link: string;
}

const ServicesCard = () => {
  const services: Service[] = [
    { name: 'Buy Data', icon: <FiDatabase />, link: '/dashboard/services/buy-data' },
    { name: 'Buy Airtime', icon: <FiPhone />, link: '/dashboard/services/buy-airtime' },
    { name: 'Buy Electricity', icon: <FiZap />, link: '/dashboard/services/buy-electricity' },
    { name: 'Buy Cable TV', icon: <FiTv />, link: '/dashboard/services/buy-cable-tv' },
    { name: 'Internet', icon: <FiWifi />, link: '/dashboard/services/internet' },
    { name: 'Bet Funding', icon: <FiAward />, link: '/dashboard/services/bet-funding' },
    { name: 'Bulk SMS', icon: <FiMessageSquare />, link: '/dashboard/services/bulk-sms' },
    { name: 'Bonus To Wallet', icon: <FiGift />, link: '/dashboard/services/bonus-to-wallet' },
    { name: 'Buy Pins', icon: <FiKey />, link: '/dashboard/services/buy-pins' },
    { name: 'Recharge Card Printing', icon: <FiPrinter />, link: '/dashboard/services/recharge-card-printing' },
    { name: 'Airtime To Cash', icon: <FiRefreshCw />, link: '/dashboard/services/airtime-to-cash' },
    { name: 'Transfer to User', icon: <FiSend />, link: '/dashboard/services/transfer-to-user' },
    { name: 'Social Media Boost', icon: <FiTrendingUp />, link: '/dashboard/services/social-media-boost' },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">Services</h3>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 mt-4">
        {services.map((service, index) => (
          <Link
            key={index}
            to={service.link}
            className="flex flex-col items-center justify-center py-5 px-4 md:py-4 md:px-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg transition-all duration-300 cursor-pointer no-underline text-inherit hover:bg-[var(--accent-hover)] hover:border-[var(--accent-primary)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--accent-hover)] group"
          >
            <div className="mb-3 flex items-center justify-center text-3xl lg:text-2xl md:text-2xl text-[var(--accent-primary)] transition-all duration-300 group-hover:scale-110">
              {service.icon}
            </div>
            <div className="text-[0.85rem] md:text-[0.8rem] sm:text-[0.75rem] font-medium text-[var(--text-primary)] text-center leading-snug transition-colors group-hover:text-[var(--accent-primary)] group-hover:font-semibold">
              {service.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard;
