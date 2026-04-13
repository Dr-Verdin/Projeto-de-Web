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

import logo from "/public/logo_capys_preto.png";
import { user } from "../lib/mock"

export function Sidebar() {
    const location = useLocation()
    const isProfileActive = location.pathname === "/perfil"

    return (

        <aside className="group h-screen w-16 hover:w-64 transition-all duration-300 border-r border-gray-200 bg-white overflow-hidden text-black flex flex-col relative">
        
            <Link to="/" className=" absolute top-2 left-0 inline-flex ml-1 items-center transition-all duration-200 cursor-pointer active:scale-95">
                <div className="p-2 rounded-full hover:bg-[#FFC300]/20 transition-all duration-200">
                    <img src={logo} alt="Logo" className="w-10 h-10" />
                </div>
            </Link>

            <nav className="h-full flex flex-col justify-center">
                <SidebarItem icon={IconHome} label="Página Inicial" to="/" />
                <SidebarItem icon={IconSearch} label="Buscar" to="/buscar" />
                <SidebarItem icon={IconCompass} label="Explorar" to="/explorar" />

                <SidebarItem icon={IconPlus} label="Criar" to="/criar" />

                <SidebarItem icon={IconHeart} label="Notificações" to="/notificacoes" />
                <SidebarItem icon={IconMessageCircle} label="Mensagens" to="/mensagens" />
                
                <SidebarItem icon={IconApple} label="Pomodoro" to="/pomodoro" />
                
                <Link to="/perfil" className="flex items-center px-1 py-3 mx-2 rounded-2xl hover:bg-[#FFC300]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 relative"
                    ><img src={user.avatar} alt="Perfil" className={`w-9 h-9 rounded-full object-cover shrink-0 ${isProfileActive ? "ring-2 ring-[#FB6107]" : ""}`}/>

                    <span className={`absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap ${isProfileActive ? "text-[#FB6107] font-bold" : "text-black"}`}>
                        Perfil
                    </span>
                </Link>

            </nav>

        </aside>  

    )
}

function SidebarItem({ icon: Icon, label, to }: { icon: React.ComponentType<any>, label: string, to: string }) {
    const location = useLocation()
    const isActive = location.pathname === to

    return (

        <Link to={to} className="flex items-center px-3 py-3 mx-2 rounded-2xl hover:bg-[#FFC300]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 relative">
            
            <Icon 
                className="w-6 h-6 shrink-0 transition-all" 
                stroke={isActive ? 2.8 : 2}  
                color={isActive ? "#FB6107" : "black"} 
            />

            <span className={`absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap ${isActive ? "text-[#FB6107] font-bold" : "text-black"}`}>
                {label}
            </span>
            
        </Link>

    )
}
