import { IconX } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { communities } from "../lib/mock";
import { Link } from "react-router-dom";

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const painelRef = useRef<HTMLDivElement>(null);

  // clique fora (corrigido)
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        painelRef.current &&
        !painelRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // busca no backend (sem mock de users)
  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users/search?q=${query}`
        );
        console.log("STATUS:", res.status);
        const data = await res.json();
        console.log("DATA:", data);
        setUsers(data);
      } catch (err) {
        console.error("Erro na busca:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function normalize(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const filteredCommunities = Object.entries(communities).filter(([, c]) =>
    normalize(c.name).startsWith(normalize(query))
  );

  return (
    <div
      ref={painelRef}
      className={`fixed top-0 left-16 h-screen w-80 bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col transition-all duration-300 ${
        open
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
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

      {/* resultados */}
      <div className="flex-1 overflow-y-auto px-4 flex-col gap-4">
        {query && (
          <>
            {/* USERS */}
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Usuários
              </h3>

              {users.length > 0 ? (
                users.map((user) => (
                  <Link
                    key={user.id}
                    to={`/perfil/${user.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <img
                      src={user.avatar || "/default.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.username}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-2 py-1">
                  Nenhum usuário encontrado
                </p>
              )}
            </div>

            {/* COMMUNITIES */}
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
                    <img
                      src={community.avatar}
                      alt={community.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {community.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {community.members} membros
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-2 py-1">
                  Nenhuma comunidade encontrada
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}