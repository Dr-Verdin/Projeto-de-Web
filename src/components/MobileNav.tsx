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

export function MobileNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserId = user?.id ?? user?.sub;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

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

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: navegar para página de busca quando existir
  }

  function handleLogout() {
    logout();
    navigate("/login");
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
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <IconMenu2 size={22} className="text-gray-700" />
        </button>

        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 h-9">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder:text-gray-400"
          />
          <button type="submit">
            <IconSearch size={16} className="text-gray-400" />
          </button>
        </form>
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
            <img src="/logo_capys.png" alt="Logo" className="w-8 h-8" />
            <span className="font-semibold text-gray-800">Capys</span>
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
