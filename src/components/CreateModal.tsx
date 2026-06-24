import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IconPlus } from "@tabler/icons-react";
import AddImage from "../components/AddImage";
import AddText from "../components/AddText";
import AddBanner from "./AddBanner";
import AddTextCommunity from "./AddTextCommunity";
import SelectDestination from "./SelectDestination";
import SelectCommunity from "./SelectCommunity";
import { communityService } from "../services/communityService";
import { postService } from "../services/postService";
import { communityPostService } from "../services/communityPostService";

export default function Create({ onClose, initialCommunityId }: { onClose: () => void; initialCommunityId?: string }) {
  const [activeTab, setActiveTab] = useState<'post' | 'community'>('post');
  // Se veio de uma comunidade, pula direto para o step de seleção de comunidade
  const [postStep, setPostStep] = useState<1 | 2 | 3>(initialCommunityId ? 3 : 1);

  // estado do post
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string>("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  // estado da comunidade
  const [communityName, setCommunityName]             = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityAvatar, setCommunityAvatar]         = useState("");
  const [communityWallpaper, setCommunityWallpaper]   = useState("");
  const [creatingCommunity, setCreatingCommunity]     = useState(false);
  const [communityError, setCommunityError]           = useState("");

  const { user } = useAuth();

  const handleTabChange = (tab: 'post' | 'community') => {
    setActiveTab(tab);
    if (tab === 'post') setPostStep(1);
  };

  async function handlePublish() {
    const authorId = user?.id ?? user?.sub;
    if (!authorId || !title.trim()) return;
    setPublishing(true);
    setPublishError("");
    try {
      await postService.create({
        title: title.trim(),
        content: content.trim(),
        image: image || null,
        authorId,
      });
      onClose();
      window.location.reload();
    } catch (err: any) {
      setPublishError(err?.response?.data?.message ?? "Erro ao publicar.");
    } finally {
      setPublishing(false);
    }
  }

  async function handlePublishToCommunity(communityId: string) {
    const authorId = user?.id ?? user?.sub;
    if (!authorId || !title.trim()) return;
    setPublishing(true);
    setPublishError("");
    try {
      await communityPostService.create({
        title: title.trim(),
        content: content.trim() || undefined,
        image: image || undefined,
        authorId,
        communityId,
      });
      onClose();
      window.location.reload();
    } catch (err: any) {
      setPublishError(err?.response?.data?.message ?? "Erro ao publicar na comunidade.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleCreateCommunity() {
    const adminId = user?.id ?? user?.sub;
    if (!adminId || !communityName.trim()) return;

    setCreatingCommunity(true);
    setCommunityError("");
    try {
      await communityService.create({
        name: communityName.trim(),
        description: communityDescription.trim() || undefined,
        image: communityAvatar || undefined,
        wallpaper: communityWallpaper || undefined,
        adminId,
      });
      onClose();
      window.location.reload();
    } catch (err: any) {
      setCommunityError(err?.response?.data?.message ?? "Erro ao criar comunidade.");
    } finally {
      setCreatingCommunity(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 md:p-8 flex flex-col gap-6 cursor-default scrollbar-thin scrollbar-thumb-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <div className="flex gap-6 border-b border-gray-100 shrink-0">
          <button
            onClick={() => handleTabChange('post')}
            className={`pb-3 text-base md:text-lg font-medium transition-colors border-b-2 ${
              activeTab === 'post' ? 'border-[#efce7b] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Criar Post
          </button>
          <button
            onClick={() => handleTabChange('community')}
            className={`pb-3 text-base md:text-lg font-medium transition-colors border-b-2 ${
              activeTab === 'community' ? 'border-[#efce7b] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Criar Comunidade
          </button>
        </div>

        {/* CONTEÚDO */}
        {activeTab === 'post' ? (
          postStep === 1 ? (
            <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full animate-in fade-in duration-300">
              <div className="w-full lg:w-1/2 flex flex-col">
                <AddImage setImage={setImage} />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <AddText title={title} setTitle={setTitle} content={content} setContent={setContent} />
                <div className="w-full flex justify-end mt-4 lg:mt-auto shrink-0">
                  <button
                    onClick={() => setPostStep(2)}
                    disabled={!title.trim()}
                    className="w-full lg:w-auto px-6 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-colors disabled:opacity-40"
                  >
                    Avançar
                  </button>
                </div>
              </div>
            </div>
          ) : postStep === 2 ? (
            <SelectDestination
              onBack={() => setPostStep(1)}
              onPublishPost={handlePublish}
              onAdvanceCommunity={() => setPostStep(3)}
              publishing={publishing}
              publishError={publishError}
            />
          ) : (
            <SelectCommunity
              onBack={() => setPostStep(2)}
              onPublish={handlePublishToCommunity}
              publishing={publishing}
              publishError={publishError}
              initialSelectedId={initialCommunityId}
            />
          )
        ) : (
          <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            <AddBanner
              communityName={communityName}
              onAvatarChange={setCommunityAvatar}
              onWallpaperChange={setCommunityWallpaper}
            />
            <AddTextCommunity
              communityName={communityName}
              setCommunityName={setCommunityName}
              description={communityDescription}
              setDescription={setCommunityDescription}
            />
            {communityError && (
              <p className="text-sm text-red-500 font-medium">{communityError}</p>
            )}
            <div className="w-full flex justify-end mt-2 shrink-0">
              <button
                onClick={handleCreateCommunity}
                disabled={!communityName.trim() || creatingCommunity}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-colors disabled:opacity-40"
              >
                {creatingCommunity ? "Criando..." : "Criar"}
                {!creatingCommunity && <IconPlus size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
