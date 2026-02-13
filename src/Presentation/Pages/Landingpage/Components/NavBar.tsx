import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full bg-white dark:bg-bg-secondary shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo - Fixed size, no flex-shrink */}
        <div className="flex-shrink-0">
          <img
            src="/img/logo2.png"
            alt="Terrabyte Logo"
            className="w-16 sm:w-20 h-auto object-contain"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden flex-shrink-0 p-2 text-gray-600 hover:text-brand-primary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links - Desktop */}
        <ul className="hidden sm:flex gap-4 md:gap-6 lg:gap-8 text-gray-600 dark:text-text-secondary font-medium">
          <li><a href="#home" className="hover:text-brand-primary transition-colors">Home</a></li>
          <li><a href="#features" className="hover:text-brand-primary transition-colors">Features</a></li>
          <li><a href="#about" className="hover:text-brand-primary transition-colors">About Us</a></li>
          <li><a href="#contact" className="hover:text-brand-primary transition-colors">Contact</a></li>
        </ul>

        {/* Theme Toggle & Auth Buttons - Desktop */}
        <div className="hidden sm:flex gap-2 md:gap-3 items-center flex-shrink-0">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:text-brand-primary transition-colors rounded-full hover:bg-brand-primary-lightest"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="px-3 md:px-4 lg:px-6 py-2 border border-brand-primary text-brand-primary rounded-full text-xs sm:text-sm font-medium hover:bg-brand-primary-lightest transition-colors whitespace-nowrap">
            Sign in
          </Link>
          <Link to="/signup" className="px-3 md:px-4 lg:px-6 py-2 bg-brand-primary text-white rounded-full text-xs sm:text-sm font-medium hover:bg-brand-primary-dark transition-colors whitespace-nowrap">
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-bg-secondary border-t border-gray-200 dark:border-border-color shadow-lg sm:hidden z-50">
            <ul className="flex flex-col p-4 space-y-4 bg-white dark:bg-bg-secondary">
            <li><a href="#home" className="block py-2 text-gray-600 dark:text-text-secondary hover:text-brand-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#features" className="block py-2 text-gray-600 dark:text-text-secondary hover:text-brand-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a></li>
            <li><a href="#about" className="block py-2 text-gray-600 dark:text-text-secondary hover:text-brand-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About Us</a></li>
            <li><a href="#contact" className="block py-2 text-gray-600 dark:text-text-secondary hover:text-brand-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
            <div className="flex flex-col gap-3 pt-4 border-t">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 px-6 py-2 border border-brand-primary text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary-lightest transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <Link to="/login" className="px-6 py-2 border border-brand-primary text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary-lightest transition-colors text-center" onClick={() => setIsMenuOpen(false)}>
                Sign in
              </Link>
              <Link to="/signup" className="px-6 py-2 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary-dark transition-colors text-center" onClick={() => setIsMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
