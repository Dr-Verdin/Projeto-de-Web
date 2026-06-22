import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "./ui/avatar";
import { Input } from "./ui/input";
import { IconDots } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import type { Post as PostType } from "../types/Post";

import { IconHeart, IconSend } from "@tabler/icons-react";
import { CommentItem } from "./Comment";

// ⚠️ MOCKS (ainda usados só para comentários)
// futuramente isso deve vir do backend
import { comments } from "../lib/mock";

type PostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostType;
};

export function PostModal({ open, onOpenChange, post }: PostModalProps) {
  const isCommunityPost = !!post.communityId;

  // 🔹 autor vindo do backend (pode ser undefined se não vier include)
  const author = post.author ?? null;

  const displayName =
    author?.name ?? author?.username ?? "user";

  const avatar = author?.avatar ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="p-0 overflow-hidden border-0 bg-zinc-100 rounded-2xl w-[95vw] !max-w-5xl h-[80vh] [&>button]:hidden [&_[data-radix-dialog-close]]:hidden"
      >

        <div className="flex h-full min-h-0 flex-col md:flex-row">

          {/* IMAGEM */}
          {post.image && (
            <div className="relative w-full md:w-[50%] h-[40vh] md:h-full shrink-0 overflow-hidden bg-black flex items-center justify-center">
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-30"
              />

              <img
                src={post.image}
                alt="post"
                className="relative z-10 max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {/* LADO DIREITO */}
          <div className="flex-1 bg-white flex flex-col h-full min-h-0 overflow-hidden">

            {/* HEADER */}
            <header className="w-full border-b border-zinc-200 px-5 pt-4 pb-4 flex items-center gap-2">

              <Link
                to={
                  isCommunityPost
                    ? `/comunidade/${post.communityId}`
                    : `/perfil/${post.authorId}`
                }
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
              </Link>

              <div className="flex flex-col leading-tight">

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

                {/* 🟡 COMMUNITY INFO (mock ainda ou futuro backend) */}
                {isCommunityPost && (
                  <Link
                    to={`/perfil/${post.authorId}`}
                    onClick={(e) => e.stopPropagation()}

                    // ⚠️ antes era users[post.userId], isso quebrava
                    // futuramente isso deve vir do backend (community owner)
                    className="text-[11px] text-zinc-500 hover:underline"
                  >
                    {/* por u/{communityOwner} */}
                    por u/{post.authorId}
                  </Link>
                )}
              </div>

              <span className="text-gray-500 text-xs">
                • {post.createdAt}
              </span>

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

            {/* CONTEÚDO */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent hover:scrollbar-thumb-zinc-400">

              {post.title && (
                <h2 className="text-xl font-bold text-zinc-900 mb-4">
                  {post.title}
                </h2>
              )}

              {post.content && (
                <p className="text-sm leading-6 text-zinc-700 whitespace-pre-line pb-10">
                  {post.content}
                </p>
              )}

              {/* 🟡 COMMENTS (mock ainda)
                  futuramente: isso deve vir do backend por post.id */}
              {comments
                .filter((comment) => comment.postId === post.id)
                .map((comment) => (
                  <CommentItem key={comment.id} {...comment} />
                ))}
            </div>

            {/* FOOTER */}
            <footer className="w-full flex items-center justify-between px-5 pt-4 pb-3 border-t border-zinc-200 bg-white shrink-0">

              <div className="flex items-center gap-5">

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-zinc-800 hover:text-red-500 transition-colors"
                >
                  <IconHeart size={28} />
                  {/* likes ainda não é garantido no backend */}
                  <span className="text-sm">{(post as any).likes ?? 0}</span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-800"
                >
                  <IconSend size={28} />
                </button>

              </div>

            </footer>

            {/* INPUT COMENTÁRIO */}
            <div className="px-5 pt-1 pb-4 bg-white shrink-0">

              <div className="flex items-center gap-3">

                <Input
                  placeholder="Adicione um comentário..."
                  className="h-11 rounded-full border-zinc-200 bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-300"
                />

                <Button
                  className="rounded-full px-5 h-11 bg-[#b7bb86] hover:bg-[#e1903e] text-white"
                >
                  Enviar
                </Button>

              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}