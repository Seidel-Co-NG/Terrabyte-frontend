/**
 * Notification model matching Flutter NotificationModel.
 */
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  formattedDate: string;
  formattedReadDate?: string | null;
}
