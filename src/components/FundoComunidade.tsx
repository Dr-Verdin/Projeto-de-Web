import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { community } from "../lib/mock"
import {IconPlus} from "@tabler/icons-react"

export default function Fundo() {
    return (
        <div className="w-full max-w-[1072px] mx-auto px-4">
            
            {/* Imagem de Fundo (Banner) */}
            <div className="w-full aspect-[1072/136] overflow-hidden flex justify-center items-center rounded-lg bg-gray-200">
                <img src={community.background} alt={community.name} className="w-full h-full object-cover"/>
            </div>
            
            {/* Container de Informações - Agora fora do absolute */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start sm:gap-1 gap-4">
                
                {/* LADO ESQUERDO: Avatar + Texto */}
                <div className="flex flex-row items-end gap-3">
                    <div className="-mt-8 sm:-mt-10 ml-2">
                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-md">
                            <AvatarImage src={community.image} alt={community.name} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    
                    <div className="pb-1"> 
                        <h1 className="text-xl sm:text-[28px] font-bold text-[#1c1c1c] leading-tight tracking-tight">
                            {community.name}
                        </h1>
                    </div> 
                </div>

                {/* LADO DIREITO: Botões */}
                <div className="flex gap-2 mt-4 sm:mt-6">
                    <button className="px-6 py-1.5 rounded-full text-white bg-[#5C8001] border border-[#5C8001]  hover:bg-[#7CB518] hover:border-[#7CB518] hover:text-white transition-colors">
                        seguir
                    </button>
                    <button className="px-6 py-1.5 rounded-full text-white bg-[#5C8001] border border-[#5C8001]  hover:bg-[#7CB518] hover:border-[#7CB518] hover:text-white transition-colors">
                       <IconPlus size={30}/>
                    </button>
                </div>

            </div>
        </div>
    );
}