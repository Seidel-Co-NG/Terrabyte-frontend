/**
 * Popup modal for dashboard notifications from notification_for_users (type: dashboard).
 * Displays when there are active dashboard notifications; always shown on dashboard unless empty.
 */
import { useConfigStore, getDashboardNotifications } from '../../../../core/stores/config.store';

export interface DashboardNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardNotificationModal = ({ isOpen, onClose }: DashboardNotificationModalProps) => {
  const notificationForUsers = useConfigStore((s) => s.notificationForUsers);
  const dashboardNotifications = getDashboardNotifications(notificationForUsers);

  if (!isOpen || dashboardNotifications.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-notification-title"
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-hover)] flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h3 id="dashboard-notification-title" className="text-lg font-semibold text-[var(--text-primary)] mb-3">
          Notification
        </h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {dashboardNotifications.map((n, i) => (
            <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {(n.message ?? '').trim()}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default DashboardNotificationModal;
