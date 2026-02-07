const NETWORK_LOGOS: Record<string, string> = {
  MTN: '/img/mtn.png',
  GLO: '/img/glo.png',
  AIRTEL: '/img/airtel.png',
  '9MOBILE': '/img/9mobile.png',
};

interface DataNetworkSelectorProps {
  /** Networks from API (e.g. derived from data plans). Used for list; fallback if empty. */
  networks?: string[];
  selectedNetwork: string | null;
  onSelect: (network: string) => void;
  loading?: boolean;
}

const FALLBACK_NETWORKS = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];

const DataNetworkSelector = ({ networks = [], selectedNetwork, onSelect, loading = false }: DataNetworkSelectorProps) => {
  const list = networks.length > 0 ? networks : FALLBACK_NETWORKS;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Select Network</label>
      {loading ? (
        <div className="flex justify-center py-6">
          <span className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin block" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {list.map((networkName) => {
            const isSelected = selectedNetwork === networkName;
            const logo = NETWORK_LOGOS[networkName.toUpperCase()];
            return (
              <button
                key={networkName}
                type="button"
                onClick={() => onSelect(networkName)}
                className={`flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px] py-2 sm:py-3 rounded-xl border transition-all duration-200
                  ${isSelected
                    ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                  }`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 shrink-0 p-0.5">
                  {logo ? (
                    <img
                      src={logo}
                      alt={networkName}
                      className="w-full h-full object-contain rounded-full"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      {networkName.charAt(0)}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold truncate max-w-full px-0.5 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                  {networkName.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DataNetworkSelector;
