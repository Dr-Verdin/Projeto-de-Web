import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconHeart, IconMessageCircle, IconDots, IconTrash, IconLink,
} from "@tabler/icons-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { communityPostService, type CommunityPost } from "../services/communityPostService";

type Props = {
  post: CommunityPost;
  communityAdminId?: string;
  communityName?: string;
  onDeleted?: (id: string) => void;
};

export function CommunityPostItem({ post, communityAdminId, communityName, onDeleted }: Props) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? user?.sub;

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleted, setDeleted]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = post.authorId === currentUserId;
  const isAdmin  = communityAdminId === currentUserId;
  const canDelete = isAuthor || isAdmin;

  const displayName = post.author?.name ?? post.author?.username ?? "user";
  const avatar      = post.author?.avatar ?? "";
  const avatarFallback = displayName.slice(0, 2).toUpperCase();
  // nome da comunidade: prop > objeto aninhado > fallback
  const cName = communityName ?? post.community?.name;

  const createdAt = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  useEffect(() => {
    if (!menuOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    if (!currentUserId) return;
    try {
      await communityPostService.remove(post.id, currentUserId);
      setDeleted(true);
      onDeleted?.(post.id);
    } catch (err) {
      console.error("Erro ao deletar post:", err);
    }
  }

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setMenuOpen(false);
  }

  if (deleted) return null;

  return (
    <div className="w-full flex flex-col gap-3 p-3 md:p-4 rounded-xl transition-colors duration-300 hover:bg-[#efce7b]/30">

      {/* CABEÇALHO */}
      <header className="w-full flex items-center gap-2 px-1">
        <Link to={`/perfil/${post.authorId}`} onClick={(e) => e.stopPropagation()}>
          <Avatar className="w-9 h-9 md:w-11 md:h-11 shrink-0">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col min-w-0">
          {cName && (
            <Link
              to={`/comunidade/${post.communityId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-[#e1903e] hover:underline truncate leading-tight"
            >
              c/{cName}
            </Link>
          )}
          <Link
            to={`/perfil/${post.authorId}`}
            className="text-slate-600 text-xs hover:underline truncate leading-tight"
          >
            u/{displayName}
          </Link>
        </div>

        <span className="text-gray-400 text-xs shrink-0 ml-1">• {createdAt}</span>

        <div className="ml-auto flex items-center gap-1 shrink-0">
          <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 md:w-8 md:h-8 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-200 text-slate-900"
            >
              <IconDots size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 z-50 min-w-[160px] rounded-xl border border-gray-100 bg-white shadow-lg py-1 overflow-hidden">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <IconLink size={15} className="text-gray-400" />
                  Copiar link
                </button>
                {canDelete && (
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

      {/* CONTEÚDO */}
      <div className="w-full flex flex-col gap-2 px-1">
        {post.title && (
          <h2 className="text-slate-900 font-bold text-lg md:text-xl">{post.title}</h2>
        )}
        {post.content && (
          <p className="text-slate-700 text-sm md:text-base leading-relaxed line-clamp-3">{post.content}</p>
        )}
        {post.image && (
          <div className="relative w-full overflow-hidden rounded-xl bg-black max-h-[480px]">
            <img src={post.image} alt="blur" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40" />
            <img src={post.image} alt="post" className="relative z-10 w-full h-full object-contain max-h-[480px]" />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="w-full flex items-center gap-5 px-1 py-1">
        <div className="flex items-center gap-1.5 text-gray-500">
          <IconHeart size={22} className="text-gray-400" />
          <span className="text-sm">{post.likes ?? 0}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <IconMessageCircle size={22} className="text-gray-400" />
          <span className="text-sm">{post._count?.comments ?? 0}</span>
        </div>
      </footer>
    </div>
  );
}
