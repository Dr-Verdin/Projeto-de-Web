{/*Para procurar alguém pra conversar*/}
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { users } from "../lib/mock";
import CommonUsers from "./commonusers"; 

type ChatSidebarProps = {
    onSelectUser: (userId: string) => void;
    selectedUserId?: string | null;
};

export function ChatSidebar({ onSelectUser, selectedUserId }: ChatSidebarProps) {
    const [query, setQuery] = useState("");

    function normalize(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    const filteredUsers = query.trim() === "" 
        ? [] 
        : Object.entries(users).filter(([, u]) =>
            normalize(u.name).includes(normalize(query)) ||
            normalize(u.username).includes(normalize(query))
        );

    return (
        <div className="w-full h-full bg-white flex flex-col shrink-0">
                        <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar contatos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e1903e]/40 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            {/* Lista de Contatos/Usuários */}
            <div className="flex-1 overflow-y-auto p-2">
                {query.trim() === "" ? (
                    
                    /* SE A BARRA ESTIVER VAZIA: MOSTRA OS FREQUENTES BEM AQUI! */
                    <CommonUsers onSelectUser={onSelectUser} />

                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(([id, user]) => (
                        <button
                            key={id}
                            onClick={() => onSelectUser(id)}
                            className={`flex items-center gap-3 w-full py-3 px-2 rounded-md transition-colors text-left mb-1 ${
                                selectedUserId === id 
                                ? "bg-[#aadeff]/40" 
                                : "hover:bg-[#aadeff]/20 bg-transparent"
                            }`}
                        >
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                            
                            <div className="flex flex-col text-left gap-1.5 flex-1 min-w-0">
                                <span className="text-sm text-slate-900 truncate">{user.name}</span>
                                <span className="text-xs text-slate-400 truncate">@{user.username}</span>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center p-4 text-sm text-gray-500 mt-5">
                        Nenhum contato encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}