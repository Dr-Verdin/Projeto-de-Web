import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface TextoProps {
  nome: string;
  inscritos: string;
  imagem: string;
}

export default function Botao({ nome, inscritos, imagem }: TextoProps) {
  return (
    <button
      className="flex items-center gap-3 w-full h-[60px] px-4 rounded-md hover:bg-[#aadeff]/20 transition-colors"
    >
      {/* Avatar */}
      <Avatar className="w-10 h-10">
        <AvatarImage src={imagem} alt={nome} className="object-cover" />
        <AvatarFallback>{nome.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Texto */}
      <div className="flex flex-col text-left">
        <span className="text-sm text-slate-900">{nome}</span>
        <span className="text-xs text-slate-400">
          {inscritos} membros
        </span>
      </div>
    </button>
  );
}
