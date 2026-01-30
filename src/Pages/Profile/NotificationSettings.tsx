import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const NotificationSettings = () => {
  const [pushNotification, setPushNotification] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = () => {
    setIsUpdating(true);
    setPushNotification((prev) => !prev);
    // TODO: API update user notification settings
    setTimeout(() => setIsUpdating(false), 400);
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
