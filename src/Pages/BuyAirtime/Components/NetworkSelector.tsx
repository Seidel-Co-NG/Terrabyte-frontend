const NETWORK_LOGOS: Record<string, string> = {
  MTN: '/img/mtn.png',
  GLO: '/img/glo.png',
  AIRTEL: '/img/airtel.png',
  '9MOBILE': '/img/9mobile.png',
};

const NETWORKS = [
  { name: 'MTN', code: 'MTN' },
  { name: 'AIRTEL', code: 'AIRTEL' },
  { name: 'GLO', code: 'GLO' },
  { name: '9MOBILE', code: '9MOBILE' },
] as const;

interface NetworkSelectorProps {
  selectedNetwork: string | null;
  onSelect: (network: string) => void;
}

const NetworkSelector = ({ selectedNetwork, onSelect }: NetworkSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Select Network</label>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {NETWORKS.map((network) => {
          const isSelected = selectedNetwork === network.name;
          return (
            <button
              key={network.name}
              type="button"
              onClick={() => onSelect(network.name)}
              className={`flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px] py-2 sm:py-3 rounded-xl border transition-all duration-200
                ${isSelected
                  ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                }`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 shrink-0 p-0.5">
                <img
                  src={NETWORK_LOGOS[network.name]}
                  alt={network.name}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold truncate max-w-full px-0.5 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                {network.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkSelector;
