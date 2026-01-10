import { useState } from 'react';
import { 
  FiX, 
  FiLayout, 
  FiDollarSign,
  FiGrid,
  FiList,
  FiUser,
  FiCreditCard,
  FiRefreshCw,
  FiArrowRight,
  FiDatabase,
  FiPhone,
  FiZap,
  FiTv,
  FiMessageSquare,
  FiGift,
  FiKey,
  FiChevronDown,
  FiLogOut
} from 'react-icons/fi';
import './Sidebar.css';
import logo from '../../assets/logo2.png';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  active?: boolean;
  subItems?: { name: string; icon: React.ReactNode }[];
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const mainMenuItems: MenuItem[] = [
    { name: 'Dashboards', icon: <FiLayout />, active: true },
    { 
      name: 'Fund Wallet', 
      icon: <FiDollarSign />,
      subItems: [
        { name: 'Atm Payment(Paystack)', icon: <FiCreditCard /> },
        { name: 'Atm Payment(Monnify)', icon: <FiCreditCard /> },
        { name: 'Auto Bank', icon: <FiRefreshCw /> },
        { name: 'Bank Transfer', icon: <FiArrowRight /> }
      ]
    },
    { 
      name: 'Services', 
      icon: <FiGrid />,
      subItems: [
        { name: 'Buy Data', icon: <FiDatabase /> },
        { name: 'Buy Airtime', icon: <FiPhone /> },
        { name: 'Buy Electricity', icon: <FiZap /> },
        { name: 'Buy Cable TV', icon: <FiTv /> },
        { name: 'Bulk SMS', icon: <FiMessageSquare /> },
        { name: 'Bonus To Wallet', icon: <FiGift /> },
        { name: 'Buy Pins', icon: <FiKey /> },
        { name: 'Airtime To Cash', icon: <FiRefreshCw /> }
      ]
    },
    { name: 'Transactions', icon: <FiList /> },
    { name: 'Profile', icon: <FiUser /> },
    { name: 'Logout', icon: <FiLogOut /> },
  ];

 

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev => {
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

    return (
      <li key={index} className={`nav-item ${item.active ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}>
        <a 
          href="#" 
          className="nav-link"
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              toggleSubmenu(item.name);
            }
          }}
        >
          <span className="nav-link-content">
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-text">{item.name}</span>
          </span>
          {hasSubItems && (
            <span className={`nav-chevron ${isExpanded ? 'expanded' : ''}`}>
              <FiChevronDown />
            </span>
          )}
        </a>
        {hasSubItems && item.subItems && (
          <ul className={`nav-submenu ${isExpanded ? 'open' : ''}`}>
            {item.subItems.map((subItem, subIndex) => (
              <li key={subIndex}>
                <a href="#">
                  <span className="nav-item-icon">{subItem.icon}</span>
                  <span className="nav-item-text">{subItem.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-placeholder">
          <img src={logo} alt="logo" className="w-15 h-16 object-contain" />
        </div>
        {onClose && (
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <FiX />
          </button>
        )}
      </div>
      
     
      <nav className="sidebar-nav">
        <div className="nav-section">
          <ul className="nav-menu">
            {mainMenuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </div>

       
      </nav>
    </aside>
  );
};

export default Sidebar;

