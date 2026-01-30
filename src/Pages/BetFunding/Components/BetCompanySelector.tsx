import { FiAward } from 'react-icons/fi';

const BET_COMPANIES = [
  'SPORTYBET',
  'BET9JA',
  'NAIRABET',
  '1XBET',
  'BETWAY',
  'BETBABA',
  'BETANO',
  'NAIJABET',
  'BETWINNER',
  'BANGBET',
] as const;

interface BetCompanySelectorProps {
  selectedCompany: string | null;
  onSelect: (code: string) => void;
}

const BetCompanySelector = ({ selectedCompany, onSelect }: BetCompanySelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Select Bet Company
      </label>
      <div className="overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-2 sm:gap-3 min-w-0 shrink-0" style={{ width: 'max-content' }}>
          {BET_COMPANIES.map((company) => {
            const isSelected = selectedCompany === company;
            return (
              <button
                key={company}
                type="button"
                onClick={() => onSelect(company)}
                className={`flex flex-col items-center justify-center min-h-[72px] min-w-[72px] sm:min-w-[80px] sm:min-h-[80px] py-2 px-3 rounded-xl border shrink-0 transition-all duration-200
                  ${isSelected
                    ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                  }`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center mb-1.5 text-[var(--accent-primary)]">
                  <FiAward className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold truncate max-w-[64px] sm:max-w-[72px] text-center ${
                    isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {company}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BetCompanySelector;
