import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import { MOCK_NOTIFICATIONS } from './mockNotifications';
import type { Notification } from '../../types/notification';

function getTypeColor(type: string): string {
  const t = type.toLowerCase();
  if (t === 'success') return 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]';
  if (t === 'error') return 'text-[var(--error)] bg-[var(--error)]/10 border-[var(--error)]';
  if (t === 'warning') return 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]';
  if (t === 'transaction') return 'text-[var(--accent-primary)] bg-[var(--accent-hover)] border-[var(--accent-primary)]';
  if (t === 'promotion') return 'text-purple-600 bg-purple-500/10 border-purple-500';
  if (t === 'system') return 'text-blue-600 bg-blue-500/10 border-blue-500';
  return 'text-[var(--text-muted)] bg-[var(--bg-tertiary)] border-[var(--border-color)]';
}

function getPriorityColor(priority: string): string {
  const p = priority.toLowerCase();
  if (p === 'urgent') return 'text-[var(--error)] bg-[var(--error)]/10 border-[var(--error)]';
  if (p === 'high') return 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]';
  if (p === 'medium') return 'text-blue-600 bg-blue-500/10 border-blue-500';
  if (p === 'low') return 'text-[var(--text-muted)] bg-[var(--bg-tertiary)] border-[var(--border-color)]';
  return 'text-[var(--text-muted)] bg-[var(--bg-tertiary)] border-[var(--border-color)]';
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

function formatMetadata(metadata: Record<string, unknown>): string {
  return Object.entries(metadata)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(', ');
}

const NotificationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notification = MOCK_NOTIFICATIONS.find((n) => n.id === Number(id));

  const handleMarkAsRead = () => {
    // TODO: API mark as read
    navigate('/dashboard/notifications');
  };

  if (!notification) {
    return (
      <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[50vh] px-4">
          <p className="text-[var(--text-secondary)] mb-4">Notification not found.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/notifications')}
            className="py-2 px-4 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium"
          >
            Back to Notifications
          </button>
        </div>
      </div>
    );
  }

  const n = notification;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/notifications" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] text-center px-10 truncate">
            {n.title}
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap justify-center gap-2">
            <span
              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${getTypeColor(n.type)}`}
            >
              {n.type.toUpperCase()}
            </span>
            <span
              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(n.priority)}`}
            >
              {n.priority.toUpperCase()}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">Notification Details</h2>
            <DetailRow label="Message" value={n.message} />
            <DetailRow label="Type" value={n.type} />
            <DetailRow label="Priority" value={n.priority} />
            <DetailRow label="Status" value={n.isRead ? 'Read' : 'Unread'} />
            <DetailRow label="Date" value={n.formattedDate} />
            {n.formattedReadDate && (
              <DetailRow label="Read Date" value={n.formattedReadDate} />
            )}
            {n.metadata && Object.keys(n.metadata).length > 0 && (
              <div className="pt-3 mt-2 border-t border-[var(--border-color)]">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {formatMetadata(n.metadata)}
                </p>
              </div>
            )}
          </div>

          {!n.isRead && (
            <button
              type="button"
              onClick={handleMarkAsRead}
              className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
