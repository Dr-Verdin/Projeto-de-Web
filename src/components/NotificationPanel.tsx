import {
  IconX,
  IconHeart,
  IconMessageCircle,
  IconUsers,
  IconBell,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import {
  notificationService,
  type Notification,
} from "../services/notificationService";

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    const timer = setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, onClose]);

  // carrega ao abrir
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    notificationService
      .getAll()
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await notificationService.markAsRead(id);
    } catch {
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
      // silently fail
    }
  }

  function getTypeIcon(type: string) {
    const t = type.toLowerCase();
    if (t === "like")    return <IconHeart size={16} className="text-red-400" />;
    if (t === "comment") return <IconMessageCircle size={16} className="text-blue-400" />;
    if (t === "follow")  return <IconUsers size={16} className="text-green-400" />;
    return <IconBell size={16} className="text-gray-400" />;
  }

  return (
    <div
      ref={painelRef}
      className={`fixed top-0 left-16 h-screen w-80 bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col transition-all duration-300 ${
        open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Notificações</span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-[#e1903e] text-white text-xs rounded-full font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
          <IconX size={18} />
        </button>
      </div>

      {/* marcar tudo */}
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

      {/* lista */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Carregando...</p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-gray-500 text-sm">Nenhuma notificação ainda</p>
            </div>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`flex gap-3 p-3 transition-colors ${
                  !n.read
                    ? "bg-orange-50 hover:bg-orange-100 cursor-pointer"
                    : "bg-white"
                }`}
              >
                {/* ícone */}
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  {getTypeIcon(n.type)}
                </div>

                {/* conteúdo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug line-clamp-3">
                    {n.message}
                  </p>
                  <time className="text-xs text-gray-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
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
