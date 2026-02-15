/**
 * Config Zustand store. Caches website configurations including notification_for_users.
 */
import { create } from 'zustand';
import { userApi } from '../api/user.api';

export interface NotificationForUser {
  notification_type: string;
  message: string;
  is_active: string;
}

export interface ConfigState {
  notificationForUsers: NotificationForUser[];
  isLoading: boolean;
  error: string | null;
  /** Fetch configurations (call on dashboard mount). */
  fetchConfigurations: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  notificationForUsers: [] as NotificationForUser[],
  isLoading: false,
  error: null as string | null,
};

function isActive(n: NotificationForUser): boolean {
  const v = (n.is_active ?? '').toString().toLowerCase();
  if (v === '' || v === '1' || v === 'true' || v === 'yes') return true;
  if (v === '0' || v === 'false' || v === 'no') return false;
  return Boolean(v);
}

export function getMarqueeMessages(notifications: NotificationForUser[]): string[] {
  return notifications
    .filter((n) => n.notification_type === 'marque' && isActive(n) && (n.message ?? '').trim())
    .map((n) => (n.message ?? '').trim());
}

export function getDashboardNotifications(notifications: NotificationForUser[]): NotificationForUser[] {
  return notifications.filter(
    (n) => n.notification_type === 'dashboard' && isActive(n) && (n.message ?? '').trim()
  );
}

export const useConfigStore = create<ConfigState>((set) => ({
  ...initialState,

  fetchConfigurations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await userApi.getConfigurations();
      const data = res?.data as Record<string, unknown> | undefined;
      const raw = data?.notification_for_users;
      const list = Array.isArray(raw)
        ? (raw as NotificationForUser[])
        : [];
      set({
        notificationForUsers: list,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load configurations';
      set({ ...initialState, isLoading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));
