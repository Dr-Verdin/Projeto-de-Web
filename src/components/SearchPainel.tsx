
import { IconX } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { users, communities } from "../lib/mock";
import { Link } from "react-router-dom";

type SearchPainelProps = {
    open: boolean;
    onClose: () => void;
};

export function SearchPainel({open, onClose}: SearchPainelProps){
    const [query, setQuery] = useState("");

    const painelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    function normalize(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    const filteredUsers = Object.entries(users).filter(([, u]) =>
    normalize(u.name).startsWith(normalize(query))
    );

    const filteredCommunities = Object.entries(communities).filter(([, c]) =>
    normalize(c.name).startsWith(normalize(query))
    );

    return(
        <div ref={painelRef} className={`fixed top-0 left-16 h-screen w-80 bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col transition-all duration-300 ${
        open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}>

            {/* cabeçalho */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-semibold text-gray-800">Pesquisar</span>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <IconX size={18} />
                </button>
            </div>

            {/* input */}
            <div className="p-4">
                <input
                type="text"
                placeholder="Buscar usuários ou comunidades..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e1903e]/40"
                />
            </div>

            {/* Resultados */ }
            <div className="flex-1 overflow-y-auto px-4 flex-col gap-4" >
                {query && (
                    <>
                        <div className="mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Usuários
                            </h3>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(([id, user]) => (
                                    <Link 
                                        key={id} 
                                        to={`/perfil/${id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={onClose}
                                    >
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.username}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 px-2 py-1">Nenhum usuário encontrado</p>
                            )}
                        </div>

                        <div className="mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Comunidades
                            </h3>
                            {filteredCommunities.length > 0 ? (
                                filteredCommunities.map(([id, community]) => (
                                    <Link 
                                        key={id} 
                                        to={`/comunidade/${id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={onClose}
                                    >
                                        <img src={community.avatar} alt={community.name} className="w-10 h-10 rounded-full object-cover"/>
                                        <div>
                                            <p className="font-medium text-gray-900">{community.name}</p>
                                            <p className="text-xs text-gray-500">{community.members} membros</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 px-2 py-1">Nenhuma comunidade encontrada</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}