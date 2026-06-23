import { useState, useEffect, type ChangeEvent, type DragEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCamera} from "@tabler/icons-react";

interface AddBannerProps {
  communityName: string;
}

export default function AddBanner({ communityName }: AddBannerProps) {
  // ==========================================
  // ESTADOS DO BANNER (Iniciam vazios)
  // ==========================================
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile);
      setBannerPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBannerPreview(null);
    }
  }, [bannerFile]);

  const handleBannerDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setBannerFile(file);
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerFile(file);
  };

  // ==========================================
  // ESTADOS DO AVATAR (Iniciam vazios)
  // ==========================================
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const handleAvatarDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setAvatarFile(file);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  // ==========================================
  // FUNÇÃO COMPARTILHADA
  // ==========================================
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full mx-auto">
      {/* 1. AREA DO BANNER (Drop Zone) */}
      <label
        className="group relative w-full aspect-[1072/136] overflow-hidden flex justify-center items-center rounded-lg cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
        onDrop={handleBannerDrop}
        onDragOver={handleDragOver}
        title="Clique ou arraste para adicionar um banner"
      >
        {/* Renderização Condicional: Mostra imagem ou estado vazio */}
        {bannerPreview ? (
          <img
            src={bannerPreview}
            alt="Banner da comunidade"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-500">
            <IconCamera size={32} stroke={1.5} />
            <span className="text-sm font-medium mt-1">Adicionar Banner</span>
          </div>
        )}
        
        {/* Overlay escuro que aparece APENAS se já tiver imagem, para indicar troca */}
        {bannerPreview && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
              <IconCamera size={16} />
              Alterar Banner
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerChange}
        />
      </label>

      {/* Infos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:gap-1 gap-4">
        
        {/* LADO ESQUERDO */}
        <div className="flex flex-row items-end gap-3">
          
          {/* 2. AREA DO AVATAR (Drop Zone) */}
          <div className="-mt-8 sm:-mt-10 ml-4 z-20">
            <label
              className="group relative block cursor-pointer rounded-full bg-white"
              onDrop={handleAvatarDrop}
              onDragOver={handleDragOver}
              title="Clique ou arraste para adicionar um ícone"
            >
              <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-md bg-gray-100">
                {/* O Shadcn só renderiza o Image se a string for válida */}
                {avatarPreview && (
                  <AvatarImage src={avatarPreview} alt="Avatar da comunidade" className="object-cover" />
                )}
                
                {/* Fallback caso não tenha imagem */}
                <AvatarFallback className="bg-gray-100 text-gray-400 flex flex-col items-center justify-center w-full h-full">
                  <IconCamera size={28} stroke={1.5} />
                </AvatarFallback>
              </Avatar>

              {/* Overlay escuro que aparece no Hover do Avatar */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-transparent z-10">
                 <IconCamera size={24} color="white" />
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Nome Dinâmico */}
          <div className="pb-1 sm:pb-3">
            <h1 className="text-xl sm:text-[28px] font-bold text-[#1c1c1c] break-all">
              {communityName.trim() !== "" ? communityName : "Nome da Comunidade"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}