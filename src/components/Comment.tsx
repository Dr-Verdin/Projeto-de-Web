import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import {
  IconHeart,
  IconCornerDownRight,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { commentService } from "../services/commentService";
import { communityCommentService } from "../services/communityCommentService";

type CommentProps = {
  id: string;
  content: string;
  createdAt: string;
  postId?: string;
  rootId?: string;
  likes?: number;
  comments?: number;
  commentLikes?: { userId: string }[];
  isCommunityComment?: boolean;
  author?: {
    id: string;
    name?: string;
    username?: string;
    avatar?: string | null;
  };
  replies?: CommentProps[];
  onDeleted?: (id: string) => void;
  onReplyCreated?: (reply: CommentProps, parentId: string) => void;
};

export function CommentItem({
  id,
  author,
  content,
  createdAt,
  postId,
  rootId,
  likes: initialLikes = 0,
  commentLikes,
  replies = [],
  isCommunityComment = false,
  onDeleted,
  onReplyCreated,
}: CommentProps) {
  const { user } = useAuth();

  const [likes, setLikes]   = useState(initialLikes);
  const [liked, setLiked]   = useState(
    commentLikes?.some((l) => l.userId === (user?.sub ?? user?.id)) ?? false,
  );
  const [menuOpen, setMenuOpen]   = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending]     = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = author?.username ?? author?.name ?? "user";
  const avatar      = author?.avatar ?? "";
  const isOwn       = author?.id === (user?.sub ?? user?.id);

  // fecha menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  async function handleLike() {
    const userId = user?.sub ?? user?.id;
    if (!userId) return;
    const was = liked;
    setLiked(!was);
    setLikes((n) => (was ? n - 1 : n + 1));
    try {
      if (isCommunityComment) {
        const res = await communityCommentService.toggleLike(id, userId);
        setLiked(res.liked);
        // comunityCommentService só retorna { liked }, ajusta contador se diferir do otimista
        if (res.liked !== !was) {
          setLikes((n) => res.liked ? n + 1 : n - 1);
        }
      } else {
        const res = await commentService.toggleLike(id, userId);
        setLiked(res.liked);
        setLikes(res.likes);
      }
    } catch {
      setLiked(was);
      setLikes((n) => (was ? n + 1 : n - 1));
    }
  }

  async function handleDelete() {
    setMenuOpen(false);
    try {
      if (isCommunityComment) {
        await communityCommentService.remove(id);
      } else {
        await commentService.remove(id);
      }
      onDeleted?.(id);
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
    }
  }

  async function handleSendReply() {
    const authorId = user?.sub ?? user?.id;
    if (!replyText.trim() || !authorId || !postId) return;
    setSending(true);
    try {
      const created = isCommunityComment
        ? await communityCommentService.create({ content: replyText, authorId, postId, parentId: id })
        : await commentService.create({ content: replyText, authorId, postId, parentId: id });
      setReplyText("");
      setReplyOpen(false);
      onReplyCreated?.(created, rootId ?? id);
    } catch (err) {
      console.error("Erro ao responder:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex gap-3 px-2 py-2">
      {/* AVATAR */}
      <Link to={`/perfil/${author?.id}`} onClick={(e) => e.stopPropagation()}>
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link
              to={`/perfil/${author?.id}`}
              className="text-sm font-semibold text-slate-800 hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              u/{displayName}
            </Link>
            <span className="text-xs text-zinc-400 shrink-0">
              · {new Date(createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          {/* menu 3 pontos */}
          <div ref={menuRef} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400
                         hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
            >
              <IconDots size={15} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-50 min-w-[150px] rounded-xl
                              border border-gray-100 bg-white shadow-lg py-1 overflow-hidden">
                {isOwn && (
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm
                               text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <IconTrash size={14} />
                    Deletar
                  </button>
                )}
                {!isOwn && (
                  <p className="px-4 py-2.5 text-xs text-zinc-400">Sem ações disponíveis</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TEXTO */}
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{content}</p>

        {/* FOOTER — like + responder */}
        <div className="flex items-center gap-4 pt-0.5">
          <button
            onClick={handleLike}
            className="group flex items-center gap-1 transition-colors"
          >
            <IconHeart
              size={16}
              className={liked ? "text-red-500 fill-red-500" : "text-zinc-500 group-hover:text-red-500"}
            />
            <span className={`text-xs ${liked ? "text-red-500" : "text-zinc-500 group-hover:text-red-500"}`}>
              {likes}
            </span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setReplyOpen((v) => !v); }}
            className="flex items-center gap-1 text-zinc-400 hover:text-[#e1903e] transition-colors text-xs font-medium"
          >
            <IconCornerDownRight size={14} />
            Responder
          </button>
        </div>

        {/* CAIXA DE RESPOSTA */}
        {replyOpen && (
          <div
            className="flex items-center gap-2 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }}
              placeholder={`Respondendo u/${displayName}...`}
              className="flex-1 h-9 px-4 rounded-full border border-zinc-200 bg-zinc-50
                         text-sm focus:outline-none focus:ring-1 focus:border-[#efce7b]
                         focus:ring-[#efce7b]/50 transition-all"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim() || sending}
              className="px-4 h-9 rounded-full bg-[#b7bb86] hover:bg-[#e1903e] text-white
                         text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {sending ? "..." : "Enviar"}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setReplyOpen(false); setReplyText(""); }}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* RESPOSTAS */}
        {replies.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 border-l-2 border-zinc-100 pl-3">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                {...reply}
                postId={postId}
                rootId={rootId ?? id}
                isCommunityComment={isCommunityComment}
                onDeleted={onDeleted}
                onReplyCreated={onReplyCreated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
