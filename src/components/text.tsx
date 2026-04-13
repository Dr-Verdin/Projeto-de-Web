import { Avatar, AvatarFallback, AvatarImage , AvatarBadge} from "@/components/ui/avatar"
import { Button } from "./ui/button";
import {IconHeart, IconMessageCircle, IconSend, IconBookmark} from "@tabler/icons-react"

interface TextoProps {
    nome?: string;
    time?:string;
    fotoPerfil?: string;
    fotoPost?: string;
    titulo?: string;
    texto?:string;
    
}

function Texto ({ nome = "Usuário Anônimo", time = "agora", fotoPerfil="https://github.com/shadcn.png", fotoPost, titulo, texto }: TextoProps){
    return (
        <div className="gap-[20px]  hover:bg-[#A8D5E2]/30 hover:rounded-lg">
            <header className="w-[700px] h-[42px] flex items-center pl-[16px] pr-[16px] flex-row gap-[5px]">
                <Avatar  className=" relative w-[30px] h-[30px]">
                    <AvatarImage src={fotoPerfil} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
                <button className="flex items-center">
                    <span className="text-slate-800 text-xs font-medium">
                        {nome}
                    </span>
                </button>
                
                <span className="text-black text-xs font-thin"> • {time}</span>
                <div className="ml-auto flex items-center gap-2">
                    <Button className="rounded-full px-2 h-4 text-xs text-white bg-[#5C8001] border border-[#5C8001]  hover:bg-[#7CB518] hover:border-[#7CB518] hover:text-white transition-colors">seguir</Button>
                    <Button className="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-300 text-slate-900">
                        {/* 1. 'leading-[0]' remove o espaço extra de linha.
                            2. '-translate-y-[20%]' sobe os pontos em relação ao próprio tamanho.
                            3. 'text-xl' deixa os pontos mais gordinhos e visíveis.
                        */}
                        <span className="flex items-center justify-center leading-[0] text-xl transform -translate-y-[4px]">
                            ...
                        </span>
                    </Button>
                </div>
                
            </header>
            <main>
                <div className="w-[700px] h-[660px]flex items-start text-start pl-[16px] pr-[16px] flex-col gap-[3px] text-slate-400">
                    <h2 className="text-slate-900 font-bold text-lg">{titulo}</h2>
                    {texto && (
                        <div className="flex flex-col items-start gap-[3px] h-full">
                            <div>{texto}</div>
                            <button className="text-xs hover:text-slate-950 text-slate-700">
                                ver mais
                            </button>
                        </div>
                    )}
                    
                    
                    {fotoPost && (
                        <div className="relative w-[700px] h-[540px] overflow-hidden flex items-center justify-center rounded-lg bg-black">
                            
                            {/* 1. Imagem de Fundo (Desfocada e Escurecida) */}
                            <img 
                                src={fotoPost} 
                                alt="Fundo desfocado" 
                                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40" 
                            />
                            
                            {/* 2. Imagem Principal (Nítida e na Frente) */}
                            <img 
                                src={fotoPost} 
                                alt="Post content" 
                                className="relative z-10 max-w-full max-h-full object-contain drop-shadow-lg" 
                            />
                            
                        </div>
                    )}
                </div>
                <div className="w-[700px] h-[40px] flex items-center justify-between py-[20px] pl-[16px] pr-[16px]">

                    <div className="flex items-center gap-[20px]">
                        <button className="hover:text-[#FFC300] transition-colors text-black">
                            <IconHeart size={30} />
                        </button>
                        <button className="text-black">
                            <IconMessageCircle size={30}/>
                        </button>
                        <button className="text-black">
                            <IconSend size={30}/>
                        </button>
                    </div>
                    <button className="text-black">
                        <IconBookmark size={30}/>
                    </button>
                    
                </div>
            </main>
        </div>
    )
}

export default Texto