import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  to?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}

const SettingItem = ({ icon: Icon, title, subtitle, to, onClick, trailing }: SettingItemProps) => {
  const content = (
    <>
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] shrink-0">
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
      </div>
      {trailing ?? (
        <span className="text-[var(--text-muted)] shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </>
  );

  const baseClass =
    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors text-left';

  if (to) {
    return (
      <Link to={to} className={`${baseClass} no-underline`}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {content}
    </button>
  );
};

export default SettingItem;
