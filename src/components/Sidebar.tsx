import { Link, useLocation } from "react-router-dom";

import {
  IconHome,
  IconSearch,
  IconPlus,
  IconHeart,
  IconMessageCircle,
  IconApple,
  IconDoorExit,
} from "@tabler/icons-react";

import { users } from "../lib/mock";

type SidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ open, setOpen, searchOpen, setSearchOpen }: SidebarProps) {
  const location = useLocation();
  const currentUserId = localStorage.getItem("userId")!;
  const isProfileActive = location.pathname === `/perfil/${currentUserId}`;

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`fixed top-0 left-0 h-screen transition-all duration-300 border-r border-gray-200 bg-white overflow-hidden text-black flex flex-col z-50 shadow-lg
      ${open && !searchOpen ? "w-64" : "w-16"}`}
    >
      <Link
        to="/"
        className="absolute top-2 left-0 inline-flex ml-1 items-center transition-all duration-200 cursor-pointer active:scale-95"
      >
        <div className="p-2 rounded-full hover:bg-[#efce7b]/20 transition-all duration-200">
          <img src={"/logo_capys.png"} alt="Logo" className="w-10 h-10" />
        </div>
      </Link>

      <nav className="flex-1 flex flex-col justify-center">
        <SidebarItem
          icon={IconHome}
          label="Página Inicial"
          to="/"
          open={open}
          searchOpen={searchOpen}
        />
        <SidebarButton
          icon={IconSearch}
          label="Buscar"
          open={open}
          active={searchOpen}
          onClick={() => setSearchOpen(!searchOpen)}
        />
        <SidebarItem icon={IconPlus} label="Criar" to="/criar" open={open} searchOpen={searchOpen} />
        <SidebarItem
          icon={IconHeart}
          label="Notificações"
          to="/notificacoes"
          open={open}
          searchOpen={searchOpen}
        />
        <SidebarItem
          icon={IconMessageCircle}
          label="Mensagens"
          to="/mensagens"
          open={open}
          searchOpen={searchOpen}
        />
        <SidebarItem
          icon={IconApple}
          label="Pomodoro"
          to="/pomodoro"
          open={open}
          searchOpen={searchOpen}
        />

        <Link
          to={`/perfil/${currentUserId}`}
          className="flex items-center px-1 py-3 mx-2 rounded-2xl hover:bg-[#efce7b]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 relative"
        >
          <img
            src={users[currentUserId].avatar}
            alt="Perfil"
            className={`w-9 h-9 rounded-full object-cover shrink-0 ${
              isProfileActive ? "ring-2 ring-[#e1903e]" : ""
            }`}
          />

          {open && !searchOpen &&(
            <span
              className={`ml-3 transition-all duration-200 whitespace-nowrap ${
                isProfileActive ? "text-[#e1903e] font-bold" : "text-black"
              }`}
            >
              Perfil
            </span>
          )}
        </Link>
      </nav>

      <Link
        to="/login"
        onClick={() => localStorage.removeItem("userId")}
        className={`flex items-center px-3 py-3 mx-2 mb-4 rounded-2xl hover:bg-red-100 transition-all duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <IconDoorExit className="w-6 h-6" color="#e63946" />
        <span className="ml-3 text-red-500 font-medium">Sair</span>
      </Link>
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  to,
  open,
  searchOpen
}: {
  icon: React.ComponentType<any>;
  label: string;
  to: string;
  open: boolean;
  searchOpen: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="flex items-center px-3 py-3 mx-2 rounded-2xl hover:bg-[#efce7b]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95"
    >
      <Icon
        className="w-6 h-6 shrink-0 transition-all"
        stroke={isActive ? 2.8 : 2}
        color={isActive ? "#e1903e" : "black"}
      />

      {open && !searchOpen && (
        <span
          className={`ml-3 whitespace-nowrap transition-all duration-200 ${
            isActive ? "text-[#e1903e] font-bold" : "text-black"
          }`}
        >
          {label}
        </span>
      )}
    </Link>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  open,
  active,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-3 mx-2 rounded-2xl hover:bg-[#efce7b]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95"
    >
      <Icon
        className="w-6 h-6 shrink-0 transition-all"
        stroke={active ? 2.8 : 2}
        color={active ? "#e1903e" : "black"}
      />
      {open && !active && (
        <span className={`ml-3 whitespace-nowrap transition-all duration-200 ${active ? "text-[#e1903e] font-bold" : "text-black"}`}>
          {label}
        </span>
      )}
    </button>
  );
}