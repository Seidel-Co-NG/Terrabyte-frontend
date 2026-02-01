import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import SelectionDrawer from '../../../Components/SelectionDrawer';

const METER_TYPES = ['PREPAID', 'POSTPAID'] as const;
export type MeterType = (typeof METER_TYPES)[number];

interface MeterTypeSelectorProps {
  selectedMeterType: MeterType | null;
  onMeterTypeSelected: (type: MeterType) => void;
}

const MeterTypeSelector = ({ selectedMeterType, onMeterTypeSelected }: MeterTypeSelectorProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => setSheetOpen(false);

  const handleSelect = (type: MeterType) => {
    onMeterTypeSelected(type);
    closeSheet();
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Select Meter Type</label>
      <button
        type="button"
        onClick={openSheet}
        className="flex items-center gap-3 w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
      >
        {selectedMeterType ? (
          <span className="font-semibold text-sm">{selectedMeterType}</span>
        ) : (
          <span className="text-[var(--text-muted)]">Meter Type</span>
        )}
        <FiChevronDown className="w-5 h-5 text-[var(--text-muted)] ml-auto shrink-0" />
      </button>

      <SelectionDrawer isOpen={sheetOpen} onClose={closeSheet} title="Select Meter Type">
        <ul className="space-y-2">
          {METER_TYPES.map((type) => {
            const isSelected = selectedMeterType === type;
            return (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => handleSelect(type)}
                  className={`flex items-center justify-center w-full py-3 px-4 rounded-lg border font-semibold text-sm transition-colors
                    ${isSelected
                      ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-primary)]'
                    }`}
                >
                  {type}
                </button>
              </li>
            );
          })}
        </ul>
      </SelectionDrawer>
    </div>
  );
};

export default MeterTypeSelector;
