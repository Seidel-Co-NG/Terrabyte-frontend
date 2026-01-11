import { FiSun, FiMoon, FiBell, FiMenu } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <FiMenu />
      </button>
      
      <div className="header-right">
        
        <button 
          className="header-icon-btn theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        
        <button className="header-icon-btn notification-btn">
          <FiBell />
          <span className="badge badge-red"></span>
        </button>
       
        <div className="user-profile">
          <div className="user-avatar">J</div>
          <span className="user-name">Mr. Jack</span>
        </div>
        
      </div>
    </header>
  );
};

export default Header;

