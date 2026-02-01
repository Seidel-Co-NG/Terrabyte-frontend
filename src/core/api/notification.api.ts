/**
 * Notification API. Matches Flutter notification_repository_impl and terrabyte-api NotificationController.
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';
import type { Notification } from '../../Parameters/types/notification';

interface NotificationApiItem {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read?: boolean;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
  formatted_date?: string;
  formatted_read_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

function mapNotification(raw: NotificationApiItem): Notification {
  return {
    id: raw.id,
    title: raw.title ?? '',
    message: raw.message ?? '',
    type: raw.type ?? 'info',
    priority: raw.priority ?? 'medium',
    isRead: raw.is_read ?? false,
    isActive: raw.is_active ?? true,
    metadata: raw.metadata,
    formattedDate: raw.formatted_date ?? '',
    formattedReadDate: raw.formatted_read_date ?? null,
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more: boolean;
  };
}

export interface NotificationListParams {
  type?: string;
  priority?: string;
  is_read?: boolean;
  limit?: number;
  page?: number;
}

export const notificationApi = {
  async getNotifications(params?: NotificationListParams): Promise<{
    status?: string;
    message?: string;
    data?: NotificationsResponse;
  }> {
    const search = new URLSearchParams();
    if (params?.type) search.set('type', params.type);
    if (params?.priority) search.set('priority', params.priority);
    if (params?.is_read !== undefined) search.set('is_read', String(params.is_read));
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.page != null) search.set('page', String(params.page));
    const query = search.toString();
    const path = query ? `${endpoints.notifications}?${query}` : endpoints.notifications;
    const res = await client.get<{
      status?: string;
      message?: string;
      data?: {
        notifications?: NotificationApiItem[];
        pagination?: NotificationsResponse['pagination'];
      };
    }>(path);
    const data = res?.data;
    const list = data?.notifications ?? [];
    const pagination = data?.pagination ?? {
      current_page: 1,
      per_page: 20,
      total: 0,
      last_page: 1,
      has_more: false,
    };
    return {
      status: res?.status,
      message: res?.message,
      data: {
        notifications: list.map(mapNotification),
        pagination,
      },
    };
  },

  async getNotification(id: number): Promise<{
    status?: string;
    message?: string;
    data?: Notification;
  }> {
    const res = await client.get<{
      status?: string;
      message?: string;
      data?: NotificationApiItem;
    }>(endpoints.notificationDetail(id));
    const data = res?.data;
    return {
      status: res?.status,
      message: res?.message,
      data: data ? mapNotification(data) : undefined,
    };
  },

  async markAsRead(id: number): Promise<{ status?: string; message?: string }> {
    return client.put<{ status?: string; message?: string }>(
      endpoints.markNotificationRead(id),
      {}
    );
  },

  async markAllAsRead(): Promise<{
    status?: string;
    message?: string;
    data?: { updated_count?: number };
  }> {
    return client.put(endpoints.markAllNotificationsRead, {});
  },

  async getUnreadCount(): Promise<{
    status?: string;
    message?: string;
    data?: { unread_count?: number };
  }> {
    return client.get(endpoints.unreadNotificationCount);
  },
};
