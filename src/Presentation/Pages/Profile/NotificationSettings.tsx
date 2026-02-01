import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';
import { useAuthStore } from '../../../core/stores/auth.store';
import { userApi } from '../../../core/api/user.api';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const NotificationSettings = () => {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const [pushNotification, setPushNotification] = useState(Boolean(user?.push_notification ?? true));
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setPushNotification(Boolean(user?.push_notification ?? true));
  }, [user?.push_notification]);

  const handleToggle = async () => {
    const next = !pushNotification;
    setIsUpdating(true);
    setPushNotification(next);
    try {
      const res = await userApi.updateUser({ push_notification: next });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        await fetchUser();
        toast.success('Notification settings updated');
      } else {
        setPushNotification(!next);
        toast.error(res?.message ?? 'Failed to update');
      }
    } catch (err) {
      setPushNotification(!next);
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">
          Notification Settings
        </h1>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
          <DetailRow
            label="Push Notifications"
            children={
              <button
                type="button"
                role="switch"
                aria-checked={pushNotification}
                disabled={isUpdating}
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 ${
                  pushNotification ? 'bg-brand-primary' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    pushNotification ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
