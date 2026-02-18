import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiBell, FiMenu } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../core/stores/auth.store';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name ?? user?.username ?? 'User';
  const initial = (user?.name?.[0] ?? user?.username?.[0] ?? 'U').toUpperCase();
  const profilePictureUrl = user?.profile_picture_url;

  return (
    <header className="h-[70px] md:h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-3 sm:px-4 lg:px-6 fixed top-0 left-0 right-0 lg:left-[260px] z-[999] gap-2 sm:gap-4">
      <button
        type="button"
        className="lg:hidden flex items-center justify-center p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors shrink-0"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <FiMenu size={24} />
      </button>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto min-w-0">
        <button
          type="button"
          className="flex p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors relative shrink-0"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <Link
          to="/dashboard/notifications"
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors relative flex items-center justify-center shrink-0"
          aria-label="Notifications"
        >
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--error)]" />
        </Link>

        <Link to="/dashboard/profile" className="shrink-0 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-semibold text-white text-xs sm:text-sm shrink-0 overflow-hidden">
              {profilePictureUrl ? (
                <img src={profilePictureUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <span className="text-[var(--text-primary)] text-sm font-medium hidden md:inline truncate max-w-[120px] lg:max-w-[160px]">{displayName}</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
