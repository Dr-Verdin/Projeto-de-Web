import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IconPlus } from "@tabler/icons-react";
import AddImage from "../components/AddImage";
import AddText from "../components/AddText";
import AddBanner from "./AddBanner";
import AddTextCommunity from "./AddTextCommunity";
import SelectDestination from "./SelectDestination";
import SelectCommunity from "./SelectCommunity";

export default function Create({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'post' | 'community'>('post');
  const [communityName, setCommunityName] = useState("");
  const [postStep, setPostStep] = useState<1 | 2 | 3>(1);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string>("");

  const { user } = useAuth();

  const handleTabChange = (tab: 'post' | 'community') => {
    setActiveTab(tab);
    if (tab === 'post') setPostStep(1);
  };

  async function handlePublish() {
    const authorId = user?.id ?? user?.sub;
    if (!authorId) return;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, image: image || null, authorId }),
    });

    onClose();
    window.location.reload();
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
                    className="w-full lg:w-auto px-6 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-colors"
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
            />
          ) : (
            <SelectCommunity
              onBack={() => setPostStep(2)}
              onPublish={() => { onClose(); }}
            />
          )
        ) : (
          <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            <AddBanner communityName={communityName} />
            <AddTextCommunity communityName={communityName} setCommunityName={setCommunityName} />
            <div className="w-full flex justify-end mt-2 shrink-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-colors"
              >
                Criar
                <IconPlus size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
