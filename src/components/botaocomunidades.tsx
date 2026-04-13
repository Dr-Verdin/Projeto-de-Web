import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface TextoProps {
    nome: string;
    inscritos:string;
}
function BotaoComu({ nome, inscritos}: TextoProps){
    return(
        <div className="flex">
            <button className="flex flex-row gap-[5px] justify-start items-center w-[284px] h-[54px] hover:bg-[#88B19D]/20 pt-[2px] pb-[2px] transition-colors">                   
                <div className="flex pl-16px items-center ml-[16px]">
                    <Avatar className="w-[32px] h-[32px]">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                            className="grayscale"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </div>
                <div className="flex flex-col items-start">
                    <div className="text-sm text-slate-900">{nome}</div>
                    <div className="text-xs text-slate-400">{inscritos} membros</div>
                </div>
            </button>
            
        </div>
    )
}

export default BotaoComu