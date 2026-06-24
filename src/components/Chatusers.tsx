import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Typing from "./Typing";
import SendBaloon from "./sendbaloon";
import { messageService, type Message } from "../services/messageService";
import { userService } from "../services/userService";
import { addContact } from "../lib/chatContactsCache";

type ApiUser = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
};

type ChatUsersProps = {
  userId: string;
  onBack: () => void;
  onMessageSent?: () => void;
};

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

export default function ChatUsers({ userId, onBack, onMessageSent }: ChatUsersProps) {
  const currentUserId = getCurrentUserId();

  const [otherUser, setOtherUser] = useState<ApiUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  // polling interval ref
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // carrega dados do outro usuário e salva no cache de contatos
  useEffect(() => {
    userService.getById(userId)
      .then((data: ApiUser) => {
        setOtherUser(data);
        // salva no cache para aparecer na sidebar mesmo sem resposta
        if (currentUserId) {
          addContact(currentUserId, {
            id: data.id,
            name: data.name,
            username: (data.username ?? "").replace(/^@/, ""),
            avatar: data.avatar,
          });
        }
      })
      .catch(() => {});
  }, [userId]);

  // carrega conversa e marca como lido
  async function loadConversation() {
    if (!currentUserId) return;
    try {
      const data = await messageService.getConversation(currentUserId, userId);
      setMessages(data);
      // marca mensagens recebidas como lidas
      await messageService.markAsRead(currentUserId, userId).catch(() => {});
    } catch {/* silently fail */}
  }

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    isFirstLoad.current = true;
    loadConversation().finally(() => setLoading(false));

    // polling a cada 3s para simular tempo real (sem WebSocket)
    pollRef.current = setInterval(() => { loadConversation(); }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [userId, currentUserId]);

  const isFirstLoad = useRef(true);

  // scroll para o final quando chegam novas mensagens
  useEffect(() => {
    if (!bottomRef.current) return;
    // na primeira carga usa instant para garantir que chega ao final
    const behavior = isFirstLoad.current ? "instant" : "smooth";
    isFirstLoad.current = false;
    bottomRef.current.scrollIntoView({ behavior });
  }, [messages]);

  async function handleSend(content: string, image?: string) {
    if (!currentUserId) return;
    // optimistic: cria uma mensagem local imediatamente
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      content: content || undefined,
      image: image || undefined,
      senderId: currentUserId,
      receiverId: userId,
      read: false,
      createdAt: new Date().toISOString(),
      sender: { id: currentUserId, name: "", username: "", avatar: undefined },
      receiver: { id: userId, name: "", username: "", avatar: undefined },
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const created = await messageService.send({
        senderId: currentUserId,
        receiverId: userId,
        content: content || undefined,
        image: image || undefined,
      });
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? created : m));
      onMessageSent?.();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  }

  if (!currentUserId) return null;

  const displayName = otherUser?.name ?? "…";
  const displayUsername = otherUser ? `@${otherUser.username.replace(/^@/, "")}` : "";
  const fallback = (otherUser?.name ?? otherUser?.username ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col w-full h-full">

      {/* CABEÇALHO */}
      <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 border-b border-gray-200 bg-white shrink-0 shadow-sm z-10">
        <button
          onClick={onBack}
          className="md:hidden flex items-center justify-center p-2 -ml-2 text-gray-600 hover:text-[#e1903e] hover:bg-gray-100 transition-colors rounded-full"
          aria-label="Voltar"
        >
          <IconArrowLeft size={24} stroke={2} />
        </button>

        <Link to={`/perfil/${userId}`} className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={otherUser?.avatar} alt={displayName} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm md:text-base">{displayName}</span>
            <span className="text-xs md:text-sm text-gray-400">{displayUsername}</span>
          </div>
        </Link>
      </div>

      {/* ÁREA DE MENSAGENS */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className="h-9 rounded-3xl bg-gray-200 animate-pulse w-40" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">
            Este é o início da sua conversa com{" "}
            <span className="font-medium">{displayName}</span>.
          </p>
        ) : (
          <>
            <p className="text-center text-gray-400 text-xs mb-4">
              Início da conversa com {displayName}
            </p>
            {messages.map((msg) => (
              <SendBaloon key={msg.id} message={msg} currentUserId={currentUserId} />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ÁREA DE DIGITAÇÃO */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-200 shrink-0">
        <Typing onSend={handleSend} disabled={!otherUser} />
      </div>
    </div>
  );
}
