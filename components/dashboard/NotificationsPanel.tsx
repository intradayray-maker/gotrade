"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/dashboard/notifications", {
        cache: "no-store",
      });
      const data = (await response.json()) as { notifications?: Notification[] };
      setNotifications(data.notifications ?? []);
    }

    void load();
  }, []);

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <span>{notification.title}</span>
          <span>{notification.message}</span>
          <span>{String(notification.read)}</span>
        </li>
      ))}
    </ul>
  );
}
