import { Link, useLocation } from "react-router-dom";
import { HomeIcon, MagnifyingGlassIcon, PlusIcon, HeartIcon, RocketLaunchIcon, ChatBubbleOvalLeftIcon, } from "@heroicons/react/24/outline"
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, PlusIcon as PlusIconSolid, HeartIcon as HeartIconSolid, RocketLaunchIcon as RocketLaunchIconSolid, ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftIconSolid, } from "@heroicons/react/24/solid"
import logo from "../assets/logo_capys_preto.png";
import { user } from "../mocks/user"

export function Sidebar() {
    const location = useLocation()
    const isProfileActive = location.pathname === "/perfil"

    return (
        <aside className="group h-screen w-16 hover:w-64 transition-all duration-300 border-r bg-white overflow-hidden text-black flex flex-col relative">
        
            <Link to="/" className=" absolute top-2 left-0 inline-flex ml-1 items-center transition-all duration-200 cursor-pointer active:scale-95">
                <div className="p-2 rounded-full hover:bg-[#FFC300]/20 transition-all duration-200">
                    <img src={logo} alt="Logo" className="w-10 h-10" />
                </div>
            </Link>

            <nav className="h-full flex flex-col justify-center">
                <SidebarItem icon={HomeIcon} iconSolid={HomeIconSolid} label="Página Inicial" to="/" />
                <SidebarItem icon={MagnifyingGlassIcon} iconSolid={MagnifyingGlassIconSolid} label="Buscar" to="/buscar" />
                <SidebarItem icon={PlusIcon} iconSolid={PlusIconSolid} label="Criar" to="/criar" />
                <SidebarItem icon={HeartIcon} iconSolid={HeartIconSolid} label="Notificações" to="/notificacoes" />
                <SidebarItem icon={RocketLaunchIcon} iconSolid={RocketLaunchIconSolid} label="Explorar" to="/explorar" />
                <SidebarItem icon={ChatBubbleOvalLeftIcon} iconSolid={ChatBubbleOvalLeftIconSolid} label="Mensagens" to="/mensagens" />
                
                <Link to="/perfil" className="flex items-center px-1 py-3 mx-2 rounded-2xl hover:bg-[#FFC300]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 relative"
                    ><img src={user.avatar} alt="Perfil" className={`w-9 h-9 rounded-full object-cover shrink-0 ${isProfileActive ? "ring-2 ring-black" : ""}`}/>

                    <span className={`absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap ${isProfileActive ? "font-bold" : ""}`}>
                        Perfil
                    </span>
                </Link>
            </nav>
        </aside>    
    )
}

function SidebarItem({ icon, iconSolid, label, to }: { icon: React.ComponentType<any>, iconSolid: React.ComponentType<any>, label: string, to: string }) {
    const location = useLocation()
    const isActive = location.pathname === to
    const Icon = isActive ? iconSolid : icon

    return (
        <Link to={to} className="flex items-center px-3 py-3 mx-2 rounded-2xl hover:bg-[#FFC300]/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 relative">
            
            <Icon className="w-6 h-6 shrink-0 transition-all" />

            <span className={`absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap ${isActive ? "font-bold" : ""}`}>
                {label}
            </span>
        </Link>
    )
}
