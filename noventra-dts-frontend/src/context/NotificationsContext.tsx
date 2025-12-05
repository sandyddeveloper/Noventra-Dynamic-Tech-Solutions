import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type?: string;
  read?: boolean;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  addNotification: (n: AppNotification) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined,
);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = (n: AppNotification) => {
    setNotifications((prev) => [n, ...prev]);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Listen to messages from service worker
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== "NEW_PUSH_NOTIFICATION") return;

      const payload = data.payload || {};
      addNotification({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: payload.title || "New notification",
        message: payload.body || payload.message || "You have a new update.",
        createdAt: new Date().toISOString(),
        type: payload.type || "generic",
        read: false,
      });
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
};
