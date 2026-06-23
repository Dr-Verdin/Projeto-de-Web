import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  IconHeart,
  IconMessageCircle,
  IconSend,
  IconDots,
} from "@tabler/icons-react";
import { PostModal } from "./PostModal";
import type { Post as PostType } from "../types/Post";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function Post({ post }: { post: PostType }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);

  const { title, content, image, createdAt, author } = post;

  const displayName = author?.name ?? author?.username ?? "unknown";
  const avatar = author?.avatar ?? "";

  useEffect(() => {
    async function fetchLikeState() {
      if (!user?.sub) return;

      const res = await api.get(`/posts/${post.id}`, {
        params: {
          userId: user.sub,
        },
      });

      setLiked(res.data.likedByMe);
      setLikes(res.data.likes);
    }

    fetchLikeState();
  }, [post.id, user?.id]);

  async function handleLike(e: any) {
    e.stopPropagation();

    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await api.patch(`/posts/${post.id}/like`, {
        userId: user?.sub,
      });

      setLiked(res.data.liked);
    } catch (err) {
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer w-full flex flex-col gap-3 p-2 rounded-lg transition-colors duration-300 hover:bg-[#efce7b]/30"
      >
        {/* CABEÇALHO */}
        <header className="w-full h-12 flex items-center gap-2 px-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>

          <Link
            to={
              post.communityId
                ? `/comunidade/${post.communityId}`
                : `/perfil/${post.authorId}`
            }
            onClick={(e) => e.stopPropagation()}
            className="text-slate-800 text-xs font-medium hover:underline"
          >
            {post.communityId ? "c/" : "u/"}
            {displayName}
          </Link>

          <span className="text-gray-500 text-xs">• {createdAt}</span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={(e) => e.stopPropagation()}
              className="rounded-full px-4 h-8 text-xs text-white bg-[#b7bb86] hover:bg-[#e1903e]"
            >
              seguir
            </Button>

            <Button
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-300 text-slate-900"
            >
              <IconDots size={18} />
            </Button>
          </div>
        </header>

        {/* CONTEUDO */}
        <div className="w-full flex flex-col gap-2 px-4">
          {title && (
            <h2 className="text-slate-900 font-bold text-lg">{title}</h2>
          )}

          {content && (
            <div className="flex flex-col gap-1 text-slate-700 text-sm">
              <p>{content}</p>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-xs hover:text-slate-950 text-slate-600 w-fit"
              >
                ver mais
              </button>
            </div>
          )}

          {image && (
            <div className="relative w-full h-[60vh] overflow-hidden rounded-lg bg-black">
              <img
                src={image}
                alt="blur background"
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40"
              />

              <img
                src={image}
                alt="post"
                className="relative z-10 w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="w-full flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-5">
            <button
              onClick={handleLike}
              className="group flex items-center gap-1 transition-colors"
            >
              <IconHeart
                size={30}
                className={
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-black group-hover:text-[#e63946]"
                }
              />
              <span
                className={
                  liked
                    ? "text-red-500"
                    : "text-black group-hover:text-[#e63946]"
                }
              >
                {likes}
              </span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex gap-1 items-center text-black hover:text-[#e1903e] transition-colors"
            >
              <IconMessageCircle size={30} />
              <span className="text-sm">{post._count?.comments ?? 0}</span>
            </button>

            <button onClick={(e) => e.stopPropagation()} className="text-black">
              <IconSend size={30} />
            </button>
          </div>
        </footer>
      </div>

      <PostModal open={open} onOpenChange={setOpen} post={post} />
    </>
  );
}
