import { useState, useRef } from "react";
import { IconX, IconCamera, IconPhoto } from "@tabler/icons-react";
import { communityService, type Community } from "../services/communityService";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  community: Community;
  onClose: () => void;
  onSaved: (updated: Community) => void;
  onDelete?: () => void;
};

export function CommunitySettingsModal({ community, onClose, onSaved, onDelete }: Props) {
  const { user } = useAuth();
  const [name, setName]               = useState(community.name);
  const [description, setDescription] = useState(community.description ?? "");
  const [image, setImage]             = useState(community.image ?? "");
  const [wallpaper, setWallpaper]     = useState(community.wallpaper ?? "");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const imageRef     = useRef<HTMLInputElement>(null);
  const wallpaperRef = useRef<HTMLInputElement>(null);

  function readFile(file: File, cb: (dataUrl: string) => void) {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!name.trim()) return;
    const userId = user?.id ?? user?.sub;
    if (!userId) return;

    setSaving(true);
    setError("");
    try {
      const updated = await communityService.update(community.id, userId, {
        name: name.trim(),
        description,
        image,
        wallpaper,
      });
      onSaved(updated);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden
                     animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Editar comunidade</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <IconX size={18} className="text-gray-500" />
            </button>
          </div>

          {/* corpo */}
          <div className="px-5 py-5 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">

            {/* WALLPAPER */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Foto de fundo</label>
              <div
                className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
                onClick={() => wallpaperRef.current?.click()}
              >
                {wallpaper ? (
                  <img src={wallpaper} alt="fundo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <IconPhoto size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <IconCamera size={24} className="text-white" />
                </div>
              </div>
              <input ref={wallpaperRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setWallpaper); }} />
            </div>

            {/* AVATAR */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Foto de perfil</label>
              <div className="flex items-center gap-4">
                <div
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 cursor-pointer group shrink-0"
                  onClick={() => imageRef.current?.click()}
                >
                  {image ? (
                    <img src={image} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <IconCamera size={24} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <IconCamera size={18} className="text-white" />
                  </div>
                </div>
                <button
                  onClick={() => imageRef.current?.click()}
                  className="text-sm text-gray-500 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Alterar foto
                </button>
              </div>
              <input ref={imageRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setImage); }} />
            </div>

            {/* NOME */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da comunidade"
                className="h-10 px-4 rounded-xl border border-gray-200 text-sm bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-[#b7bb86]/50 focus:border-[#b7bb86] transition-all"
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva sua comunidade..."
                rows={3}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 resize-none
                           focus:outline-none focus:ring-2 focus:ring-[#b7bb86]/50 focus:border-[#b7bb86] transition-all"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* ZONA DE PERIGO — deletar comunidade */}
            {onDelete && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-red-600 mb-2">Zona de Perigo</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Deletar a comunidade é permanente e não pode ser desfeito. Todos os posts e membros serão removidos.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onDelete();
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Deletar comunidade
                </button>
              </div>
            )}
          </div>

          {/* footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="px-5 py-2 rounded-full bg-[#b7bb86] hover:bg-[#e1903e] text-white text-sm font-bold
                         transition-colors disabled:opacity-40"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
