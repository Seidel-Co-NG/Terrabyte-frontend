import { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BANKS } from '../constants/banks';

interface BankSelectorProps {
  value: string;
  onChange: (bank: string) => void;
  placeholder?: string;
  id?: string;
}

const BankSelector = ({ value, onChange, placeholder = 'Select bank', id = 'bank-select' }: BankSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredBanks = useMemo(() => {
    if (!search.trim()) return BANKS;
    const q = search.trim().toLowerCase();
    return BANKS.filter((bank) => bank.toLowerCase().includes(q));
  }, [search]);

  const handleSelect = (bank: string) => {
    onChange(bank);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
        Select Bank
      </label>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 py-3 px-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-left text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
      >
        <span className={value ? '' : 'text-[var(--text-muted)]'}>{value || placeholder}</span>
        <svg
          className={`w-5 h-5 shrink-0 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] flex flex-col rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg overflow-hidden">
            <div className="p-3 border-b border-[var(--border-color)]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bank"
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0">
              {filteredBanks.length === 0 ? (
                <p className="py-4 px-4 text-sm text-[var(--text-muted)] text-center">No bank found</p>
              ) : (
                <ul className="py-1">
                  {filteredBanks.map((bank) => (
                    <li key={bank}>
                      <button
                        type="button"
                        onClick={() => handleSelect(bank)}
                        className={`w-full py-3 px-4 text-left text-sm transition-colors hover:bg-[var(--bg-hover)] ${
                          value === bank ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)] font-medium' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {bank}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BankSelector;
