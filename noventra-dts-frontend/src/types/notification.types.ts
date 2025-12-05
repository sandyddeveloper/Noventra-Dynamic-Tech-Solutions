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


// src/types/notification.types.ts

export type NotificationCategory =
    | "system"
    | "project"
    | "attendance"
    | "user"
    | "security";

export type NotificationImportance = "low" | "normal" | "high";

export interface NotificationLink {
    type: "project" | "employee" | "attendance" | "settings";
    id?: string;
}

export interface AppNotification {
    id: string;
    title: string;
    body: string;
    category: NotificationCategory;
    importance: NotificationImportance;
    read: boolean;
    pinned?: boolean;
    createdAt: string; // ISO string
    relatedId?: string; // projectId / employeeId / attendanceId
    link?: NotificationLink;
    // optional extra label (e.g. @mention, geo-fence, etc.)
    tag?: string;
}

export type NotificationChannel = "in-app" | "email" | "sms";

export interface NotificationCategoryPreference {
    category: NotificationCategory;
    inApp: boolean;
    email: boolean;
    sms: boolean;
    muted: boolean;
}

export type DigestFrequency = "realtime" | "hourly" | "daily";

export interface NotificationPreferences {
    globalInApp: boolean;
    globalEmail: boolean;
    globalSms: boolean;
    quietHoursEnabled: boolean;
    quietHoursFrom: string; // "22:00"
    quietHoursTo: string; // "07:00"
    digestFrequency: DigestFrequency;
    categories: NotificationCategoryPreference[];
}


export type NotificationTab = "all" | "unread" | "mentions" | "system" | "project" | "attendance";
