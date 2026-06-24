import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "./ui/avatar";
import { Input } from "./ui/input";
import { IconDots, IconHeart, IconSend, IconLink, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import type { Post as PostType } from "../types/Post";
import type { Comment as CommentType } from "../types/Comment";

import { useEffect, useState, useRef } from "react";
import { commentService } from "../services/commentService";
import { CommentItem } from "./Comment";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { postService } from "../services/postService";
import { userService } from "../services/userService";

type PostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostType;
  onCommentAdded?: (total: number) => void;
};

// conta comentários raiz + todas as replies recursivamente
function countAllComments(comments: CommentType[]): number {
  return comments.reduce(
    (acc, c) => acc + 1 + countAllComments((c as any).replies ?? []),
    0,
  );
}

// remove um comentário (ou reply) em qualquer nível da árvore
function removeComment(comments: CommentType[], id: string): CommentType[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => ({
      ...c,
      replies: removeComment((c as any).replies ?? [], id),
    }));
}

export function PostModal({ open, onOpenChange, post, onCommentAdded }: PostModalProps) {
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCommunityPost = !!post.communityId;
  const storedUser = localStorage.getItem("user");
  const currentUserId = storedUser ? (JSON.parse(storedUser)?.id ?? JSON.parse(storedUser)?.sub) : null;
  const isOwnPost = post.authorId === currentUserId;

  // busca status de follow
  useEffect(() => {
    if (isOwnPost || !currentUserId || !post.authorId || isCommunityPost) return;
    userService
      .getFollowStatus(post.authorId, currentUserId)
      .then((res) => setFollowing(res.following))
      .catch(() => {});
  }, [post.authorId, currentUserId, isOwnPost, isCommunityPost]);

  async function handleFollow(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentUserId || loadingFollow) return;
    setLoadingFollow(true);
    const was = following;
    setFollowing(!was);
    try {
      const res = await userService.toggleFollow(post.authorId, currentUserId);
      setFollowing(res.following);
    } catch {
      setFollowing(was);
    } finally {
      setLoadingFollow(false);
    }
  }

  // fecha menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setMenuOpen(false);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await postService.remove(post.id);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao deletar post:", err);
    }
  }

  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const author = post.author ?? null;
  const displayName = author?.name ?? author?.username ?? "user";
  const avatar = author?.avatar ?? "";

  useEffect(() => {
    setLikes(post.likes ?? 0);
  }, [post.id, post.likes]);

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await commentService.getByPost(post.id);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadComments();
  }, [post.id]);

  useEffect(() => {
    async function fetchLikeState() {
      const userId = user?.id ?? user?.sub;
      if (!userId) return;
      try {
        const res = await api.get(`/posts/${post.id}`, {
          params: { userId },
        });
        setLiked(res.data.likedByMe);
        setLikes(res.data.likes);
      } catch (err) {
        console.error(err);
      }
    }
    fetchLikeState();
  }, [post.id, user?.id, user?.sub]);

  async function handleSendComment() {
    const authorId = user?.id ?? user?.sub;
    if (!newComment.trim() || !authorId) return;
    setLoading(true);
    try {
      const created = await commentService.create({
        content: newComment,
        authorId,
        postId: post.id,
      });
      setNewComment("");
      const updated = [created, ...comments];
      setComments(updated);
      // passa o total real de comentários (raiz + replies)
      onCommentAdded?.(countAllComments(updated));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const userId = user?.id ?? user?.sub;
    if (!userId) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const res = await api.patch(`/posts/${post.id}/like`, { userId });
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  }

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
                  <Button
                    onClick={handleFollow}
                    disabled={loadingFollow}
                    className={`rounded-full px-3 h-7 text-xs font-bold transition-all shrink-0 disabled:opacity-50 ${
                      following
                        ? "bg-white/10 text-white border border-white/40 hover:bg-red-500/30"
                        : "text-white bg-white/20 hover:bg-white/40 border border-white/40"
                    }`}
                  >
                    {following ? "Seguindo" : "Seguir"}
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
                <Button
                  onClick={handleFollow}
                  disabled={loadingFollow}
                  className={`rounded-full px-3 h-7 text-xs font-bold transition-all disabled:opacity-50 ${
                    following
                      ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500"
                      : "text-white bg-[#b7bb86] hover:bg-[#e1903e]"
                  }`}
                >
                  {following ? "Seguindo" : "Seguir"}
                </Button>
                <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
                  <Button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="w-7 h-7 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-300 text-slate-900">
                    <IconDots size={16} />
                  </Button>
                  {menuOpen && (
                    <div className="absolute right-0 top-9 z-50 min-w-[160px] rounded-xl border border-gray-100 bg-white shadow-lg py-1 overflow-hidden">
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <IconLink size={15} className="text-gray-400" />
                        Copiar link
                      </button>
                      {isOwnPost && (
                        <button
                          onClick={handleDelete}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <IconTrash size={15} className="text-red-400" />
                          Deletar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* CONTEÚDO + COMENTÁRIOS */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-3">
              {post.title && (
                <h2 className="text-lg font-bold text-zinc-900 mb-3">{post.title}</h2>
              )}
              {post.content && (
                <p className="text-sm leading-6 text-zinc-700 whitespace-pre-line pb-6">
                  {post.content}
                </p>
              )}

              <div className="flex flex-col gap-4 mt-2 overflow-hidden">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="flex flex-col gap-2">
                      <CommentItem
                        {...c}
                        postId={post.id}
                        onDeleted={(deletedId) =>
                          setComments((prev) => removeComment(prev, deletedId))
                        }
                        onReplyCreated={(reply, parentId) =>
                          setComments((prev) =>
                            prev.map((x) =>
                              x.id === parentId
                                ? { ...x, replies: [...(x.replies ?? []), reply] }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">Nenhum comentário ainda</p>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <footer className="shrink-0 flex items-center gap-4 px-4 pt-3 pb-2 border-t border-zinc-200 bg-white">
              <button
                onClick={handleLike}
                className="group flex items-center gap-1 transition-colors"
              >
                <IconHeart
                  size={24}
                  className={
                    liked
                      ? "text-red-500 fill-red-500"
                      : "text-zinc-800 group-hover:text-red-500"
                  }
                />
                <span className={liked ? "text-red-500 text-sm" : "text-zinc-800 text-sm"}>
                  {likes}
                </span>
              </button>
              <button onClick={(e) => e.stopPropagation()} className="text-zinc-800 transition-colors">
                <IconSend size={24} />
              </button>
            </footer>

            {/* INPUT COMENTÁRIO */}
            <div className="shrink-0 px-4 pb-3 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(); }}
                  placeholder="Adicione um comentário..."
                  className="h-10 rounded-full border-zinc-200 bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-300"
                />
                <Button
                  onClick={handleSendComment}
                  disabled={loading || !newComment.trim()}
                  className="rounded-full px-4 h-10 bg-[#b7bb86] hover:bg-[#e1903e] text-white shrink-0"
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
