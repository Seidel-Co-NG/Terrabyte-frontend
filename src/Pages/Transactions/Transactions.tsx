import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import BackButton from '../../Components/BackButton';
import { getServiceIcon } from '../../utils/getServiceIcon';
import { MOCK_TRANSACTIONS } from './mockTransactions';
import type { Transaction } from '../../types/transaction';

const TYPE_FILTERS = ['All', 'Airtime', 'Data', 'Electricity', 'TV', 'Wallet'];
const STATUS_OPTIONS = ['All', 'Processing', 'Successful', 'Failed'];

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'successful' || s === 'success' || s === 'completed') return 'text-[var(--success)] bg-[var(--success)]/10';
  if (s === 'failed' || s === 'error' || s === 'declined') return 'text-[var(--error)] bg-[var(--error)]/10';
  if (s === 'processing' || s === 'pending') return 'text-[var(--warning)] bg-[var(--warning)]/10';
  return 'text-[var(--text-muted)] bg-[var(--bg-tertiary)]';
}

function matchTypeFilter(tx: Transaction, filter: string): boolean {
  if (filter === 'All') return true;
  const cat = (tx.typeCategory || tx.serviceType || '').toLowerCase();
  const f = filter.toLowerCase();
  if (f === 'airtime') return cat.includes('airtime');
  if (f === 'data') return cat.includes('data');
  if (f === 'electricity') return cat.includes('electric');
  if (f === 'tv') return cat.includes('tv') || cat.includes('dstv') || cat.includes('gotv') || cat.includes('cable');
  if (f === 'wallet') return cat.includes('wallet') || cat.includes('funding') || cat.includes('pin');
  return cat.includes(f);
}

const Transactions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchStatus = statusFilter === 'All' || tx.status.toLowerCase() === statusFilter.toLowerCase();
      const matchType = matchTypeFilter(tx, typeFilter);
      const matchSearch =
        !search.trim() ||
        tx.title.toLowerCase().includes(search.toLowerCase()) ||
        tx.transactionReference.toLowerCase().includes(search.toLowerCase()) ||
        tx.description.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [search, statusFilter, typeFilter]);

  const isEmpty = filtered.length === 0;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Transaction History</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative min-w-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto sm:min-w-[120px] px-3 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium outline-none focus:border-[var(--accent-primary)] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 scrollbar-thin">
            {TYPE_FILTERS.map((filter) => {
              const isSelected = typeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTypeFilter(filter)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">No recent transactions</p>
              <p className="text-sm text-[var(--text-tertiary)] max-w-xs">
                You haven&apos;t made any transactions yet. Fund your wallet to get started!
              </p>
            </div>
          ) : (
            <ul className="space-y-2 pb-4">
              {filtered.map((tx) => {
                const iconPath = getServiceIcon(tx.serviceType);
                return (
                  <li key={tx.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-left hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors"
                    >
                      <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">
                        {iconPath ? (
                          <img src={iconPath} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-[var(--text-secondary)]">
                            {(tx.serviceType || 'T').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="text-sm sm:text-[0.9375rem] font-semibold text-[var(--text-primary)] truncate">
                            {tx.title}
                          </span>
                          <span
                            className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${getStatusColor(tx.status)}`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{tx.formattedDate}</p>
                        {tx.transactionReference && (
                          <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                            Ref: {tx.transactionReference}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-sm sm:text-[0.9375rem] font-semibold text-[var(--text-primary)] whitespace-nowrap">
                        {tx.formattedAmount}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
