import { Link } from 'react-router-dom';

interface WelcomeHeaderProps {
  username?: string;
  userType?: string;
}

const WelcomeHeader = ({ username = 'Mr. Jack', userType = 'Premium' }: WelcomeHeaderProps) => {
  return (
    <div className="w-full mb-6 lg:mb-5 p-6 lg:p-5 md:p-4 bg-gradient-to-br from-[var(--accent-hover)] to-[rgba(124,58,237,0.1)] border border-[var(--accent-hover)] rounded-xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
        <div className="flex-1">
          <h1 className="text-[1.75rem] lg:text-2xl md:text-xl sm:text-[1.1rem] font-bold text-[var(--text-primary)] m-0 mb-2 leading-tight">
            Welcome back, <span className="text-[var(--accent-primary)] font-bold">{username}</span>
          </h1>
          <p className="text-[0.95rem] md:text-[0.85rem] sm:text-[0.8rem] text-[var(--text-secondary)] m-0 leading-relaxed">
            VTU Dashboard - Your one-stop solution for all virtual top-up services
          </p>
          <Link
            to="/dashboard/profile"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
          >
            View profile
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <Link
          to="/dashboard/profile"
          className="flex flex-col items-end lg:items-end w-full lg:w-auto lg:min-w-[150px] gap-1 p-4 lg:py-4 lg:px-6 md:py-3 md:px-4 bg-[var(--accent-hover)] border border-[var(--accent-hover)] rounded-lg hover:border-[var(--accent-primary)] transition-colors no-underline"
        >
          <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide font-medium">Account Type:</span>
          <span className="text-base md:text-[0.9rem] font-bold text-[var(--accent-primary)] uppercase tracking-wider">{userType}</span>
          <span className="text-xs text-[var(--text-muted)] mt-1">Edit profile →</span>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeHeader;
