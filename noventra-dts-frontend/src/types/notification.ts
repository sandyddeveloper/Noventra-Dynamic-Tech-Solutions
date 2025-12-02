// src/types/notification.ts
export type NotificationType = "info" | "warning" | "success";

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string; // e.g. "2m ago"
    type: NotificationType;
    read: boolean;
    link?: string;
}