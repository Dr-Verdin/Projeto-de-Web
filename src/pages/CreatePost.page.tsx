import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IconPhoto, IconX, IconArrowLeft } from "@tabler/icons-react";
import type { ChangeEvent } from "react";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  async function handlePublish() {
    if (!title.trim()) return;
    const authorId = user?.id ?? user?.sub;
    if (!authorId) return;

    setPublishing(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, image: previewUrl || null, authorId }),
      });
      window.dispatchEvent(new CustomEvent("posts-updated"));
      navigate("/");
    } finally {
      setPublishing(false);
    }
  }

  const displayName = user?.name ?? "Você";
  const displayUsername = user?.username ?? "";
  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e1903e&color=fff&size=80`;

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden max-w-full">

      {/* ── HEADER ── */}
      <header className="shrink-0 flex items-center justify-between px-4 h-14 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} className="text-gray-700" />
        </button>

        <span className="font-bold text-gray-900">Novo post</span>

        <button
          onClick={handlePublish}
          disabled={!title.trim() || publishing}
          className="px-5 py-2 rounded-full bg-[#e1903e] text-white text-sm font-bold
                     disabled:opacity-30 disabled:cursor-not-allowed
                     active:scale-95 transition-all"
        >
          {publishing ? "..." : "Publicar"}
        </button>
      </header>

      {/* ── CORPO SCROLLÁVEL ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">

        {/* autor */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#efce7b]"
          />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{displayName}</p>
            <p className="text-xs text-gray-400">{displayUsername}</p>
          </div>
        </div>

        {/* título */}
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sobre o que você quer falar?"
          rows={2}
          className="w-full px-4 py-2 bg-transparent text-gray-900 text-[1.35rem]
                     font-bold focus:outline-none resize-none
                     placeholder:text-gray-300 placeholder:font-bold leading-snug"
        />

        <div className="mx-4 h-px bg-gray-100" />

        {/* conteúdo */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Adicione mais detalhes (opcional)..."
          rows={3}
          className="w-full px-4 py-2 bg-transparent text-gray-700 text-base
                     focus:outline-none resize-none
                     placeholder:text-gray-300 leading-relaxed"
        />

        {/* imagem — altura limitada para não esconder os campos */}
        {previewUrl && (
          <div className="relative w-full mt-1 shrink-0">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full object-cover"
              style={{ maxHeight: "45vh" }}
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-red-600
                         text-white rounded-full flex items-center justify-center
                         transition-colors shadow-lg"
            >
              <IconX size={16} />
            </button>
          </div>
        )}

        <div className="h-4 shrink-0" />
      </div>

      {/* ── BARRA INFERIOR ── */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3
                      flex items-center justify-between">
        <label
          htmlFor="mobile-img-upload"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border
                      transition-colors cursor-pointer text-sm font-semibold
                      ${previewUrl
                        ? "border-[#e1903e] bg-[#e1903e]/10 text-[#e1903e]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
        >
          <IconPhoto size={18} />
          {previewUrl ? "Trocar foto" : "Foto"}
          <input
            id="mobile-img-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </label>

        <span className={`text-xs font-medium tabular-nums ${
          title.length > 200 ? "text-red-400" : "text-gray-300"
        }`}>
          {title.length}/200
        </span>
      </div>
    </div>
  );
}
