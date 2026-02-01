import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../../../core/api/notification.api';
import type { Notification } from '../../../../Parameters/types/notification';

const RecentActivity = () => {
  const [activities, setActivities] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi
      .getNotifications({ limit: 5 })
      .then((res) => {
        const list = res?.data?.notifications ?? [];
        setActivities(list);
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)] m-0">
          Recent Notifications
        </h3>
        <Link
          to="/dashboard/notifications"
          className="bg-transparent border-none text-[var(--accent-primary)] text-[0.85rem] font-medium cursor-pointer transition-colors hover:text-[var(--accent-secondary)] no-underline"
        >
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-5 mt-4 overflow-y-auto">
        {loading ? (
          <div className="py-4 text-center text-sm text-[var(--text-muted)]">
            Loading...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--text-muted)]">
            No recent notifications.
          </div>
        ) : (
          activities.map((activity) => (
            <Link
              key={activity.id}
              to={`/dashboard/notifications/${activity.id}`}
              className="flex gap-4 md:gap-3 p-4 md:p-3 rounded-lg bg-[var(--bg-tertiary)] transition-colors hover:bg-[var(--bg-hover)] no-underline text-left"
            >
              <div className="shrink-0 flex items-start pt-1">
                <div
                  className={`w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full shadow-[0_0_8px_var(--accent-hover)] ${
                    activity.isRead
                      ? 'bg-[var(--text-muted)]'
                      : 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.95rem] md:text-[0.9rem] font-semibold text-[var(--text-primary)] mb-2">
                  {activity.title}
                </div>
                <div className="text-[0.85rem] md:text-[0.8rem] text-[var(--text-secondary)] leading-relaxed mb-2 line-clamp-2">
                  {activity.message}
                </div>
                <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-muted)]">
                  {activity.formattedDate}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
