{/*Componente chat total*/}

import { users } from "../lib/mock";
import Typing from "./Typing";
import SendBaloon from "./sendbaloon";
import { IconArrowLeft } from "@tabler/icons-react"; // Garanta que essa importação está aqui!

type ChatHeaderProps = {
    userId: string;
    onBack: () => void; 
};

const storedUserId = localStorage.getItem("userId");
const currentUserId = storedUserId ? storedUserId : "u1";

export default function ChatUsers({ userId, onBack }: ChatHeaderProps) {
    const user = users[userId];

    if (!user) return null;

    // Removemos o @ extra caso a mock já tenha ele
    const displayUsername = user.username.startsWith('@') ? user.username : `@${user.username}`;

    return (
        <div className="flex flex-col w-full h-full">
            
            {/* CABEÇALHO */}
            <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-200 bg-white shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 lg:gap-3">
                    <button 
                        onClick={onBack}
                        className="lg:hidden flex items-center justify-center p-2 -ml-2 text-gray-600 hover:text-[#e1903e] hover:bg-gray-100 transition-colors rounded-full"
                        aria-label="Voltar"
                    >
                        <IconArrowLeft size={24} stroke={2} />
                    </button>

                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm lg:text-base">{user.name}</span>
                        <span className="text-xs lg:text-sm text-gray-500">{displayUsername}</span>
                    </div>
                </div>
            </div>

            {/* ÁREA DE MENSAGENS */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <p className="text-center text-gray-400 text-sm mt-3 gap-4 mb-4">
                    Este é o início do seu histórico de mensagens com {user.name}.
                </p>
                
                <SendBaloon text="Oi, tudo bem?" senderId={userId} currentUserId={currentUserId} />
                <SendBaloon text="Tudo ótimo! E com você?" senderId={currentUserId} currentUserId={currentUserId} />
            </div>

            {/* ÁREA DE DIGITAÇÃO */}
            <div className="p-3 lg:p-4 bg-white border-t border-gray-200 shrink-0">
                <Typing/>
            </div>
            
        </div>
    );
}