import { useState } from "react";
import { ChatSidebar } from "../components/searchusersbar";
import ChatUsers from "../components/Chatusers"; 

export default function Mensagechat() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="flex w-full h-full bg-white text-left pl-[3.5rem] overflow-hidden">
      
      {/* TELA DE BUSCA E CONTATOS */}
      <div className={`
        w-full lg:w-80 h-full border-r border-gray-200 bg-white shrink-0
        ${selectedUserId ? 'hidden lg:flex flex-col' : 'flex flex-col'}
      `}>
        <div className="p-4 pb-0">
            <h2 className="text-xl font-bold text-gray-900">Mensagens</h2>
        </div>
        
        <ChatSidebar onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />
      </div>

      {/* TELA SÓ DO CHAT */}
      <div className={`
        flex-1 h-full 
        ${!selectedUserId ? 'hidden lg:flex flex-col' : 'flex flex-col'}
      `}>
         {selectedUserId ? (
           <ChatUsers userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
         ) : (
           <div className="flex-1 h-full bg-gray-50 flex items-center justify-center">
              <p className="text-gray-400">Selecione ou busque um contato para conversar</p>
           </div>
         )}
      </div>

    </div>
  );
}