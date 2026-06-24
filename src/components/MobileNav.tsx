import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  IconHome,
  IconApple,
  IconPlus,
  IconMessageCircle,
  IconMenu2,
  IconSearch,
  IconUsers,
  IconBell,
  IconSettings,
  IconDoorExit,
  IconX,
} from "@tabler/icons-react";
import { communityService, type Community } from "../services/communityService";
import api from "../services/api";

export function MobileNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserId = user?.id ?? user?.sub;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState<any[]>([]);
  const [searchCommunities, setSearchCommunities] = useState<Community[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // fecha drawer ao clicar fora
  useEffect(() => {
    if (!drawerOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }
    const timer = setTimeout(() => document.addEventListener("mousedown", handleClickOutside), 0);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handleClickOutside); };
  }, [drawerOpen]);

  // fecha dropdown de busca ao clicar fora
  useEffect(() => {
    if (!searchFocused) return;
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    const timer = setTimeout(() => document.addEventListener("mousedown", handleClickOutside), 0);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handleClickOutside); };
  }, [searchFocused]);

  // busca com debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchUsers([]);
      setSearchCommunities([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const [usersData, allCommunities] = await Promise.all([
          api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`).then((r) => r.data).catch(() => []),
          communityService.getAll().catch(() => []),
        ]);
        setSearchUsers(Array.isArray(usersData) ? usersData : []);

        function norm(str: string) {
          return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }
        setSearchCommunities(
          allCommunities.filter((c: Community) => norm(c.name).includes(norm(searchQuery)))
        );
      } catch {
        setSearchUsers([]);
        setSearchCommunities([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const showDropdown = searchFocused && searchQuery.trim().length > 0;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function clearSearch() {
    setSearchQuery("");
    setSearchUsers([]);
    setSearchCommunities([]);
    setSearchFocused(false);
  }

  const bottomItems = [
    { icon: IconHome, label: "Home", to: "/" },
    { icon: IconApple, label: "Pomodoro", to: "/pomodoro" },
    { icon: IconPlus, label: "Criar", to: "/criar-post" },
    { icon: IconMessageCircle, label: "Mensagens", to: "/mensagens" },
  ];

  return (
    <>
      {/* BARRA SUPERIOR */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 shadow-sm">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
        >
          <IconMenu2 size={22} className="text-gray-700" />
        </button>

        {/* campo de busca com dropdown */}
        <div ref={searchRef} className="flex-1 relative">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 h-9">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Buscar..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder:text-gray-400"
            />
            {searchQuery ? (
              <button onClick={clearSearch} type="button">
                <IconX size={15} className="text-gray-400" />
              </button>
            ) : (
              <IconSearch size={16} className="text-gray-400" />
            )}
          </div>

          {/* DROPDOWN DE RESULTADOS */}
          {showDropdown && (
            <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">

              {/* USUÁRIOS */}
              {searchUsers.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Usuários
                  </p>
                  {searchUsers.map((u) => (
                    <Link
                      key={u.id}
                      to={`/perfil/${u.id}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=e1903e&color=fff&size=64`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* COMUNIDADES */}
              {searchCommunities.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Comunidades
                  </p>
                  {searchCommunities.map((c) => (
                    <Link
                      key={c.id}
                      to={`/comunidade/${c.id}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={c.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=b7bb86&color=fff&size=64`}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                        <p className="text-xs text-gray-400">
                          {c._count.members.toLocaleString("pt-BR")} membros
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* SEM RESULTADOS */}
              {searchUsers.length === 0 && searchCommunities.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  Nenhum resultado para "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* DRAWER */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-72 z-[70] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link to={'/'} onClick={()=> setDrawerOpen(false)}>
            <img src="/logo_capys.png" alt="Logo" className="w-8 h-8" />
            <span className="font-semibold text-gray-800">Capys</span>
            </Link>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100">
            <IconX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* perfil */}
        {user && (
          <Link
            to={`/perfil/${currentUserId}`}
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Perfil" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                {user.name?.slice(0, 1).toUpperCase() ?? "U"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400">{user.username}</p>
            </div>
          </Link>
        )}

        {/* itens */}
        <nav className="flex-1 flex flex-col py-2">
          <DrawerItem icon={IconUsers}    label="Comunidades"   to="/comunidades"   onClick={() => setDrawerOpen(false)} />
          <DrawerItem icon={IconBell}     label="Notificações"  to="/notificacoes"  onClick={() => setDrawerOpen(false)} />
          <DrawerItem icon={IconSettings} label="Configurações" to="/configuracoes" onClick={() => setDrawerOpen(false)} />
        </nav>

        {/* sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 mx-3 mb-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors"
        >
          <IconDoorExit size={20} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>

      {/* BARRA INFERIOR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        {bottomItems.map(({ icon: Icon, label, to }) => {
          const isActive = location.pathname === to;
          const isCreate = to === "/criar-post";

          return (
            <Link
              key={label}
              to={to}
              className="flex items-center justify-center px-4 py-2 rounded-2xl hover:bg-[#efce7b]/20 transition-colors"
            >
              {isCreate ? (
                <div className="w-10 h-10 rounded-full bg-[#e1903e] flex items-center justify-center shadow-md">
                  <Icon size={22} className="text-white" />
                </div>
              ) : (
                <Icon
                  size={24}
                  stroke={isActive ? 2.5 : 2}
                  className={isActive ? "text-[#e1903e]" : "text-gray-600"}
                />
              )}
            </Link>
          );
        })}

        {/* avatar / perfil */}
        <Link
          to={`/perfil/${currentUserId}`}
          className="flex items-center justify-center px-4 py-2 rounded-2xl hover:bg-[#efce7b]/20 transition-colors"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Perfil"
              className={`w-7 h-7 rounded-full object-cover ${
                location.pathname === `/perfil/${currentUserId}` ? "ring-2 ring-[#e1903e]" : ""
              }`}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
              {user?.name?.slice(0, 1).toUpperCase() ?? "U"}
            </div>
          )}
        </Link>
      </nav>
    </>
  );
}

function DrawerItem({
  icon: Icon,
  label,
  to,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  to?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  const cls = `flex items-center gap-4 px-5 py-3.5 mx-3 rounded-2xl transition-colors ${
    isActive ? "bg-[#efce7b]/30 text-[#e1903e]" : "text-gray-700 hover:bg-gray-50"
  }`;

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        <Icon size={20} stroke={isActive ? 2.5 : 2} />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
