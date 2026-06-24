import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "../components/searchusersbar";
import ChatUsers from "../components/Chatusers";
import { IconArrowLeft } from "@tabler/icons-react";

export default function Mensagechat() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inboxKey, setInboxKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">

      {/* LISTA DE CONVERSAS */}
      <div className={`
        h-full border-r border-gray-200 bg-white shrink-0 flex flex-col
        w-full md:w-80
        ${selectedUserId ? "hidden md:flex" : "flex"}
      `}>
        <div className="px-4 pt-4 pb-2 shrink-0 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <IconArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Mensagens</h2>
        </div>

        <ChatSidebar
          onSelectUser={setSelectedUserId}
          selectedUserId={selectedUserId}
          inboxKey={inboxKey}
        />
      </div>

      {/* ÁREA DO CHAT */}
      <div className={`
        flex-1 h-full min-w-0
        ${selectedUserId ? "flex flex-col" : "hidden md:flex flex-col"}
      `}>
        {selectedUserId ? (
          <ChatUsers
            userId={selectedUserId}
            onBack={() => setSelectedUserId(null)}
            onMessageSent={() => setInboxKey((k) => k + 1)}
          />
        ) : (
          <div className="flex-1 h-full bg-gray-50 flex flex-col items-center justify-center gap-3">
            <div className="text-4xl">💬</div>
            <p className="text-gray-400 text-sm">Selecione um contato para conversar</p>
          </div>
        )}
      </div>
    </div>
  );
}
