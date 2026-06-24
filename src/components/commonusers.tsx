import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import api from "../services/api";
import { getContacts, type CachedContact } from "../lib/chatContactsCache";

function getCurrentUserId(): string | null {
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.id ?? parsed?.sub ?? null;
    }
  } catch {/* ignore */}
  return null;
}

type ConversationEntry = {
  userId: string;
  name: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  lastAt: string;
  unread: boolean;
};

type CommonUsersProps = {
  onSelectUser?: (userId: string) => void;
  selectedUserId?: string | null;
};

export default function CommonUsers({ onSelectUser, selectedUserId }: CommonUsersProps) {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!currentUserId) { setLoading(false); return; }

    async function load() {
      try {
        // 1. Mensagens recebidas (inbox)
        const inbox: any[] = await api
          .get(`/messages/inbox/${currentUserId}`)
          .then((r) => r.data)
          .catch(() => []);

        // 2. Contatos do cache local (quem eu enviei mas pode não ter respondido)
        const cached: CachedContact[] = getContacts(currentUserId);

        // Monta mapa de contatos únicos — inbox + cache
        const contactMap = new Map<string, { name: string; username: string; avatar?: string }>();

        for (const msg of inbox) {
          if (!contactMap.has(msg.senderId)) {
            contactMap.set(msg.senderId, {
              name: msg.sender?.name ?? msg.sender?.username ?? "Usuário",
              username: (msg.sender?.username ?? "").replace(/^@/, ""),
              avatar: msg.sender?.avatar,
            });
          }
        }

        for (const c of cached) {
          if (!contactMap.has(c.id)) {
            contactMap.set(c.id, {
              name: c.name,
              username: (c.username ?? "").replace(/^@/, ""),
              avatar: c.avatar,
            });
          }
        }

        if (contactMap.size === 0) {
          setConversations([]);
          return;
        }

        // 3. Para cada contato, busca a conversa completa e pega a última mensagem
        const entries = await Promise.all(
          [...contactMap.entries()].map(async ([otherId, info]) => {
            try {
              const msgs: any[] = await api
                .get("/messages/conversation", {
                  params: { userId: currentUserId, otherUserId: otherId },
                })
                .then((r) => r.data);

              const last = msgs[msgs.length - 1];
              const unreadCount = msgs.filter(
                (m) => m.receiverId === currentUserId && !m.read
              ).length;

              return {
                userId: otherId,
                name: info.name,
                username: info.username,
                avatar: info.avatar,
                lastMessage: last?.content ?? (last?.image ? "📷 Imagem" : ""),
                lastAt: last?.createdAt ?? "",
                unread: unreadCount > 0,
              } as ConversationEntry;
            } catch {
              return null;
            }
          })
        );

        const valid = (entries.filter(Boolean) as ConversationEntry[]).sort(
          (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
        );

        setConversations(valid);
      } catch {
        setConversations([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-4 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3 px-2 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col mt-4 px-2">
        <p className="text-sm text-gray-400 text-center mt-8">Nenhuma conversa ainda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-2">
      <p className="text-xs text-gray-400 mb-2 px-2 font-semibold uppercase tracking-wide">Recentes</p>
      <div className="flex flex-col gap-0.5">
        {conversations.map((c) => {
          const fallback = (c.name ?? c.username ?? "?").slice(0, 2).toUpperCase();
          const isSelected = selectedUserId === c.userId;
          const preview = c.lastMessage.length > 35
            ? c.lastMessage.slice(0, 35) + "…"
            : c.lastMessage;

          return (
            <button
              key={c.userId}
              onClick={() => onSelectUser?.(c.userId)}
              className={`flex items-center gap-3 w-full py-3 px-2 rounded-xl transition-colors text-left ${
                isSelected ? "bg-[#aadeff]/40" : "hover:bg-[#aadeff]/20"
              }`}
            >
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={c.avatar} alt={c.name} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-medium text-slate-900 truncate">{c.name}</span>
                  {c.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#e1903e] shrink-0" />
                  )}
                </div>
                <span className="text-xs text-slate-400 truncate">{preview}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
