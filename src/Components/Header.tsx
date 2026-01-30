import { FiSun, FiMoon, FiBell, FiMenu } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-[70px] md:h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 fixed top-0 left-[280px] right-0 z-[999] gap-4 lg:left-0">
      <button
        type="button"
        className="lg:hidden flex items-center justify-center p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-2xl"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <FiMenu />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <button
          type="button"
          className="hidden sm:flex p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-xl relative"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        <button
          type="button"
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-xl relative flex items-center justify-center"
        >
          <FiBell />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--error)] translate-x-1/2 -translate-y-1/2" />
        </button>

        <div className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-semibold text-[var(--text-primary)] text-sm">
            J
          </div>
          <span className="text-[var(--text-primary)] text-sm font-medium hidden md:inline">Mr. Jack</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
