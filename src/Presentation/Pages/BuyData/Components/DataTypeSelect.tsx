import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import SelectionDrawer from '../../../Components/SelectionDrawer';

export interface DataTypeOption {
  code: string;
  name: string;
}

/** Fallback when API returns no types for the selected network */
const FALLBACK_DATA_TYPES: DataTypeOption[] = [
  { code: 'SME', name: 'SME' },
  { code: 'GIFTING', name: 'Gifting' },
  { code: 'DIRECT', name: 'Direct' },
];

interface DataTypeSelectProps {
  /** Data types from API for the selected network. When empty, fallback is used. */
  dataTypes?: DataTypeOption[];
  selectedDataType: string | null;
  onSelect: (type: string | null) => void;
  disabled?: boolean;
}

const DataTypeSelect = ({ dataTypes = [], selectedDataType, onSelect, disabled }: DataTypeSelectProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const types = dataTypes.length > 0 ? dataTypes : FALLBACK_DATA_TYPES;

  const selected = types.find((t) => t.code === selectedDataType);
  const displayValue = selected ? selected.name : '';

  const handleSelect = (type: DataTypeOption) => {
    onSelect(type.code);
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Select Data Type</label>
      <button
        type="button"
        onClick={() => !disabled && setDrawerOpen(true)}
        disabled={disabled}
        className="flex items-center justify-between w-full min-h-[48px] py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={displayValue ? 'font-medium' : 'text-[var(--text-muted)]'}>
          {displayValue || 'Choose data type'}
        </span>
        <FiChevronDown className="w-5 h-5 text-[var(--text-muted)] shrink-0 ml-2" />
      </button>

      <SelectionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Select Data Type"
      >
        <ul className="space-y-2">
          {types.map((type) => {
            const isSelected = selectedDataType === type.code;
            return (
              <li key={type.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(type)}
                  className={`flex items-center justify-center w-full min-h-[48px] py-3 px-4 rounded-lg border font-medium text-sm sm:text-base transition-colors
                    ${isSelected
                      ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-primary)]'
                    }`}
                >
                  {type.name}
                </button>
              </li>
            );
          })}
        </ul>
      </SelectionDrawer>
    </div>
  );
};

export default DataTypeSelect;
