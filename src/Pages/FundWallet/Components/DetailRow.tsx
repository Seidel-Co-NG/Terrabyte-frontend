import { FiCopy } from 'react-icons/fi';

interface DetailRowProps {
  label: string;
  value: string;
  isCopyable?: boolean;
}

const DetailRow = ({ label, value, isCopyable = false }: DetailRowProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    // Could use a toast here
    alert('Copied to clipboard');
  };

  return (
    <div className="flex justify-between items-center gap-3 py-2 sm:py-2.5 border-b border-[var(--border-color)] last:border-0">
      <span className="text-xs sm:text-sm text-[var(--text-secondary)] shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate text-right">
          {value}
        </span>
        {isCopyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors"
            aria-label="Copy"
          >
            <FiCopy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailRow;
