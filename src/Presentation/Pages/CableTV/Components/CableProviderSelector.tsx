const CABLE_PROVIDER_LOGOS: Record<string, string> = {
  GOTV: '/img/gotv.png',
  DSTV: '/img/dstv.png',
  STARTIMES: '/img/startimes.png',
  SHOWMAX: '/img/showmax.png',
};

const CABLE_PROVIDERS = [
  { name: 'GOTV', code: 'GOTV' },
  { name: 'DSTV', code: 'DSTV' },
  { name: 'STARTIMES', code: 'STARTIMES' },
  { name: 'SHOWMAX', code: 'SHOWMAX' },
] as const;

interface CableProviderSelectorProps {
  selectedProvider: string | null;
  onSelect: (provider: string) => void;
}

const CableProviderSelector = ({ selectedProvider, onSelect }: CableProviderSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Select Cable Company
      </label>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {CABLE_PROVIDERS.map((provider) => {
          const isSelected = selectedProvider === provider.name;
          return (
            <button
              key={provider.name}
              type="button"
              onClick={() => onSelect(provider.name)}
              className={`flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px] py-2 sm:py-3 rounded-xl border transition-all duration-200
                ${isSelected
                  ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                }`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 shrink-0 p-0.5">
                <img
                  src={CABLE_PROVIDER_LOGOS[provider.name]}
                  alt={provider.name}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold truncate max-w-full px-0.5 ${
                  isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                }`}
              >
                {provider.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CableProviderSelector;
