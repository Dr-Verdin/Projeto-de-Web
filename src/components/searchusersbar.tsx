import { IconSearch } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { userService } from "../services/userService";
import CommonUsers from "./commonusers";
import api from "../services/api";

type ApiUser = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
};

type ChatSidebarProps = {
  onSelectUser: (userId: string) => void;
  selectedUserId?: string | null;
  inboxKey?: number;
};

function normalize(str: string | undefined | null) {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function ChatSidebar({ onSelectUser, selectedUserId, inboxKey }: ChatSidebarProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiUser[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // usa o endpoint GET /users/search?q= que retorna name + username + avatar
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (!trimmed) { setSearchResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get("/users/search", { params: { q: trimmed } });
        setSearchResults(res.data);
      } catch {
        // fallback: filtra localmente se search endpoint falhar
        try {
          const all: ApiUser[] = await userService.getAll();
          setSearchResults(
            all.filter((u) =>
              normalize(u.name).includes(normalize(trimmed)) ||
              normalize(u.username).includes(normalize(trimmed))
            )
          );
        } catch { setSearchResults([]); }
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const isSearching = query.trim() !== "";

  return (
    <div className="w-full h-full bg-white flex flex-col shrink-0 overflow-hidden">
      {/* BARRA DE BUSCA */}
      <div className="p-4 border-b border-gray-100 shrink-0">
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

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto p-2">
        {!isSearching ? (
          <CommonUsers onSelectUser={onSelectUser} selectedUserId={selectedUserId} key={inboxKey} />
        ) : searching ? (
          <div className="flex flex-col gap-2 mt-2 px-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((u) => {
            const fallback = (u.name ?? u.username ?? "?").slice(0, 2).toUpperCase();
            return (
              <button
                key={u.id}
                onClick={() => { onSelectUser(u.id); setQuery(""); }}
                className={`flex items-center gap-3 w-full py-3 px-2 rounded-xl transition-colors text-left mb-0.5 ${
                  selectedUserId === u.id ? "bg-[#aadeff]/40" : "hover:bg-[#aadeff]/20"
                }`}
              >
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={u.avatar} alt={u.name} />
                  <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-900 truncate">{u.name}</span>
                  <span className="text-xs text-slate-400 truncate">@{(u.username ?? "").replace(/^@/, "")}</span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center p-4 text-sm text-gray-400 mt-5">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
