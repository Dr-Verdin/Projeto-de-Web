import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { Community } from "../types/Community";

type ButtonCommunityProps = Pick<
  Community,
  "name" | "members" | "avatar"
>;

export default function Botao({ name, members, avatar }: ButtonCommunityProps) {
  return (
    <button className="flex items-center gap-3 w-full py-3 px-2 rounded-md hover:bg-[#aadeff]/20 transition-colors">
      {/* Avatar */}
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar} alt={name} className="object-cover" />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Texto */}
      <div className="flex flex-col text-left gap-1.5">
        <span className="text-sm text-slate-900">{name}</span>
        <span className="text-xs text-slate-400">{members} membros</span>
      </div>
    </button>
  );
}
