import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import BackButton from '../../Components/BackButton';
import { MOCK_NOTIFICATIONS } from './mockNotifications';

const STATUS_OPTIONS = ['All', 'Unread', 'Read'];
const PRIORITY_FILTERS = ['All', 'Low', 'Medium', 'High', 'Urgent'];

const Notifications = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filtered = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => {
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Read' && n.isRead) ||
        (statusFilter === 'Unread' && !n.isRead);
      const matchPriority =
        priorityFilter === 'All' ||
        n.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchSearch =
        !search.trim() ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });
  }, [search, statusFilter, priorityFilter]);

  const isEmpty = filtered.length === 0;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Notifications</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative min-w-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                placeholder="Search notifications"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto sm:min-w-[110px] px-3 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium outline-none focus:border-[var(--accent-primary)] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1">
            {PRIORITY_FILTERS.map((p) => {
              const isSelected = priorityFilter === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityFilter(p)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">No notifications</p>
              <p className="text-sm text-[var(--text-tertiary)] max-w-xs">
                You don&apos;t have any notifications yet. Check back later!
              </p>
            </div>
          ) : (
            <ul className="space-y-2 pb-4">
              {filtered.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/notifications/${n.id}`)}
                    className={`w-full flex flex-col sm:flex-row sm:items-center gap-2 p-3 sm:p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-left hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors ${!n.isRead ? 'border-l-4 border-l-[var(--accent-primary)]' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {n.title}
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">{n.formattedDate}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                      {n.priority}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
