import { useState } from 'react';
import { FiZap, FiChevronDown } from 'react-icons/fi';
import SelectionDrawer from '../../../Components/SelectionDrawer';

export interface DiscoCompany {
  name: string;
  code: string;
}

interface DiscoSelectorProps {
  selectedDisco: string | null;
  discoCompanies: DiscoCompany[];
  onDiscoSelected: (code: string) => void;
}

const DiscoSelector = ({ selectedDisco, discoCompanies, onDiscoSelected }: DiscoSelectorProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedCompany = selectedDisco
    ? discoCompanies.find((c) => c.code === selectedDisco) ?? null
    : null;
  const displayValue = selectedCompany ? selectedCompany.name.toUpperCase() : '';

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => setSheetOpen(false);

  const handleSelect = (company: DiscoCompany) => {
    onDiscoSelected(company.code);
    closeSheet();
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Select Disco Company</label>
      <button
        type="button"
        onClick={openSheet}
        className="flex items-center gap-3 w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
      >
        {displayValue ? (
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--accent-primary)]">
              <FiZap className="w-4 h-4" />
            </span>
            <span className="font-semibold text-sm">{displayValue}</span>
          </span>
        ) : (
          <span className="text-[var(--text-muted)]">Disco Company</span>
        )}
        <FiChevronDown className="w-5 h-5 text-[var(--text-muted)] ml-auto shrink-0" />
      </button>

      <SelectionDrawer
        isOpen={sheetOpen}
        onClose={closeSheet}
        title="Select Disco Company"
      >
        <ul className="space-y-2">
          {discoCompanies.map((company) => {
            const isSelected = selectedDisco === company.code;
            return (
              <li key={company.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(company)}
                  className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg border text-left transition-colors
                    ${isSelected
                      ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-primary)]'
                    }`}
                >
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                    <FiZap className="w-4 h-4" />
                  </span>
                  <span className="font-semibold text-sm">{company.name.toUpperCase()}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </SelectionDrawer>
    </div>
  );
};

export default DiscoSelector;
