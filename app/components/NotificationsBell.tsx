"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications
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

  // Mark all as read
  async function markAllRead() {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  // Mark single notification as read
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

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Bell Icon */}
      <button className="relative p-2 rounded-full hover:bg-white/10 transition">
        <Bell className="w-6 h-6 text-white" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-xl p-4 z-50 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">Notifications</h3>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <p className="text-white/50 text-sm">Loading...</p>
            )}

            {/* Empty */}
            {!loading && notifications.length === 0 && (
              <p className="text-white/50 text-sm">No notifications</p>
            )}

            {/* List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {notifications.slice(0, 5).map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    n.read
                      ? "bg-white/5"
                      : "bg-blue-500/10 border border-blue-500/20"
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-white font-medium text-sm">
                      {n.title}
                    </p>

                    {/* Category Badge */}
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/60">
                      {n.type}
                    </span>
                  </div>

                  <p className="text-white/60 text-xs mt-1">
                    {n.message}
                  </p>

                  <p className="text-white/40 text-[10px] mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* View All */}
            <a
              href="/dashboard/notifications"
              className="block text-center text-blue-400 hover:text-blue-300 text-sm mt-3"
            >
              View all notifications
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
