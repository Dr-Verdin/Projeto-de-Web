import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "./ui/avatar";
import { IconDots } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Post as PostType } from "../types/Post";

type PostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostType;
};

export function PostModal({ open, onOpenChange, post }: PostModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="
          p-0
          overflow-hidden
          border-0
          bg-zinc-100
          rounded-2xl
          w-[95vw]
          !max-w-5xl
          h-[80vh]
          [&>button]:hidden
          [&_[data-radix-dialog-close]]:hidden
        "
      >
        <div className="flex h-full flex-col md:flex-row">
          {/* IMAGEM */}
          {post.image && (
            <div
              className="
                relative
                w-full
                md:w-[50%]
                h-[40vh]
                md:h-full
                shrink-0
                overflow-hidden
                bg-black
                flex
                items-center
                justify-center
              "
            >
              {/* background blur */}
              <img
                src={post.image}
                alt=""
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  blur-3xl
                  scale-110
                  opacity-30
                "
              />

              {/* imagem principal */}
              <img
                src={post.image}
                alt="post"
                className="
                  relative
                  z-10
                  max-w-full
                  max-h-full
                  object-contain
                "
              />
            </div>
          )}

          {/* LADO DIREITO */}
          <div
            className="
              flex-1
              bg-white
              flex
              flex-col
              min-h-0
            "
          >
            {/* HEADER */}
            <header className="w-full px-5 py-5 flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.avatar} alt={post.displayName} />
                <AvatarFallback>CN</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>

              <Link
                to={
                  post.type === "user"
                    ? `/perfil/${post.userId}`
                    : `/comunidade/${post.communityId}`
                }
                onClick={(e) => e.stopPropagation()}
                className="flex items-center"
              >
                <span className="text-slate-800 text-xs font-medium">
                  {post.type === "user" ? "u/" + post.displayName : "c/" + post.displayName}
                </span>
              </Link>

              <span className="text-gray-500 text-xs">• {post.createdAt}</span>

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

            {/* CONTEÚDO COM SCROLL */}
            <div
              className="
                flex-1
                overflow-y-auto
                px-6
                py-4
              "
            >
              {post.title && (
                <h2 className="text-xl font-bold text-zinc-900 mb-4">
                  {post.title}
                </h2>
              )}

              {post.text && (
                <p className="text-sm leading-6 text-zinc-700 whitespace-pre-line">
                  {post.text}
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div
              className="
                border-t border-zinc-200
                px-6
                py-4
                text-sm
                text-zinc-500
                shrink-0
              "
            >
              {post.comments} comentários • {post.likes} curtidas
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

{
  /*
  Ponstos para arrumar:
  - botão de fechar (tirar ou ajustar), titulo
  - icone de curtidas e comentarios
  - comentarios visiveis embaixo (fazer no mock talvez alguns) e ser scrolavel
  - mostrar usuario que postou no caso de comunidades
  - colocar as tags visiveis
  - ter um input para adiconar comentarios
  - depois: designer dos comentarios -> componente
  */
}
