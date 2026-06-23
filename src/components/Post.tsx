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
  IconLink,
  IconTrash,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { PostModal } from "./PostModal";
import type { Post as PostType } from "../types/Post";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { postService } from "../services/postService";

export function Post({ post }: { post: PostType }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [commentCount, setCommentCount] = useState(post._count?.comments ?? 0);

  const { id, title, content, image, author } = post;

  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const userId = post.authorId;

  const displayName = author?.name ?? author?.username ?? "unknown";
  const avatar = author?.avatar ?? "";

  const storedUser = localStorage.getItem("user");
  const currentUserId = storedUser
    ? (JSON.parse(storedUser)?.id ?? JSON.parse(storedUser)?.sub)
    : null;
  const isOwnPost = userId === currentUserId;

  useEffect(() => {
    async function fetchLikeState() {
      if (!user?.sub) return;
      try {
        const res = await api.get(`/posts/${post.id}`, {
          params: { userId: user.sub },
        });
        setLiked(res.data.likedByMe);
        setLikes(res.data.likes);
      } catch {
        // silently fail
      }
    }
    fetchLikeState();
  }, [post.id, user?.sub]);

  useEffect(() => {
    function handleCloseAll() { setOpen(false); }
    window.addEventListener("closePostModals", handleCloseAll);
    return () => window.removeEventListener("closePostModals", handleCloseAll);
  }, []);

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

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user?.sub) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const res = await api.patch(`/posts/${post.id}/like`, { userId: user.sub });
      setLiked(res.data.liked);
    } catch {
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  }

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    setMenuOpen(false);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await postService.remove(id);
      window.dispatchEvent(new CustomEvent("posts-updated"));
    } catch (err) {
      console.error("Erro ao deletar post:", err);
    }
  }

  const modalOpen = open && !document.body.classList.contains("profile-editor-open");

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer w-full flex flex-col gap-3 p-2 rounded-lg transition-colors duration-300 hover:bg-[#efce7b]/30"
      >
        {/* CABEÇALHO */}
        <header className="w-full h-12 flex items-center gap-2 px-2 md:px-4">
          <Avatar className="w-8 h-8 md:w-10 md:h-10 shrink-0">
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
            className="text-slate-800 text-xs font-medium hover:underline truncate max-w-[120px] md:max-w-none"
          >
            {post.communityId ? "c/" : "u/"}
            {displayName}
          </Link>

          <span className="text-gray-500 text-xs shrink-0">• {createdAt}</span>

          <div className="ml-auto flex items-center gap-1 md:gap-2 shrink-0">
            {!isOwnPost && (
              <Button
                onClick={(e) => e.stopPropagation()}
                className="rounded-full px-3 md:px-4 h-7 md:h-8 text-xs text-white bg-[#b7bb86] hover:bg-[#e1903e]"
              >
                seguir
              </Button>
            )}

            <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-7 h-7 md:w-8 md:h-8 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-300 text-slate-900"
              >
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

        {/* CONTEUDO */}
        <div className="w-full flex flex-col gap-2 px-2 md:px-4">
          {title && (
            <h2 className="text-slate-900 font-bold text-base md:text-lg">{title}</h2>
          )}

          {content && (
            <TextWithReadMore text={content} onOpenModal={() => setOpen(true)} />
          )}

          {image && (
            <div className="relative w-full h-[45vw] md:h-[60vh] max-h-[420px] overflow-hidden rounded-lg bg-black">
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
        <footer className="w-full flex items-center justify-between px-2 md:px-4 py-2">
          <div className="flex items-center gap-4 md:gap-5">
            <button
              onClick={handleLike}
              className="group flex items-center gap-1 transition-colors"
            >
              <IconHeart
                size={26}
                className={
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-black group-hover:text-[#e63946]"
                }
              />
              <span
                className={
                  liked
                    ? "text-red-500 text-sm"
                    : "text-black text-sm group-hover:text-[#e63946]"
                }
              >
                {likes}
              </span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              className="flex gap-1 items-center text-black hover:text-[#e1903e] transition-colors"
            >
              <IconMessageCircle size={26} />
              <span className="text-sm">{commentCount}</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate("/mensagens"); }}
              className="text-black hover:text-[#e1903e] transition-colors"
            >
              <IconSend size={26} />
            </button>
          </div>
        </footer>
      </div>

      <PostModal open={modalOpen} onOpenChange={setOpen} post={post} onCommentAdded={() => setCommentCount((n) => n + 1)} />
    </>
  );
}

function TextWithReadMore({ text, onOpenModal }: { text: string; onOpenModal: () => void }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <div className="flex flex-col gap-1 text-slate-700 text-sm">
      <p ref={pRef} className="line-clamp-3">{text}</p>
      {isClamped && (
        <button
          onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
          className="text-xs hover:text-slate-950 text-slate-600 w-fit"
        >
          ver mais
        </button>
      )}
    </div>
  );
}
