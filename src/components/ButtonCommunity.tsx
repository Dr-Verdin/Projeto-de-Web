import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { Community } from "../types/Community";

type ButtonCommunityProps = Pick<
  Community,
  "name" | "members" | "avatar"
>;

export default function Botao({ name, members, avatar }: ButtonCommunityProps) {
  return (
    <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-[#aadeff]/20 transition-colors min-w-0">
      {/* Avatar */}
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage src={avatar} alt={name} className="object-cover" />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Texto */}
      <div className="flex flex-col flex-1 min-w-0 text-left gap-1.5">
        <span className="text-sm text-slate-900 truncate font-medium">{name}</span>
        <span className="text-xs text-slate-400 truncate">{members} membros</span>
      </div>
    </button>
  );
}
