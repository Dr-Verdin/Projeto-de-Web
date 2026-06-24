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
import { userService } from "../services/userService";
import { isLiked as getCachedLike, setLiked as setCachedLike } from "../lib/communityLikeCache";

export function Post({ post }: { post: PostType }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // currentUserId precisa ser calculado antes dos useState que dependem dele
  const storedUser = localStorage.getItem("user");
  const currentUserId = storedUser
    ? (JSON.parse(storedUser)?.id ?? JSON.parse(storedUser)?.sub)
    : null;

  const [liked, setLiked] = useState(() =>
    post.communityId && currentUserId ? getCachedLike(currentUserId, post.id) : false
  );
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [commentCount, setCommentCount] = useState(post._count?.comments ?? 0);
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const [deleted, setDeleted] = useState(false);

  // sincroniza o contador quando o objeto post mudar (ex: reload do feed)
  useEffect(() => {
    setCommentCount(post._count?.comments ?? 0);
  }, [post.id, post._count?.comments]);

  // escuta o evento de delete para se remover da lista
  useEffect(() => {
    function handlePostDeleted(e: Event) {
      if ((e as CustomEvent).detail?.postId === post.id) {
        // fecha o modal primeiro, depois remove o componente
        setOpen(false);
        setTimeout(() => setDeleted(true), 300);
      }
    }
    window.addEventListener("post-deleted", handlePostDeleted);
    return () => window.removeEventListener("post-deleted", handlePostDeleted);
  }, [post.id]);

  if (deleted) return null;

  const { id, title, content, image, author } = post;

  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const userId = post.authorId;

  const displayName = author?.username ?? author?.name ?? "unknown";
  const avatar = author?.avatar ?? "";

  const isOwnPost = userId === currentUserId;

  // busca status de follow para posts de outros usuários
  useEffect(() => {
    if (isOwnPost || !currentUserId || !post.authorId) return;
    userService
      .getFollowStatus(post.authorId, currentUserId)
      .then((res) => setFollowing(res.following))
      .catch(() => {});
  }, [post.authorId, currentUserId, isOwnPost]);

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

  useEffect(() => {
    async function fetchLikeState() {
      const userId = user?.id ?? user?.sub;
      if (!userId) return;
      try {
        if (post.communityId) {
          // backend não tem GET /community-posts/:id — usa cache local
          setLiked(getCachedLike(userId, post.id));
          setLikes(post.likes ?? 0);
        } else {
          const res = await api.get(`/posts/${post.id}`, { params: { userId } });
          setLiked(res.data.likedByMe ?? false);
          setLikes(res.data.likes ?? post.likes ?? 0);
        }
      } catch {
        // silently fail — mantém o estado inicial
      }
    }
    fetchLikeState();
  }, [post.id, post.communityId, user?.id, user?.sub]);

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
    const userId = user?.id ?? user?.sub;
    if (!userId) return;

    const wasLiked = liked;
    const newLiked = !wasLiked;
    setLiked(newLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    if (post.communityId) setCachedLike(userId, post.id, newLiked);

    try {
      const route = post.communityId
        ? `/community-posts/${post.id}/like`
        : `/posts/${post.id}/like`;
      const res = await api.patch(route, { userId });
      setLiked(res.data.liked);
      if (post.communityId) setCachedLike(userId, post.id, res.data.liked);
    } catch {
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
      if (post.communityId) setCachedLike(userId, post.id, wasLiked);
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
      window.location.reload();
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
        <header className="w-full flex items-center gap-2 px-2 md:px-4 py-1">
          <Avatar className="w-9 h-9 md:w-11 md:h-11 shrink-0">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>

          <div className="flex flex-col min-w-0">
            {/* se é post de comunidade, mostra nome da comunidade em cima */}
            {post.communityId && (
              <Link
                to={`/comunidade/${post.communityId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold text-[#e1903e] hover:underline truncate leading-tight"
              >
                c/{post.community?.name ?? post.communityId}
              </Link>
            )}
            <Link
              to={`/perfil/${post.authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 text-xs hover:underline truncate leading-tight"
            >
              u/{displayName}
            </Link>
          </div>

          <span className="text-gray-400 text-xs shrink-0 ml-1">• {createdAt}</span>

          <div className="ml-auto flex items-center gap-1 md:gap-2 shrink-0">
            {!isOwnPost && (
              <Button
                onClick={handleFollow}
                disabled={loadingFollow}
                className={`rounded-full px-3 md:px-4 h-7 md:h-8 text-xs font-bold transition-all disabled:opacity-50 ${
                  following
                    ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500"
                    : "text-white bg-[#b7bb86] hover:bg-[#e1903e]"
                }`}
              >
                {following ? "Seguindo" : "Seguir"}
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
            <h2 className="text-slate-900 font-bold text-lg md:text-xl">{title}</h2>
          )}

          {content && (
            <TextWithReadMore text={content} onOpenModal={() => setOpen(true)} />
          )}

          {image && (
            <div className="relative w-full h-[50vw] md:h-[65vh] max-h-[480px] overflow-hidden rounded-xl bg-black">
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

      <PostModal
        open={modalOpen}
        onOpenChange={setOpen}
        post={post}
        liked={liked}
        likes={likes}
        onCommentAdded={(total) => setCommentCount(total)}
        onLikeChanged={(newLiked, newLikes) => {
          setLiked(newLiked);
          setLikes(newLikes);
        }}
      />
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
    <div className="flex flex-col gap-1 text-slate-700 text-sm md:text-base">
      <p ref={pRef} className="line-clamp-3">{text}</p>
      {isClamped && (
        <button
          onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
          className="text-xs hover:text-slate-950 text-slate-500 w-fit"
        >
          ver mais
        </button>
      )}
    </div>
  );
}
