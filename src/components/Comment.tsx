import type { Comment as CommentType } from "../types/Comment";
import { 
  Avatar,
  AvatarImage,
  AvatarFallback
} from "./ui/avatar";

import { Link } from "react-router-dom";

import { users } from "../lib/mock";

import { IconHeart, IconMessageCircle } from "@tabler/icons-react";

export function CommentItem({
    userId,
    text,
    image,
    createdAt,
    likes,
    comments
}: CommentType) {
  const user = users[userId];

  return (
    <div className="flex gap-3 px-4 py-3">
      {/* AVATAR */}
      <Link to={`/perfil/${userId}`} onClick={(e) => e.stopPropagation()}>
        <Avatar className="w-9 h-9">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* CONTEÚDO DO COMENTÁRIO */}
      <div className="flex-1 flex flex-col gap-2">
        {/* HEADER */}
        <div className="flex items-center gap-2">
          <Link
            to={`/perfil/${userId}`}
            className="text-sm font-medium text-slate-800 hover:underline"
          >
            u/{user.name}
          </Link>

          <span className="text-xs text-zinc-500">
            • {createdAt}
          </span>
        </div>

        {/* TEXTO */}
        <p className="text-sm text-slate-700 whitespace-pre-line">
          {text}
        </p>

        {/* IMAGEM */}
        {image && (
          <img
            src={image}
            alt="comentário"
            className="rounded-xl max-h-80 object-cover border"
          />
        )}

        {/* FOOTER */}
        <div className="flex items-center gap-4 pt-1">
          <button className="flex items-center gap-1 text-zinc-600 hover:text-red-500 transition-colors">
            <IconHeart size={18} />
            <span className="text-xs">{likes}</span>
          </button>

          <button className="flex items-center gap-1 text-zinc-600 hover:text-sky-500 transition-colors">
            <IconMessageCircle size={18} />
            <span className="text-xs">{comments ?? 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}