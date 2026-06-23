import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "./ui/avatar";
import { Input } from "./ui/input";
import { IconDots, IconHeart, IconSend } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

import type { Post as PostType } from "../types/Post";
import type { Comment } from "../types/Comment";
import { CommentItem } from "./Comment";

// comentário forçado para testar o visual — remover quando a API de comentários estiver pronta
const MOCK_COMMENTS: Comment[] = [
  {
    id: "test-1",
    postId: "__any__",
    userId: "test-user",
    content: "Que post incrível! 🔥",
    createdAt: new Date().toISOString(),
    likes: 4,
  },
  {
    id: "test-2",
    postId: "__any__",
    userId: "test-user-2",
    content: "Concordo demais com isso aqui 😄",
    createdAt: new Date().toISOString(),
    likes: 1,
  },
];

type PostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostType;
};

export function PostModal({ open, onOpenChange, post }: PostModalProps) {
  const navigate = useNavigate();
  const isCommunityPost = !!post.communityId;

  const author = post.author ?? null;
  const displayName = author?.name ?? author?.username ?? "user";
  const avatar = author?.avatar ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="p-0 overflow-hidden border-0 bg-zinc-100 rounded-2xl w-[95vw] !max-w-5xl h-[90vh] md:h-[80vh] [&>button]:hidden [&_[data-radix-dialog-close]]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col md:flex-row">

          {/* IMAGEM — no mobile ocupa topo com header sobreposto */}
          {post.image ? (
            <div className="relative w-full md:w-[50%] h-[38vh] md:h-full shrink-0 overflow-hidden bg-black flex items-center justify-center">
              {/* blur de fundo */}
              <img src={post.image} alt=""
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-50" />
              {/* imagem principal */}
              <img src={post.image} alt="post"
                className="relative z-10 max-w-full max-h-full object-contain" />

              {/* HEADER SOBREPOSTO À IMAGEM — visível só no mobile */}
              <div className="md:hidden absolute top-0 left-0 right-0 z-20
                              bg-gradient-to-b from-black/60 to-transparent
                              px-4 pt-3 pb-6 flex items-center gap-2">
                <Link
                  to={isCommunityPost ? `/comunidade/${post.communityId}` : `/perfil/${post.authorId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatar} alt={displayName} />
                    <AvatarFallback>U</AvatarFallback>
                    <AvatarBadge className="bg-green-500" />
                  </Avatar>
                </Link>
                <Link
                  to={isCommunityPost ? `/comunidade/${post.communityId}` : `/perfil/${post.authorId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-white text-xs font-semibold hover:underline truncate flex-1"
                >
                  {isCommunityPost ? "c/" : "u/"}{displayName}
                </Link>
                {!isCommunityPost && (
                  <Button onClick={(e) => e.stopPropagation()}
                    className="rounded-full px-3 h-7 text-xs text-white bg-white/20 hover:bg-white/40 border border-white/40 shrink-0">
                    seguir
                  </Button>
                )}
              </div>
            </div>
          ) : null}

          {/* LADO DIREITO (conteúdo + comentários) */}
          <div className="flex-1 bg-white flex flex-col min-h-0 overflow-hidden">

            {/* HEADER — só no desktop (no mobile fica sobre a imagem) */}
            <header className="hidden md:flex shrink-0 border-b border-zinc-200 px-4 py-3 items-center gap-2">
              <Link
                to={isCommunityPost ? `/comunidade/${post.communityId}` : `/perfil/${post.authorId}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
              </Link>
              <div className="flex flex-col leading-tight min-w-0">
                <Link
                  to={isCommunityPost ? `/comunidade/${post.communityId}` : `/perfil/${post.authorId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-800 text-xs font-medium hover:underline truncate"
                >
                  {isCommunityPost ? "c/" : "u/"}{displayName}
                </Link>
                {isCommunityPost && (
                  <Link to={`/perfil/${post.authorId}`} onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-zinc-500 hover:underline truncate">
                    por u/{post.authorId}
                  </Link>
                )}
              </div>
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <Button onClick={(e) => e.stopPropagation()}
                  className="rounded-full px-3 h-7 text-xs text-white bg-[#b7bb86] hover:bg-[#e1903e]">
                  seguir
                </Button>
                <Button onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-300 text-slate-900">
                  <IconDots size={16} />
                </Button>
              </div>
            </header>

            {/* CONTEÚDO + COMENTÁRIOS */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
              {post.title && (
                <h2 className="text-lg font-bold text-zinc-900 mb-3">{post.title}</h2>
              )}
              {post.content && (
                <p className="text-sm leading-6 text-zinc-700 whitespace-pre-line pb-6">
                  {post.content}
                </p>
              )}
              {MOCK_COMMENTS.map((comment) => (
                <CommentItem key={comment.id} {...comment} />
              ))}
            </div>

            {/* FOOTER */}
            <footer className="shrink-0 flex items-center gap-4 px-4 pt-3 pb-2 border-t border-zinc-200 bg-white">
              <button onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-zinc-800 hover:text-red-500 transition-colors">
                <IconHeart size={24} />
                <span className="text-sm">{(post as any).likes ?? 0}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); navigate("/mensagens"); }}
                className="text-zinc-800 transition-colors">
                <IconSend size={24} />
              </button>
            </footer>

            {/* INPUT COMENTÁRIO */}
            <div className="shrink-0 px-4 pb-3 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Adicione um comentário..."
                  className="h-10 rounded-full border-zinc-200 bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-300"
                />
                <Button className="rounded-full px-4 h-10 bg-[#b7bb86] hover:bg-[#e1903e] text-white shrink-0">
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
