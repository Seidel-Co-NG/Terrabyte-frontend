const CABLE_PROVIDER_LOGOS: Record<string, string> = {
  GOTV: '/img/gotv.png',
  DSTV: '/img/dstv.png',
  STARTIMES: '/img/startimes.png',
  SHOWMAX: '/img/showmax.png',
};

export interface CableProviderItem {
  name: string;
  code: string;
}

interface CableProviderSelectorProps {
  providers: CableProviderItem[];
  selectedProvider: string | null;
  onSelect: (provider: string) => void;
}

const CableProviderSelector = ({ providers, selectedProvider, onSelect }: CableProviderSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Select Cable Company
      </label>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {providers.map((provider) => {
          const isSelected = selectedProvider === provider.code || selectedProvider === provider.name;
          const displayName = provider.name || provider.code;
          const logo = CABLE_PROVIDER_LOGOS[displayName] ?? CABLE_PROVIDER_LOGOS[provider.code];
          return (
            <button
              key={provider.code}
              type="button"
              onClick={() => onSelect(provider.code)}
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
                    alt={displayName}
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    {displayName.charAt(0)}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold truncate max-w-full px-0.5 ${
                  isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                }`}
              >
                {displayName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CableProviderSelector;
