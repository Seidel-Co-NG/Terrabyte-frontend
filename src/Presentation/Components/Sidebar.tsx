import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiX,
  FiLayout,
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
  FiBook,
  FiChevronDown,
  FiLogOut,
  FiTag,
  FiBell,
  FiSend,
  FiPrinter,
  FiTrendingUp,
} from 'react-icons/fi';
import { useAuthStore, type AuthState } from '../../core/stores/auth.store';
import LogoutModal from '../../Presentation/Components/LogoutModal';
import { servicesApi } from '../../core/api/services.api';

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
  subItems?: SubItem[] | string; // Can be array or 'fundWallet' marker
  isLogout?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_available: boolean;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s: AuthState) => s.logout);

  const handleLogoutConfirm = async () => {
    setLogoutModalOpen(false);
    onClose?.();
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('transfer-to-bank') || path.includes('transfer-to-user')) {
      setExpandedItems((prev) => new Set([...prev, 'Transfer']));
    }
    if (path.includes('fund-wallet')) {
      setExpandedItems((prev) => new Set([...prev, 'Fund Wallet']));
    }
  }, [location.pathname]);

  useEffect(() => {
    // Fetch payment methods
    servicesApi.getPaymentMethods()
      .then((res) => {
        const methods = (res?.data as PaymentMethod[] | undefined) || [];
        const available = methods.filter((m) => m.is_available);
        setPaymentMethods(available);
      })
      .catch(() => {
        // Fallback to default methods if API fails
        setPaymentMethods([]);
      });
  }, []);

  const mainMenuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <FiLayout />, link: '/dashboard' },
    {
      name: 'Transfer',
      icon: <FiSend />,
      subItems: [
        { name: 'Bank Transfer', icon: <FiCreditCard />, link: '/dashboard/transfer-to-bank' },
        { name: 'Transfer to User', icon: <FiUser />, link: '/dashboard/transfer-to-user' },
      ],
    },
    {
      name: 'Fund Wallet',
      icon: <span className="text-lg font-bold opacity-80 inline-flex items-center justify-center min-w-[20px]" aria-hidden>₦</span>,
      subItems: 'fundWallet', // Special marker to fetch dynamically
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
        { name: 'Recharge Card Printing', icon: <FiPrinter />, link: '/dashboard/services/recharge-card-printing' },
        { name: 'Airtime To Cash', icon: <FiRefreshCw />, link: '/dashboard/services/airtime-to-cash' },
        { name: 'Transfer to User', icon: <FiSend />, link: '/dashboard/services/transfer-to-user' },
        { name: 'Social Media Boost', icon: <FiTrendingUp />, link: '/dashboard/services/social-media-boost' },
      ],
    },
    { name: 'Transactions', icon: <FiList />, link: '/dashboard/transactions' },
    { name: 'Notifications', icon: <FiBell />, link: '/dashboard/notifications' },
    { name: 'Profile', icon: <FiUser />, link: '/dashboard/profile' },
    { name: 'Developer\'s API', icon: <FiKey />, link: '/dashboard/profile/api-key' },
    { name: 'API Documentation', icon: <FiBook />, link: '/dashboard/api-docs' },
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

  const hasSubItems = (item: MenuItem): boolean => {
    if (item.subItems === 'fundWallet') return true;
    return Array.isArray(item.subItems) && item.subItems.length > 0;
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isExpanded = expandedItems.has(item.name);
    const hasSubs = hasSubItems(item);
    const isDashboardActive = item.link === '/dashboard' && location.pathname === '/dashboard';
    const isProfileActive = item.link === '/dashboard/profile' && location.pathname.startsWith('/dashboard/profile') && !location.pathname.startsWith('/dashboard/profile/api-key');
    const isApiKeyActive = item.link === '/dashboard/profile/api-key' && location.pathname === '/dashboard/profile/api-key';
    const isNotificationsActive = item.link === '/dashboard/notifications' && location.pathname.startsWith('/dashboard/notifications');
    const isApiDocsActive = item.link === '/dashboard/api-docs' && location.pathname === '/dashboard/api-docs';
    const isActive = item.link && (location.pathname === item.link || isProfileActive || isNotificationsActive || isApiKeyActive || isApiDocsActive);

    const linkClass = `flex items-center justify-between px-6 py-3 text-[var(--text-secondary)] no-underline transition-all text-sm font-semibold cursor-pointer rounded-none
      hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
      ${isDashboardActive || isActive ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold' : ''}
      ${isExpanded ? 'text-[var(--text-primary)]' : ''}`;

    return (
      <li key={index} className="my-1">
        {hasSubs ? (
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
        {hasSubs && item.subItems && (
          <ul
            className={`list-none p-0 m-0 pl-10 mt-1 overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-[500px] pt-2 pb-2' : 'max-h-0'
            }`}
          >
            {item.subItems === 'fundWallet' ? (
              <>
                {/* Static items */}
                <li className="my-1">
                  <Link
                    to="/dashboard/fund-wallet/automated-transfer"
                    className={`flex items-center gap-3 py-2 px-4 text-sm font-semibold no-underline transition-all rounded-md w-full text-left ${
                      location.pathname === '/dashboard/fund-wallet/automated-transfer'
                        ? 'text-[var(--accent-primary)] bg-[var(--accent-hover)] font-semibold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:pl-5'
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-[0.95rem] opacity-70"><FiRefreshCw /></span>
                    <span>Automated Bank Transfer</span>
                  </Link>
                </li>
                <li className="my-1">
                  <Link
                    to="/dashboard/fund-wallet/card-bank-payment"
                    className={`flex items-center gap-3 py-2 px-4 text-sm font-semibold no-underline transition-all rounded-md w-full text-left ${
                      location.pathname === '/dashboard/fund-wallet/card-bank-payment'
                        ? 'text-[var(--accent-primary)] bg-[var(--accent-hover)] font-semibold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:pl-5'
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-[0.95rem] opacity-70"><FiCreditCard /></span>
                    <span>Card & Bank Payment</span>
                  </Link>
                </li>
               
                <li className="my-1">
                  <Link
                    to="/dashboard/fund-wallet/dynamic-account"
                    className={`flex items-center gap-3 py-2 px-4 text-sm font-semibold no-underline transition-all rounded-md w-full text-left ${
                      location.pathname === '/dashboard/fund-wallet/dynamic-account'
                        ? 'text-[var(--accent-primary)] bg-[var(--accent-hover)] font-semibold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:pl-5'
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-[0.95rem] opacity-70"><FiCreditCard /></span>
                    <span>Dynamic Bank Transfer</span>
                  </Link>
                </li>
                <li className="my-1">
                  <Link
                    to="/dashboard/fund-wallet/manual-bank"
                    className={`flex items-center gap-3 py-2 px-4 text-sm font-semibold no-underline transition-all rounded-md w-full text-left ${
                      location.pathname === '/dashboard/fund-wallet/manual-bank'
                        ? 'text-[var(--accent-primary)] bg-[var(--accent-hover)] font-semibold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:pl-5'
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-[0.95rem] opacity-70"><span className="text-lg font-bold opacity-80 inline-flex items-center justify-center min-w-[20px]">₦</span></span>
                    <span>Manual Bank Funding</span>
                  </Link>
                </li>
                <li className="my-1">
                  <Link
                    to="/dashboard/fund-wallet/coupon"
                    className={`flex items-center gap-3 py-2 px-4 text-sm font-semibold no-underline transition-all rounded-md w-full text-left ${
                      location.pathname === '/dashboard/fund-wallet/coupon'
                        ? 'text-[var(--accent-primary)] bg-[var(--accent-hover)] font-semibold'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:pl-5'
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-[0.95rem] opacity-70"><FiTag /></span>
                    <span>Coupon</span>
                  </Link>
                </li>
              </>
            ) : Array.isArray(item.subItems) ? (
              item.subItems.map((subItem, subIndex) => {
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
              })
            ) : null}
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
          <div className="dark:bg-white dark:rounded-lg dark:p-2 inline-block">
            <img src="/img/logo2.png" alt="logo" className="w-15 h-16 object-contain" />
          </div>
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
