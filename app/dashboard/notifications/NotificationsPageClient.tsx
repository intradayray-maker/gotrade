"use client";

import GTCard from "@/components/ui/GTCard";
import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/utils/supabase/client";

export default function NotificationsPageClient() {
  const supabase = supabaseBrowserClient;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const audio =
    typeof window !== "undefined"
      ? new Audio("/sounds/notification.mp3")
      : null;

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications/list");
      const json = await res.json();
      setNotifications(json.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  async function markRead(id: string) {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  }

  async function clearAll() {
    try {
      await fetch("/api/notifications/clear-all", { method: "POST" });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload: any) => {
          setNotifications((prev) => {
            const exists = prev.some((n) => n.id === payload.new.id);
            if (!exists) {
              audio?.play();
              return [payload.new, ...prev];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <div className="flex items-center gap-4">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Mark all as read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {loading && (
        <p className="text-white/50 text-sm">Loading notifications...</p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-white/50 text-sm">No notifications yet</p>
      )}

      {/* ⭐ Dark Modern Scroll Container */}
      <div
        className="
          max-h-[70vh]
          overflow-y-auto
          pr-2
          space-y-3
          scroll-smooth
          dark-scroll
        "
      >
        {notifications.map((n) => (
          <GTCard
            key={n.id}
            className={`transition cursor-pointer ${
              n.read ? "opacity-80" : "border-emerald-500/70"
            }`}
            onClick={() => markRead(n.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{n.title}</h3>

              <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/60">
                {n.type}
              </span>

              {!n.read && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>

            <p className="text-white/60 text-sm mt-1">{n.message}</p>

            <p className="text-white/40 text-xs mt-2">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </GTCard>
        ))}
      </div>
    </div>
  );
}
