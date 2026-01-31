import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiX,
  FiLayout,
  FiDollarSign,
  FiGrid,
  FiList,
  FiUser,
  FiCreditCard,
  FiRefreshCw,
  FiDatabase,
  FiPhone,
  FiZap,
  FiTv,
  FiWifi,
  FiAward,
  FiMessageSquare,
  FiGift,
  FiKey,
  FiChevronDown,
  FiLogOut,
  FiTag,
  FiBell,
} from 'react-icons/fi';
import logo from './../assets/logo2.png';
import LogoutModal from './LogoutModal';
import { useAuthStore } from '../stores/auth.store';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface SubItem {
  name: string;
  icon: React.ReactNode;
  link?: string;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  active?: boolean;
  link?: string;
  subItems?: SubItem[];
  isLogout?: boolean;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogoutConfirm = async () => {
    setLogoutModalOpen(false);
    onClose?.();
    await logout();
    navigate('/login', { replace: true });
  };

  const mainMenuItems: MenuItem[] = [
    { name: 'Dashboards', icon: <FiLayout />, link: '/dashboard' },
    {
      name: 'Fund Wallet',
      icon: <FiDollarSign />,
      subItems: [
        { name: 'Monnify ATM', icon: <FiCreditCard />, link: '/dashboard/fund-wallet/monnify' },
        { name: 'Paystack ATM', icon: <FiCreditCard />, link: '/dashboard/fund-wallet/paystack' },
        { name: 'Automated Bank Transfer', icon: <FiRefreshCw />, link: '/dashboard/fund-wallet/automated-transfer' },
        { name: 'Coupon', icon: <FiTag />, link: '/dashboard/fund-wallet/coupon' },
      ],
    },
    {
      name: 'Services',
      icon: <FiGrid />,
      subItems: [
        { name: 'Buy Data', icon: <FiDatabase />, link: '/dashboard/services/buy-data' },
        { name: 'Buy Airtime', icon: <FiPhone />, link: '/dashboard/services/buy-airtime' },
        { name: 'Buy Electricity', icon: <FiZap />, link: '/dashboard/services/buy-electricity' },
        { name: 'Buy Cable TV', icon: <FiTv />, link: '/dashboard/services/buy-cable-tv' },
        { name: 'Internet', icon: <FiWifi />, link: '/dashboard/services/internet' },
        { name: 'Bet Funding', icon: <FiAward />, link: '/dashboard/services/bet-funding' },
        { name: 'Bulk SMS', icon: <FiMessageSquare />, link: '/dashboard/services/bulk-sms' },
        { name: 'Bonus To Wallet', icon: <FiGift />, link: '/dashboard/services/bonus-to-wallet' },
        { name: 'Buy Pins', icon: <FiKey />, link: '/dashboard/services/buy-pins' },
        { name: 'Airtime To Cash', icon: <FiRefreshCw />, link: '/dashboard/services/airtime-to-cash' },
      ],
    },
    { name: 'Transactions', icon: <FiList />, link: '/dashboard/transactions' },
    { name: 'Notifications', icon: <FiBell />, link: '/dashboard/notifications' },
    { name: 'Profile', icon: <FiUser />, link: '/dashboard/profile' },
    { name: 'Logout', icon: <FiLogOut />, isLogout: true },
  ];

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isExpanded = expandedItems.has(item.name);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isDashboardActive = item.link === '/dashboard' && location.pathname === '/dashboard';
    const isProfileActive = item.link === '/dashboard/profile' && location.pathname.startsWith('/dashboard/profile');
    const isNotificationsActive = item.link === '/dashboard/notifications' && location.pathname.startsWith('/dashboard/notifications');
    const isActive = item.link && (location.pathname === item.link || isProfileActive || isNotificationsActive);

    const linkClass = `flex items-center justify-between px-6 py-3 text-[var(--text-secondary)] no-underline transition-all text-sm font-semibold cursor-pointer rounded-none
      hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
      ${isDashboardActive || isActive ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold' : ''}
      ${isExpanded ? 'text-[var(--text-primary)]' : ''}`;

    return (
      <li key={index} className="my-1">
        {hasSubItems ? (
          <button
            type="button"
            className={`w-full text-left ${linkClass}`}
            onClick={() => toggleSubmenu(item.name)}
          >
            <span className="flex items-center gap-3 flex-1">
              <span className="text-lg flex items-center justify-center min-w-[20px] opacity-80">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
            </span>
            <span className={`text-base opacity-60 flex items-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <FiChevronDown />
            </span>
          </button>
        ) : item.link ? (
          <Link to={item.link} className={linkClass} onClick={onClose}>
            <span className="flex items-center gap-3 flex-1">
              <span className="text-lg flex items-center justify-center min-w-[20px] opacity-80">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
            </span>
          </Link>
        ) : item.isLogout ? (
          <button
            type="button"
            className={`w-full text-left ${linkClass}`}
            onClick={() => setLogoutModalOpen(true)}
          >
            <span className="flex items-center gap-3 flex-1">
              <span className="text-lg flex items-center justify-center min-w-[20px] opacity-80">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
            </span>
          </button>
        ) : (
          <span className={linkClass}>
            <span className="flex items-center gap-3 flex-1">
              <span className="text-lg flex items-center justify-center min-w-[20px] opacity-80">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
            </span>
          </span>
        )}
        {hasSubItems && item.subItems && (
          <ul
            className={`list-none p-0 m-0 pl-10 mt-1 overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-[500px] pt-2 pb-2' : 'max-h-0'
            }`}
          >
            {item.subItems.map((subItem, subIndex) => {
              const isSubActive = subItem.link && location.pathname === subItem.link;
              const subClass = `flex items-center gap-3 py-2 px-4 text-sm font-semibold no-underline transition-all rounded-md w-full text-left
                ${isSubActive ? 'text-[var(--accent-primary)] bg-[var(--accent-hover)] font-semibold' : 'text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:pl-5'}`;
              return (
                <li key={subIndex} className="my-1">
                  {subItem.link ? (
                    <Link to={subItem.link} className={subClass} onClick={onClose}>
                      <span className="text-[0.95rem] opacity-70">{subItem.icon}</span>
                      <span>{subItem.name}</span>
                    </Link>
                  ) : (
                    <span className={subClass}>
                      <span className="text-[0.95rem] opacity-70">{subItem.icon}</span>
                      <span>{subItem.name}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`w-[280px] sm:w-[260px] max-w-[280px] h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] flex flex-col fixed left-0 top-0 overflow-y-auto z-[1000] transition-transform duration-300
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="text-xl font-semibold text-[var(--accent-primary)]">
          <img src={logo} alt="logo" className="w-15 h-16 object-contain" />
        </div>
        {onClose && (
          <button
            type="button"
            className="flex lg:hidden items-center justify-center p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-2xl"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4">
        <div className="mb-8">
          <ul className="list-none p-0 m-0">
            {mainMenuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </div>
      </nav>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};

export default Sidebar;
