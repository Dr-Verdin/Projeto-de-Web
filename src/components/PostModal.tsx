import { Dialog, DialogContent } from "./ui/dialog";
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
        className="!max-w-4xl w-full bg-gray-50 p-0 rounded-xl shadow-xl"
      >
        <div className="flex flex-col md:flex-row">
          {/* IMAGEM */}
          {post.image && (
            <div className="w-full md:w-1/2 bg-black">
              <img
                src={post.image}
                alt="post"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* TEXTO */}
          <div className="flex-1 p-6 flex flex-col gap-4">
            {post.title && (
              <h2 className="text-xl font-bold text-slate-900">{post.title}</h2>
            )}

            {post.text && (
              <p className="text-slate-700 text-sm whitespace-pre-line">
                {post.text}
              </p>
            )}

            {/* Aqui depois você pode colocar comentários */}
            <div className="mt-auto text-sm text-gray-500">
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
  - botão de fechar (tirar ou ajustar)
  - ajustar tamanho do modal - colocar tamanho fixo e preencher lacunas da imagem com o fundo anterior
  - icone de curtidas e comentarios
  - comentarios visiveis embaixo (fazer no mock talvez alguns) e ser scrolavel
  - mostrar usuario que postou no caso de comunidades
  - colocar as tags visiveis
  - ter um input para adiconar comentarios
  - depois: designer dos comentarios -> componente
  */
}
