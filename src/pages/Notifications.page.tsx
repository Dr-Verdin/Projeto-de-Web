import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconHeart,
  IconMessageCircle,
  IconUsers,
  IconBell,
} from "@tabler/icons-react";
import {
  notificationService,
  type Notification,
} from "../services/notificationService";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getAll()
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    // otimista
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await notificationService.markAsRead(id);
    } catch {
      // reverte
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
      );
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(unread.map((n) => notificationService.markAsRead(n.id)));
    } catch {
      // silently fail — já está marcado na UI
    }
  }

  function getTypeIcon(type: string) {
    const t = type.toLowerCase();
    if (t === "like")    return <IconHeart size={14} className="text-red-400" />;
    if (t === "comment") return <IconMessageCircle size={14} className="text-blue-400" />;
    if (t === "follow")  return <IconUsers size={14} className="text-green-400" />;
    return <IconBell size={14} className="text-gray-400" />;
  }

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
              {unreadCount > 99 ? "99+" : unreadCount}
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
        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 text-sm">Carregando...</p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-4xl">🔔</p>
            <p className="text-gray-400 text-sm">Nenhuma notificação ainda</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`flex gap-3 px-4 py-4 transition-colors ${
                  !n.read
                    ? "bg-orange-50 hover:bg-orange-100 cursor-pointer"
                    : "bg-white"
                }`}
              >
                {/* ícone do tipo */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  {getTypeIcon(n.type)}
                </div>

                {/* texto */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {!n.read && (
                  <div className="w-2 h-2 bg-[#e1903e] rounded-full shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
