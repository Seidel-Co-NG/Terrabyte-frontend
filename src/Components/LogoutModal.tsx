import { createPortal } from 'react-dom';
import { FiLogOut } from 'react-icons/fi';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null;

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-[1001] bg-black/50 min-h-[100dvh]"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1002] w-full max-w-sm mx-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--error)]/10 flex items-center justify-center mb-4">
            <FiLogOut className="w-7 h-7 text-[var(--error)]" />
          </div>
          <h2 id="logout-modal-title" className="text-lg font-bold text-[var(--text-primary)] mb-1">
            Log out?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to log out of your account?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-primary)] text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[var(--error)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default LogoutModal;
