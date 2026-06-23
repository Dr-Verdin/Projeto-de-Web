import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";

import { Link } from "react-router-dom";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { commentService } from "../services/commentService";

type CommentProps = {
  id: string;
  content: string;
  createdAt: string;
  likes?: number;
  comments?: number;

  commentLikes?: {
    userId: string;
  }[];

  author?: {
    id: string;
    name?: string;
    username?: string;
    avatar?: string | null;
  };

  replies?: CommentProps[];
};

export function CommentItem({
  id,
  author,
  content,
  createdAt,
  likes: initialLikes = 0,
  comments,
  commentLikes,
}: CommentProps) {
  const { user } = useAuth();

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(
    commentLikes?.some((like) => like.userId === user?.sub) ?? false
  );

  const displayName = author?.name ?? author?.username ?? "user";
  const avatar = author?.avatar ?? "";

  async function handleLike() {
    if (!user?.sub) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const res = await commentService.toggleLike(id, user.sub);
      setLiked(res.liked);
      setLikes(res.likes);
    } catch (err) {
      console.error(err);
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  }

  return (
    <div className="flex gap-3 px-4 py-3">
      {/* AVATAR */}
      <Link to={`/perfil/${author?.id}`} onClick={(e) => e.stopPropagation()}>
        <Avatar className="w-9 h-9">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col gap-2">
        {/* HEADER */}
        <div className="flex items-center gap-2">
          <Link
            to={`/perfil/${author?.id}`}
            className="text-sm font-medium text-slate-800 hover:underline"
          >
            u/{displayName}
          </Link>
          <span className="text-xs text-zinc-500">
            • {new Date(createdAt).toLocaleString()}
          </span>
        </div>

        {/* TEXTO */}
        <p className="text-sm text-slate-700 whitespace-pre-line">{content}</p>

        {/* FOOTER */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={handleLike}
            className="group flex items-center gap-1 transition-colors"
          >
            <IconHeart
              size={18}
              className={
                liked
                  ? "text-red-500 fill-red-500"
                  : "text-zinc-600 group-hover:text-red-500"
              }
            />
            <span
              className={
                liked
                  ? "text-red-500 text-xs"
                  : "text-zinc-600 text-xs group-hover:text-red-500"
              }
            >
              {likes}
            </span>
          </button>

          {comments !== undefined && (
            <button className="flex items-center gap-1 text-zinc-500 hover:text-[#e1903e] transition-colors text-xs">
              <IconMessageCircle size={16} />
              {comments}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
