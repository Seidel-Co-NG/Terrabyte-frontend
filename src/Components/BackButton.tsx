import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export interface BackButtonProps {
  /** Optional fallback path when there is no history (e.g. '/dashboard') */
  fallbackTo?: string;
  /** Show "Back" label next to the icon */
  showLabel?: boolean;
  className?: string;
}

/**
 * Reusable back button for service pages. Goes back in history, or to fallback path.
 */
const BackButton = ({ fallbackTo = '/dashboard', showLabel = true, className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 py-2 pr-3 pl-1 -ml-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${className}`}
      aria-label="Go back"
    >
      <FiArrowLeft className="w-5 h-5 shrink-0" />
      {showLabel && <span className="text-sm font-medium">Back</span>}
    </button>
  );
};

export default BackButton;
