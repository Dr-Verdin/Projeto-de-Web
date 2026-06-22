import {
  IconX,
  IconHeart,
  IconMessageCircle,
  IconUsers,
  IconBuildingCommunity,
  IconMail,
  IconBell,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { notifications } from "../lib/mock";
import type { Notification } from "../types/Notification";
import { useNavigate } from "react-router-dom";

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navigate = useNavigate();

    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const userNotifications = notifications.filter((n) => n.userId === userId);
      setAllNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.read).length);
    }
  }, []);

  function markAsRead(id: string) {
    const notification = allNotifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      setAllNotifications([...allNotifications]);
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
  }

  function markAllAsRead() {
    allNotifications.forEach((n) => (n.read = true));
    setAllNotifications([...allNotifications]);
    setUnreadCount(0);
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "like":
        return <IconHeart size={18} />;
      case "comment":
        return <IconMessageCircle size={18} />;
      case "follow":
        return <IconUsers size={18} />;
      case "community":
        return <IconBuildingCommunity size={18} />;
      case "message":
        return <IconMail size={18} />;
      default:
        return <IconBell size={18} />;
    }
  }

  const sortedNotifications = [...allNotifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div
      ref={painelRef}
      className={`fixed top-0 left-16 h-screen w-80 bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col transition-all duration-300 ${
        open
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Notificações</span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-[#e1903e] text-white text-xs rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* Ação de marcar tudo como lido */}
      {unreadCount > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <button
            onClick={markAllAsRead}
            className="text-xs text-[#e1903e] hover:underline font-semibold"
          >
            Marcar tudo como lido
          </button>
        </div>
      )}

      {/* Notificações */}
      <div className="flex-1 overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-gray-500 text-sm">
                Nenhuma notificação no momento
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-3 transition-colors cursor-pointer ${
                  !notification.read
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <img
                    src={notification.avatar}
                    alt="notification"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {getTypeIcon(notification.type)}
                          </span>
                          <h3 className="font-semibold text-gray-700 text-sm line-clamp-1">
                            {notification.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <time className="text-xs text-gray-400 mt-1 block">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          ) as any}
                        </time>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}