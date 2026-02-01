import { Link } from 'react-router-dom';
import { getServiceIcon } from '../../../../Parameters/utils/getServiceIcon';
import { useTransactionsStore } from '../../../../core/stores/transactions.store';

const RECENT_COUNT = 5;

const RecentTransactions = () => {
  const list = useTransactionsStore((s) => s.list);
  const isLoading = useTransactionsStore((s) => s.isLoading);
  const error = useTransactionsStore((s) => s.error);
  const recentTransactions = list.slice(0, RECENT_COUNT);

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-4 mb-6">
        <h3 className="text-[1.1rem] md:text-base font-semibold text-[var(--text-primary)] m-0">Recent Transactions</h3>
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/transactions"
            className="py-2 px-4 bg-[var(--accent-hover)] border border-[var(--accent-primary)] rounded-md text-[var(--accent-primary)] text-[0.85rem] md:text-[0.75rem] font-medium cursor-pointer whitespace-nowrap transition-all hover:border-[var(--accent-secondary)] hover:text-[var(--text-primary)] hover:-translate-y-px hover:shadow-[0_2px_6px_var(--accent-hover)]"
          >
            All Transactions
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {isLoading && recentTransactions.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] py-4">Loading...</p>
        ) : error && recentTransactions.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] py-4">{error}</p>
        ) : recentTransactions.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] py-4">No recent transactions</p>
        ) : null}
        {recentTransactions.map((tx) => {
          const iconPath = getServiceIcon(tx.serviceType);
          return (
            <Link
              key={tx.id}
              to={`/dashboard/transactions/${tx.id}`}
              className="flex flex-wrap items-center gap-4 md:gap-3 p-4 md:p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg transition-colors hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]"
            >
              <div className="shrink-0">
                <div className="w-10 h-10 md:w-9 md:h-9 rounded-full overflow-hidden bg-[var(--bg-card)] flex items-center justify-center">
                  {iconPath ? (
                    <img src={iconPath} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      {(tx.serviceType || 'T').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-[0.85rem] font-medium text-[var(--text-primary)] mb-1">{tx.title}</div>
                <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-tertiary)]">{tx.formattedDate}</div>
              </div>
              <div className="text-[0.95rem] md:text-[0.9rem] font-semibold text-[var(--success)] ml-auto">
                {tx.formattedAmount}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;
