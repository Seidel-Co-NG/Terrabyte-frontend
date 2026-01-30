import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import { getServiceIcon } from '../../utils/getServiceIcon';
import { MOCK_TRANSACTIONS } from './mockTransactions';
import type { Transaction } from '../../types/transaction';

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'successful' || s === 'success' || s === 'completed') return 'text-[var(--success)]';
  if (s === 'failed' || s === 'error' || s === 'declined') return 'text-[var(--error)]';
  if (s === 'processing' || s === 'pending') return 'text-[var(--warning)]';
  return 'text-[var(--text-muted)]';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3 sm:gap-4 py-3 border-b border-[var(--border-color)] last:border-0">
      <span className="text-xs text-[var(--text-secondary)] shrink-0">{label}</span>
      <span className="text-xs font-semibold text-[var(--text-primary)] text-right break-all max-w-[65%] sm:max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

function isPinTransaction(tx: Transaction): boolean {
  const s = (tx.serviceType || '').toLowerCase();
  return (
    s.includes('recharge pin') ||
    s.includes('exam pin') ||
    s.includes('jamb') ||
    s.includes('waec') ||
    s.includes('neco') ||
    s.includes('nabteb')
  );
}

const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const transaction = MOCK_TRANSACTIONS.find((t) => t.id === Number(id));

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <p className="text-[var(--text-secondary)] mb-4">Transaction not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/transactions')}
          className="py-2 px-4 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const iconPath = getServiceIcon(transaction.serviceType);
  const showViewPins = isPinTransaction(transaction);

  const handleReport = () => {
    // TODO: open report dialog / API
    alert('Report transaction (optional reason). Integrate with API when ready.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Transaction Receipt',
          text: `${transaction.title} - ${transaction.formattedAmount} (${transaction.status})`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${transaction.title}\n${transaction.formattedAmount}\nRef: ${transaction.transactionReference}\n${transaction.formattedDate}`
      );
      alert('Receipt copied to clipboard.');
    }
  };

  const handleViewPins = () => {
    // TODO: fetch pins by transaction reference / show pin receipt
    alert('View Pins – integrate with API when ready.');
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/transactions" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Transaction Details</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center mb-2">
                {iconPath ? (
                  <img src={iconPath} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">
                    {(transaction.serviceType || 'T').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{transaction.title}</p>
              <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-0.5">
                {transaction.formattedAmount}
              </p>
              <p className={`text-xs font-semibold uppercase mt-0.5 ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <DetailRow label="Ref" value={transaction.transactionReference} />
            <DetailRow label="Date" value={transaction.formattedDate} />
            <DetailRow label="Service Type" value={transaction.serviceType} />
            <DetailRow label="Description" value={transaction.description} />
            <DetailRow label="Transaction Type" value={transaction.transactionType} />
            <DetailRow label="Pre Balance" value={`₦${transaction.preBalance.toFixed(2)}`} />
            <DetailRow label="Post Balance" value={`₦${transaction.postBalance.toFixed(2)}`} />
            {transaction.apiResponse && (
              <div className="pt-3 mt-2 border-t border-[var(--border-color)]">
                <p className="text-xs font-bold text-[var(--text-primary)]">{transaction.apiResponse}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {showViewPins && (
              <button
                type="button"
                onClick={handleViewPins}
                className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                View Pins
              </button>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReport}
                className="flex-1 py-3.5 rounded-xl border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                Report Transaction
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-3.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Share Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
