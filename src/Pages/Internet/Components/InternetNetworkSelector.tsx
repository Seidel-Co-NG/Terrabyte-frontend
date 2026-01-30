import { FiWifi } from 'react-icons/fi';

const INTERNET_NETWORKS = [
  { name: 'SMILE', code: 'SMILE' },
  { name: 'SPECTRANET', code: 'SPECTRANET' },
] as const;

interface InternetNetworkSelectorProps {
  selectedNetwork: string | null;
  onSelect: (network: string) => void;
}

const InternetNetworkSelector = ({ selectedNetwork, onSelect }: InternetNetworkSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Select Network
      </label>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {INTERNET_NETWORKS.map((network) => {
          const isSelected = selectedNetwork === network.name;
          return (
            <button
              key={network.name}
              type="button"
              onClick={() => onSelect(network.name)}
              className={`flex flex-col items-center justify-center min-h-[80px] min-w-[100px] sm:min-w-[120px] py-3 px-4 rounded-xl border transition-all duration-200
                ${isSelected
                  ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center mb-2 text-[var(--accent-primary)]">
                <FiWifi className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-semibold truncate max-w-full ${
                  isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                }`}
              >
                {network.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InternetNetworkSelector;
