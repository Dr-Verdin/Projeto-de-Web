import { Link, useLocation } from "react-router-dom";

import {
  IconHome,
  IconSearch,
  IconPlus,
  IconHeart,
  IconCompass,
  IconMessageCircle,
  IconApple
} from "@tabler/icons-react"

import { users } from "../lib/mock"

type SidebarProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation()
  const isProfileActive = location.pathname === "/perfil"
  const isHomeActive = location.pathname === "/"
  const currentUserId = "1" // Simulando usuário logado

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`fixed top-0 left-0 h-screen transition-all duration-300 border-r border-gray-200 bg-white overflow-hidden text-black flex flex-col z-50
      ${open ? "w-64" : "w-16"}`}
    >

      <Link 
        to="/" 
        className="absolute top-2 left-0 inline-flex ml-1 items-center transition-all duration-200 cursor-pointer active:scale-95"
      >
        <div className="p-2 rounded-full hover:bg-[#FFC300]/20 transition-all duration-200">
          <img 
            src={isHomeActive ? "/logo_capys_laranja_esc.png" : "/logo_capys_preto.png"} 
            alt="Logo" 
            className="w-10 h-10" 
          />
        </div>
      </Link>

      <nav className="h-full flex flex-col justify-center">
        <SidebarItem icon={IconHome} label="Página Inicial" to="/" open={open} />
        <SidebarItem icon={IconSearch} label="Buscar" to="/buscar" open={open} />
        <SidebarItem icon={IconCompass} label="Explorar" to="/explorar" open={open} />
        <SidebarItem icon={IconPlus} label="Criar" to="/criar" open={open} />
        <SidebarItem icon={IconHeart} label="Notificações" to="/notificacoes" open={open} />
        <SidebarItem icon={IconMessageCircle} label="Mensagens" to="/mensagens" open={open} />
        <SidebarItem icon={IconApple} label="Pomodoro" to="/pomodoro" open={open} />

        <Link
          to={`/perfil/${currentUserId}`}
          className="flex items-center px-1 py-3 mx-2 rounded-2xl hover:bg-[#FFC300]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 relative"
        >
          <img
            src={users[currentUserId].avatar}
            alt="Perfil"
            className={`w-9 h-9 rounded-full object-cover shrink-0 ${
              isProfileActive ? "ring-2 ring-[#FB6107]" : ""
            }`}
          />

          {open && (
            <span
              className={`ml-3 transition-all duration-200 whitespace-nowrap ${
                isProfileActive ? "text-[#FB6107] font-bold" : "text-black"
              }`}
            >
              Perfil
            </span>
          )}
        </Link>

      </nav>
    </aside>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  to,
  open
}: {
  icon: React.ComponentType<any>
  label: string
  to: string
  open: boolean
}) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className="flex items-center px-3 py-3 mx-2 rounded-2xl hover:bg-[#FFC300]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95"
    >
      <Icon
        className="w-6 h-6 shrink-0 transition-all"
        stroke={isActive ? 2.8 : 2}
        color={isActive ? "#FB6107" : "black"}
      />

      {open && (
        <span
          className={`ml-3 whitespace-nowrap transition-all duration-200 ${
            isActive ? "text-[#FB6107] font-bold" : "text-black"
          }`}
        >
          {label}
        </span>
      )}
    </Link>
  )
}
