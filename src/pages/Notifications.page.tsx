import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconHeart, IconMessageCircle, IconUsers, IconBuildingCommunity, IconMail, IconBell } from "@tabler/icons-react";
import { notifications } from "../lib/mock";
import type { Notification } from "../types/Notification";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userId = user?.id ?? user?.sub;
    if (userId) {
      const userNotifs = notifications.filter((n) => n.userId === userId);
      setAllNotifications(userNotifs);
      setUnreadCount(userNotifs.filter((n) => !n.read).length);
    } else {
      // mostra todas para visualização (mock)
      setAllNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.read).length);
    }
  }, [user]);

  function markAsRead(id: string) {
    const n = allNotifications.find((n) => n.id === id);
    if (n) {
      n.read = true;
      setAllNotifications([...allNotifications]);
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  }

  function markAllAsRead() {
    allNotifications.forEach((n) => (n.read = true));
    setAllNotifications([...allNotifications]);
    setUnreadCount(0);
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "like":       return <IconHeart size={18} className="text-red-400" />;
      case "comment":    return <IconMessageCircle size={18} className="text-blue-400" />;
      case "follow":     return <IconUsers size={18} className="text-green-400" />;
      case "community":  return <IconBuildingCommunity size={18} className="text-[#e1903e]" />;
      case "message":    return <IconMail size={18} className="text-purple-400" />;
      default:           return <IconBell size={18} className="text-gray-400" />;
    }
  }

  const sorted = [...allNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">Notificações</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 bg-[#e1903e] text-white text-xs rounded-full font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 ? (
          <button
            onClick={markAllAsRead}
            className="text-xs text-[#e1903e] font-semibold hover:underline"
          >
            Ler tudo
          </button>
        ) : (
          <div className="w-16" />
        )}
      </header>

      {/* CONTEÚDO */}
      <div className="flex-1">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-4xl">🔔</p>
            <p className="text-gray-400 text-sm">Nenhuma notificação ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex gap-3 px-4 py-4 cursor-pointer transition-colors ${
                  !n.read ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* avatar */}
                <div className="relative shrink-0">
                  <img
                    src={n.avatar}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getTypeIcon(n.type)}
                  </span>
                </div>

                {/* texto */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                {!n.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
