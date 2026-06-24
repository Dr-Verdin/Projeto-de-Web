import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IconPhoto, IconX, IconArrowLeft, IconCheck, IconSearch } from "@tabler/icons-react";
import type { ChangeEvent } from "react";
import { communityService, type Community } from "../services/communityService";
import { postService } from "../services/postService";
import { communityPostService } from "../services/communityPostService";

type Step = "compose" | "destination" | "community";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // se veio com ?communityId=... pula direto para o step de comunidade
  const preselectedCommunityId = searchParams.get("communityId");

  const [step, setStep] = useState<Step>(preselectedCommunityId ? "community" : "compose");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  // seleção de comunidade
  const [communityQuery, setCommunityQuery] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(preselectedCommunityId);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);

  useEffect(() => {
    communityService.getAll().then(setAllCommunities).catch(() => {});
  }, []);

  function normalize(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  const filteredCommunities = allCommunities.filter((c) =>
    normalize(c.name).includes(normalize(communityQuery)),
  );

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleBack() {
    if (step === "compose") navigate(-1);
    else if (step === "destination") setStep("compose");
    else if (step === "community") {
      // se foi direcionado de uma comunidade específica, volta para ela
      if (preselectedCommunityId) navigate(`/comunidade/${preselectedCommunityId}`);
      else setStep("destination");
    }
  }

  async function publishPost(communityId?: string) {
    const authorId = user?.id ?? user?.sub;
    if (!authorId || !title.trim()) return;
    setPublishing(true);
    setPublishError("");
    try {
      if (communityId) {
        await communityPostService.create({
          title: title.trim(),
          content: content.trim() || undefined,
          image: previewUrl || undefined,
          authorId,
          communityId,
        });
        navigate(`/comunidade/${communityId}`);
      } else {
        await postService.create({
          title: title.trim(),
          content: content.trim(),
          image: previewUrl || null,
          authorId,
        });
        window.dispatchEvent(new CustomEvent("posts-updated"));
        navigate("/");
      }
    } catch (err: any) {
      setPublishError(err?.response?.data?.message ?? "Erro ao publicar. Tente novamente.");
    } finally {
      setPublishing(false);
    }
  }

  const displayName = user?.name ?? "Você";
  const displayUsername = user?.username ?? "";
  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e1903e&color=fff&size=80`;

  const headerTitle = step === "compose"
    ? "Novo post"
    : step === "destination"
    ? "Onde publicar?"
    : "Escolher comunidade";

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden max-w-full">

      {/* HEADER */}
      <header className="shrink-0 flex items-center justify-between px-4 h-14 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} className="text-gray-700" />
        </button>

        <span className="font-bold text-gray-900">{headerTitle}</span>

        {/* botão Avançar/Publicar só no step compose */}
        {step === "compose" ? (
          <button
            onClick={() => setStep("destination")}
            disabled={!title.trim()}
            className="px-5 py-2 rounded-full bg-[#e1903e] text-white text-sm font-bold
                       disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Avançar
          </button>
        ) : (
          <div className="w-16" />
        )}
      </header>

      {/* ── STEP 1: COMPOSE ── */}
      {step === "compose" && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {/* autor */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
            <img src={avatarSrc} alt={displayName} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#efce7b]" />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-400">{displayUsername}</p>
            </div>
          </div>

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

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Adicione mais detalhes (opcional)..."
            rows={3}
            className="w-full px-4 py-2 bg-transparent text-gray-700 text-base
                       focus:outline-none resize-none placeholder:text-gray-300 leading-relaxed"
          />

          {previewUrl && (
            <div className="relative w-full mt-1 shrink-0">
              <img src={previewUrl} alt="Preview" className="w-full object-cover" style={{ maxHeight: "45vh" }} />
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-red-600
                           text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <IconX size={16} />
              </button>
            </div>
          )}

          <div className="h-4 shrink-0" />
        </div>
      )}

      {/* ── STEP 2: DESTINATION ── */}
      {step === "destination" && (
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
          {/* card perfil */}
          <button
            onClick={() => publishPost()}
            disabled={publishing}
            className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-gray-200
                       rounded-2xl hover:border-[#efce7b] hover:bg-[#efce7b]/5 transition-all active:scale-[0.98]
                       disabled:opacity-40"
          >
            <span className="text-xl font-bold text-gray-700">{publishing ? "Publicando..." : "Meu Perfil"}</span>
            <span className="text-sm text-gray-400 text-center">Publicar no seu perfil para todos os seus seguidores verem.</span>
          </button>

          {/* card comunidade */}
          <button
            onClick={() => setStep("community")}
            disabled={publishing}
            className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-gray-200
                       rounded-2xl hover:border-[#efce7b] hover:bg-[#efce7b]/5 transition-all active:scale-[0.98]
                       disabled:opacity-40"
          >
            <span className="text-xl font-bold text-gray-700">Comunidade</span>
            <span className="text-sm text-gray-400 text-center">Compartilhar esta publicação dentro de uma comunidade específica.</span>
          </button>

          {publishError && (
            <p className="text-sm text-red-500 font-medium text-center">{publishError}</p>
          )}
        </div>
      )}

      {/* ── STEP 3: COMMUNITY ── */}
      {step === "community" && (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* busca */}
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comunidade..."
              value={communityQuery}
              onChange={(e) => setCommunityQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#efce7b]/40 focus:border-[#efce7b] transition-all"
            />
          </div>

          {/* grid */}
          <div className="grid grid-cols-3 gap-3 pb-4">
            {filteredCommunities.length === 0 && (
              <p className="col-span-3 text-center text-sm text-gray-400 py-6">Nenhuma comunidade encontrada.</p>
            )}
            {filteredCommunities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommunityId(c.id)}
                className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all relative ${
                  selectedCommunityId === c.id
                    ? "bg-[#efce7b]/10 border-2 border-[#efce7b]"
                    : "border-2 border-transparent hover:bg-gray-50"
                }`}
              >
                {selectedCommunityId === c.id && (
                  <span className="absolute top-1 right-1 text-[#efce7b] bg-white rounded-full shadow-sm z-10">
                    <IconCheck size={14} />
                  </span>
                )}
                <img
                  src={c.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=b7bb86&color=fff&size=64`}
                  alt={c.name}
                  className="w-14 h-14 rounded-full object-cover shadow-sm"
                />
                <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BARRA INFERIOR */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between">
        {step === "compose" && (
          <>
            <label
              htmlFor="mobile-img-upload"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors cursor-pointer text-sm font-semibold
                          ${previewUrl ? "border-[#e1903e] bg-[#e1903e]/10 text-[#e1903e]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <IconPhoto size={18} />
              {previewUrl ? "Trocar foto" : "Foto"}
              <input id="mobile-img-upload" type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
            </label>
            <span className={`text-xs font-medium tabular-nums ${title.length > 200 ? "text-red-400" : "text-gray-300"}`}>
              {title.length}/200
            </span>
          </>
        )}

        {step === "community" && (
          <div className="w-full flex flex-col gap-2">
            {publishError && (
              <p className="text-xs text-red-500 font-medium text-center">{publishError}</p>
            )}
            <button
              onClick={() => selectedCommunityId && publishPost(selectedCommunityId)}
              disabled={!selectedCommunityId || publishing}
              className="w-full py-2.5 rounded-full bg-[#e1903e] text-white font-bold text-sm
                         disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              {publishing ? "Publicando..." : "Publicar na comunidade"}
            </button>
          </div>
        )}

        {step === "destination" && publishError && (
          <p className="text-xs text-red-500 font-medium text-center w-full">{publishError}</p>
        )}
      </div>
    </div>
  );
}
