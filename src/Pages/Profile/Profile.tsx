import { useState } from 'react';
import {
  User,
  Bell,
  Gift,
  Lock,
  Keyboard,
  Fingerprint,
  Headphones,
  RefreshCw,
  Shield,
  Trash2,
  LogOut,
} from 'lucide-react';
import SettingItem from './Components/SettingItem';
import PremiumBanner from './Components/PremiumBanner';

const pageClass = 'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const Profile = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // TODO: from auth context
  const userName = 'John Doe';
  const userEmail = 'john@example.com';
  const userLevel = 1;
  const biometricEnabled = false;

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // TODO: logout API then navigate to /login
    window.location.href = '/login';
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    // TODO: delete account API
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        {/* Header card */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden mb-6">
          <div className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-[var(--text-muted)]" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-[var(--text-primary)] uppercase truncate">
                {userName}
              </p>
              <p className="text-sm text-[var(--text-secondary)] truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        <PremiumBanner userLevel={userLevel} />

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
              Settings
            </p>
            <div className="space-y-2">
              <SettingItem icon={User} title="Your Profile" to="/dashboard/profile/edit" />
              <SettingItem icon={Bell} title="Notification Settings" to="/dashboard/profile/notification-settings" />
              <SettingItem icon={Gift} title="Referral and Bonus" to="/dashboard/profile/referral-bonus" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
              Security
            </p>
            <div className="space-y-2">
              <SettingItem icon={Lock} title="Change Password" to="/dashboard/profile/change-password" />
              <SettingItem icon={Keyboard} title="Change Pin" to="/dashboard/profile/change-pin" />
              <SettingItem icon={Keyboard} title="Reset Pin" to="/dashboard/profile/reset-pin" />
              <SettingItem
                icon={Fingerprint}
                title="Biometric Authentication"
                subtitle={biometricEnabled ? 'Enabled' : 'Disabled'}
                to="/dashboard/profile/biometric-settings"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
              Others
            </p>
            <div className="space-y-2">
              <SettingItem icon={Headphones} title="Support" to="/dashboard/profile/support" />
              <SettingItem
                icon={RefreshCw}
                title="Check for Updates"
                onClick={() => {}}
                trailing={<span className="text-xs text-[var(--text-muted)]">V 3.0.0</span>}
              />
              <SettingItem icon={Shield} title="Privacy Policy" to="/terms-of-service" />
              <SettingItem
                icon={Trash2}
                title="Account Deletion"
                onClick={() => setShowDeleteConfirm(true)}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--error)] hover:opacity-90"
            >
              <LogOut size={18} strokeWidth={2} />
              Log Out
            </button>
            <span className="text-xs text-[var(--text-muted)]">V 3.0.0</span>
          </div>
        </div>
      </div>

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Logout</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Are you sure you want to logout?</p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-[var(--error)] text-white font-medium hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Account Deletion</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Are you absolutely sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-[var(--error)] text-white font-medium hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
