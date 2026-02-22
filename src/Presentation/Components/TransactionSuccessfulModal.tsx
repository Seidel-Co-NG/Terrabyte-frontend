import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

export interface TransactionSuccessfulModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  description?: string;
  transactionId?: string;
  amount?: string | number;
  transactionType?: string;
  date?: string;
  recipient?: string;
}

const TransactionSuccessfulModal = ({
  isOpen,
  onClose,
  title = 'Payment Successful',
  message,
  description,
  transactionId,
  amount,
  transactionType,
  date,
  recipient,
}: TransactionSuccessfulModalProps) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleDone = () => {
    onClose();
    navigate('/dashboard', { replace: true });
  };

  const handleShare = () => {
    const lines = [
      'TRANSACTION RECEIPT - Terrabyte',
      '',
      title,
      message || '',
      '',
      transactionId && `Trx ID: ${transactionId}`,
      date && `Date: ${date}`,
      description && `Description: ${description}`,
      recipient && `Recipient: ${recipient}`,
      transactionType && `Transaction Type: ${transactionType}`,
      amount != null && `Amount: ₦${amount}`,
      '',
      'Thank you for using Terrabyte',
    ].filter(Boolean);
    const text = lines.join('\n');
    if (navigator.share) {
      navigator
        .share({
          title: 'Transaction Receipt',
          text,
          url: window.location.origin,
        })
        .then(() => toast.success('Receipt shared'))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Receipt copied to clipboard');
    }
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
            {message && <p className="text-sm text-[var(--text-secondary)] mb-2">{message}</p>}
            {description && <p className="text-xs text-[var(--text-muted)] mb-3 text-left w-full">{description}</p>}
            <div className="w-full mb-4 space-y-1">
              {transactionId && <div className="flex justify-between text-sm text-[var(--text-secondary)]"><span>Transaction ID</span><span className="font-medium">{transactionId}</span></div>}
              {amount != null && <div className="flex justify-between text-sm text-[var(--text-secondary)]"><span>Amount</span><span className="font-medium">₦{typeof amount === 'number' ? amount.toLocaleString() : amount}</span></div>}
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={handleShare} className="flex-1 py-2.5 rounded-xl border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-medium hover:bg-[var(--accent-hover)] transition-colors">
                Share Receipt
              </button>
              <button onClick={handleDone} className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium hover:opacity-90">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TransactionSuccessfulModal;
