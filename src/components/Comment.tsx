import type { Comment as CommentType } from "../types/Comment";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";

import { Link } from "react-router-dom";
import { users } from "../lib/mock";
import { IconHeart, IconDots, IconCornerDownRight } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";

type CommentItemProps = CommentType & {
  onDelete?: (id: string) => void;
};

export function CommentItem({
  id,
  userId,
  content,
  image,
  createdAt,
  likes,
  onDelete,
}: CommentItemProps) {
  const user = users[userId];
  const displayName = user?.name ?? userId;
  const avatar = user?.avatar ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // fecha o menu ao clicar fora
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

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(id);
  }

  function handleSendReply(e: React.MouseEvent) {
    e.stopPropagation();
    if (!replyText.trim()) return;
    // TODO: chamar API quando pronto
    setReplyText("");
    setReplyOpen(false);
  }

  return (
    <div className="flex gap-3 px-4 py-3">
      {/* AVATAR */}
      <Link to={`/perfil/${userId}`} onClick={(e) => e.stopPropagation()}>
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
        <div className="flex items-center">
          <div className="flex items-center gap-2 flex-1">
            <Link
              to={`/perfil/${userId}`}
              className="text-sm font-medium text-slate-800 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              u/{displayName}
            </Link>
            <span className="text-xs text-zinc-500">
              • {new Date(createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          {/* MENU DE 3 PONTOS */}
          <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-zinc-500 hover:bg-zinc-100"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <IconDots size={16} />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 top-9 z-50 min-w-[140px] rounded-xl border border-gray-100 bg-white shadow-lg py-1 overflow-hidden">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Deletar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TEXTO */}
        <p className="text-sm text-slate-700 whitespace-pre-line">
          {content}
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
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-zinc-600 hover:text-red-500 transition-colors"
          >
            <IconHeart size={18} />
            <span className="text-xs">{likes}</span>
          </button>

          {/* BOTÃO RESPONDER */}
          <button
            onClick={(e) => { e.stopPropagation(); setReplyOpen((v) => !v); }}
            className="flex items-center gap-1 text-zinc-500 hover:text-[#e1903e] transition-colors text-xs font-medium"
          >
            <IconCornerDownRight size={16} />
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
              onKeyDown={(e) => { if (e.key === "Enter") handleSendReply(e as any); }}
              placeholder={`Respondendo u/${displayName}...`}
              className="flex-1 h-9 px-4 rounded-full border border-zinc-200 bg-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#efce7b] focus:border-[#efce7b]"
            />
            <button
              onClick={handleSendReply}
              className="px-4 h-9 rounded-full bg-[#b7bb86] hover:bg-[#e1903e] text-white text-xs font-medium transition-colors"
            >
              Enviar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setReplyOpen(false); setReplyText(""); }}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
