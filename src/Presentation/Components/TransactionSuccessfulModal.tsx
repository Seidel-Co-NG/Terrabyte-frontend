import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export interface TransactionSuccessfulModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  transactionId?: string;
  amount?: string | number;
}

const TransactionSuccessfulModal = ({ isOpen, onClose, title = 'Payment Successful', message, transactionId, amount }: TransactionSuccessfulModalProps) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleDone = () => {
    onClose();
    navigate('/dashboard', { replace: true });
  };

  const modalContent = (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={onClose} />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-sm bg-[var(--bg-card)] rounded-2xl p-6 pointer-events-auto border border-[var(--border-color)] shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
            {message && <p className="text-sm text-[var(--text-secondary)] mb-4">{message}</p>}
            <div className="w-full mb-4">
              <div className="flex justify-between text-sm text-[var(--text-secondary)]"><span>Transaction ID</span><span className="font-medium">{transactionId}</span></div>
              {amount && <div className="flex justify-between text-sm text-[var(--text-secondary)] mt-1"><span>Amount</span><span className="font-medium">₦{amount}</span></div>}
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={handleDone} className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium">Done</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TransactionSuccessfulModal;
