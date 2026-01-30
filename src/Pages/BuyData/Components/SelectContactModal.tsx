export interface RecentContact {
  id: string;
  name: string;
  phone: string;
  network: string;
}

interface SelectContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: RecentContact[];
  onSelect: (contact: RecentContact) => void;
}

const formatDisplayPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

const SelectContactModal = ({ isOpen, onClose, contacts, onSelect }: SelectContactModalProps) => {
  if (!isOpen) return null;

  const handleSelect = (contact: RecentContact) => {
    onSelect(contact);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-[28rem] max-h-[80vh] flex flex-col bg-[var(--bg-card)] rounded-xl shadow-xl pointer-events-auto overflow-hidden border border-[var(--border-color)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Select Contact</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0 p-4">
            {contacts.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">No recent contacts. Enter a number manually.</p>
            ) : (
              <ul className="space-y-2">
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(contact)}
                      className="w-full text-left py-3 px-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors"
                    >
                      <span className="block font-medium text-sm text-[var(--text-primary)]">{contact.name}</span>
                      <span className="block text-xs text-[var(--text-tertiary)] mt-0.5">{formatDisplayPhone(contact.phone)} · {contact.network}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectContactModal;
