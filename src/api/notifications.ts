import api from "./axios";

export interface Notification {
  id: string | number;
  message: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export const getMyNotifications = () =>
  api.get<Notification[]>("/notifications/my").then((res) => res.data);

export const getUnreadCount = () =>
  api.get<{ count: number }>("/notifications/unread-count").then((res) => res.data.count);

export const markNotificationRead = (id: string | number) =>
  api.patch<Notification>(`/notifications/${id}/read`).then((res) => res.data);

export const markAllNotificationsRead = () =>
  api.patch("/notifications/read-all").then((res) => res.data);