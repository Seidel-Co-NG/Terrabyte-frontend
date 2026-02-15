import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { getServiceIcon } from '../../../Parameters/utils/getServiceIcon';
import { useTransactionsStore } from '../../../core/stores/transactions.store';
import { transactionsApi } from '../../../core/api/transactions.api';
import { servicesApi } from '../../../core/api';
import PinReceiptModal, { type PinReceiptPin } from '../../Components/PinReceiptModal';
import type { Transaction } from '../../../Parameters/types/transaction';

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
        {value ?? '—'}
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
  const list = useTransactionsStore((s) => s.list);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [pinsOpen, setPinsOpen] = useState(false);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [pins, setPins] = useState<PinReceiptPin[]>([]);

  const idNum = id ? Number(id) : NaN;

  useEffect(() => {
    const tx = list.find((t) => t.id === idNum);
    if (tx) {
      setTransaction(tx);
      setLoading(false);
      return;
    }
    if (!idNum || isNaN(idNum)) {
      setLoading(false);
      return;
    }
    fetchTransactions({ limit: 100 })
      .then(() => {
        const found = useTransactionsStore.getState().list.find((t) => t.id === idNum);
        setTransaction(found ?? null);
      })
      .catch(() => setTransaction(null))
      .finally(() => setLoading(false));
  }, [idNum, list, fetchTransactions]);

  const handleReport = async () => {
    if (!transaction || transaction.id == null) return;
    setReporting(true);
    try {
      const res = await transactionsApi.reportTransaction(Number(transaction.id), {
        reason: reportReason.trim() || undefined,
      });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        toast.success(res?.message ?? 'Transaction reported. We will look into it.');
        setReportOpen(false);
        setReportReason('');
      } else {
        toast.error(res?.message ?? 'Failed to report transaction');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to report transaction');
    } finally {
      setReporting(false);
    }
  };

  const handleShare = () => {
    if (!transaction) return;
    const title = transaction.title ?? transaction.serviceType ?? 'Transaction';
    const text = `${title} - ${transaction.formattedAmount ?? ''} (${transaction.status ?? ''})\nRef: ${transaction.transactionReference ?? ''}\n${transaction.formattedDate ?? ''}`;
    if (navigator.share) {
      navigator
        .share({
          title: 'Transaction Receipt',
          text,
          url: window.location.href,
        })
        .then(() => toast.success('Shared'))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Receipt copied to clipboard');
    }
  };

  const handleViewPins = async () => {
    if (!transaction) return;
    setPinsLoading(true);
    setPins([]);
    try {
      const res = await servicesApi.getPinsByBuyId(transaction.transactionReference);
      const data = (res as { data?: { pins?: Array<{ serial_number?: string; pin?: string; amount?: number; network?: string }> } })?.data;
      const rawPins = data?.pins ?? [];
      const mapped: PinReceiptPin[] = rawPins.map((p) => ({
        serialNumber: p.serial_number ?? '',
        pin: p.pin ?? '',
        amount: p.amount ?? 0,
        network: p.network,
      }));
      setPins(mapped);
      setPinsOpen(true);
      if (mapped.length === 0) toast('No pins found for this transaction.');
    } catch {
      toast.error('Failed to load pins');
    } finally {
      setPinsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4">
        <p className="text-[var(--text-secondary)] mb-4">Transaction not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/transactions')}
          className="py-2 px-4 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  let iconPath: string | undefined;
  try {
    iconPath = getServiceIcon(transaction.serviceType ?? '') ?? undefined;
  } catch {
    iconPath = undefined;
  }
  const showViewPins = isPinTransaction(transaction);

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
          {/* Service icon & amount card - Flutter style */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="flex flex-col items-center">
              <div className="w-[35px] h-[35px] sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center mb-2">
                {iconPath ? (
                  <img src={iconPath} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">
                    {(transaction.serviceType || 'T').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {transaction.title ?? transaction.serviceType ?? 'Transaction'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-0.5">
                {transaction.formattedAmount ?? `₦${(Number(transaction.amount) || 0).toLocaleString()}`}
              </p>
              <p className={`text-xs font-semibold uppercase mt-0.5 ${getStatusColor(transaction.status ?? '')}`}>
                {transaction.status ?? '—'}
              </p>
            </div>
          </div>

          {/* Detail rows card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <DetailRow label="Ref" value={transaction.transactionReference ?? ''} />
            <DetailRow label="Date" value={transaction.formattedDate ?? ''} />
            <DetailRow label="Service Type" value={transaction.serviceType ?? ''} />
            <DetailRow label="Description" value={transaction.description ?? ''} />
            <DetailRow label="Transaction Type" value={transaction.transactionType ?? ''} />
            <DetailRow
              label="Pre Balance"
              value={`₦${(Number(transaction.preBalance) || 0).toFixed(2)}`}
            />
            <DetailRow
              label="Post Balance"
              value={`₦${(Number(transaction.postBalance) || 0).toFixed(2)}`}
            />
            {transaction.apiResponse && (
              <div className="pt-3 mt-2 border-t border-[var(--border-color)]">
                <p className="text-xs font-bold text-[var(--text-primary)]">{transaction.apiResponse}</p>
              </div>
            )}
          </div>

          {/* Actions - Flutter order: View Pins, Report, Share */}
          <div className="flex flex-col gap-3 pt-2">
            {showViewPins && (
              <button
                type="button"
                onClick={handleViewPins}
                disabled={pinsLoading}
                className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {pinsLoading ? 'Loading...' : 'View Pins'}
              </button>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setReportOpen(true)}
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

      {/* Report dialog */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !reporting && setReportOpen(false)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Report Transaction</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 mb-3">
              Please provide a reason (optional):
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              disabled={reporting}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => !reporting && setReportOpen(false)}
                disabled={reporting}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReport}
                disabled={reporting}
                className="flex-1 py-2.5 rounded-xl bg-[var(--error)] text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {reporting ? 'Reporting...' : 'Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      <PinReceiptModal
        isOpen={pinsOpen}
        onClose={() => setPinsOpen(false)}
        transactionReference={transaction.transactionReference ?? ''}
        nameOnCard="Customer"
        pins={pins}
      />
    </div>
  );
};

export default TransactionDetails;
