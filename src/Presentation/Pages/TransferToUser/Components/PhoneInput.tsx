import React from 'react';

type Props = {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onSelectContact?: () => void;
  error?: string;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

export default function PhoneInput({
  phone,
  onPhoneChange,
  onSelectContact,
  error,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    onPhoneChange(raw);
  };

  const displayPhone = formatPhone(phone);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Enter Phone Number
      </label>
      <div className="relative">
        <input
          type="tel"
          inputMode="numeric"
          maxLength={14}
          value={displayPhone}
          onChange={handleChange}
          placeholder="0801 234 5678"
          className="w-full py-3 px-4 pr-28 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
        {onSelectContact && (
          <button
            type="button"
            onClick={onSelectContact}
            className="absolute right-2 top-1/2 -translate-y-1/2 py-2 px-3 rounded-lg text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors"
          >
            Select Contact
          </button>
        )}
      </div>
      {phone.length > 0 && phone.length !== 11 && (
        <p className="text-xs text-[var(--error)]">Phone number must be 11 digits</p>
      )}
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
