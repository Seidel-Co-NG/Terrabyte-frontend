import { Delete } from 'lucide-react';

const PIN_LENGTH = 5;
export const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'back'],
];

interface PinKeypadProps {
  pin?: string[];
  onKeyTap: (key: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

export const PinKeypad = ({ onKeyTap, onBackspace, disabled }: PinKeypadProps) => (
  <div className="w-full max-w-[280px] mx-auto">
    {KEYPAD_ROWS.map((row, rowIdx) => (
      <div key={rowIdx} className="flex justify-center gap-2 sm:gap-4 mb-2">
        {row.map((key) =>
          key === 'back' ? (
            <button
              key="back"
              type="button"
              onClick={onBackspace}
              disabled={disabled}
              className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-95 transition-all disabled:opacity-50"
              aria-label="Backspace"
            >
              <Delete size={26} strokeWidth={2} />
            </button>
          ) : key === '' ? (
            <div key="empty" className="flex-1 max-w-[72px] h-12 sm:h-14" />
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => onKeyTap(key)}
              disabled={disabled}
              className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl text-2xl font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-95 transition-all disabled:opacity-50"
            >
              {key}
            </button>
          )
        )}
      </div>
    ))}
  </div>
);

export const PinDots = ({ pin }: { pin: string[] }) => (
  <div className="flex justify-center gap-3 sm:gap-4">
    {pin.map((digit, i) => (
      <div
        key={i}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] border-2 border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-input)]"
      >
        <div
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            digit ? 'bg-[var(--text-primary)]' : 'bg-transparent'
          }`}
        />
      </div>
    ))}
  </div>
);

export { PIN_LENGTH };
