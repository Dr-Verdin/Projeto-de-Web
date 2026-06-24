import { useState, useEffect } from "react";
import { CommunityInfoCard } from "@/components/CommunityInfoCard";
import WallpaperCommunity from "../components/WallpaperCommunity";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { communityService, type Community } from "../services/communityService";
import { communityPostService, type CommunityPost } from "../services/communityPostService";
import { CommunityPostItem } from "../components/CommunityPostItem";
import api from "../services/api";

export default function CommunityPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUserId = user?.id ?? user?.sub;

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts]         = useState<CommunityPost[]>([]);
  const [isMember, setIsMember]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [infoOpen, setInfoOpen]   = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      try {
        const found = await communityService.getById(id!);
        setCommunity(found);

        // carrega posts da comunidade
        const communityPosts = await communityPostService.getByCommunity(id!).catch(() => []);
        setPosts(communityPosts);

        // verifica membership via API (com fallback para localStorage)
        if (currentUserId && found) {
          if (found.adminId === currentUserId) {
            setIsMember(true);
          } else {
            try {
              const membersRes = await api.get(`/communities/${id}/members`);
              const members: { userId: string }[] = membersRes.data;
              const isMem = members.some((m) => m.userId === currentUserId);
              setIsMember(isMem);
              localStorage.setItem(`member_${currentUserId}_${id}`, String(isMem));
            } catch {
              // fallback para localStorage se endpoint não existir
              const key = `member_${currentUserId}_${id}`;
              const stored = localStorage.getItem(key);
              if (stored !== null) setIsMember(stored === "true");
            }
          }
        }
      } catch {
        setCommunity(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, currentUserId]);

  const isAdmin = !!community && community.adminId === currentUserId;

  async function handleJoin() {
    if (!id || !currentUserId) return;
    try {
      await communityService.join(id, currentUserId);
      setIsMember(true);
      localStorage.setItem(`member_${currentUserId}_${id}`, "true");
      setCommunity((prev) =>
        prev ? { ...prev, _count: { ...prev._count, members: prev._count.members + 1 } } : prev,
      );
    } catch {}
  }

  async function handleLeave() {
    if (!id || !currentUserId) return;
    try {
      await communityService.leave(id, currentUserId);
      setIsMember(false);
      localStorage.setItem(`member_${currentUserId}_${id}`, "false");
      setCommunity((prev) =>
        prev ? { ...prev, _count: { ...prev._count, members: Math.max(0, prev._count.members - 1) } } : prev,
      );
    } catch {}
  }

  async function handleDeleteCommunity() {
    if (!id || !currentUserId || !community) return;
    if (!window.confirm(`Tem certeza que deseja excluir "${community.name}"? Esta ação é irreversível.`)) return;
    try {
      await communityService.remove(id, currentUserId);
      window.location.href = "/comunidades";
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Erro ao excluir comunidade.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Comunidade não encontrada</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">

      {/* WALLPAPER */}
      <header className="w-full px-3 md:px-6 pt-4 pb-2">
        <WallpaperCommunity
          community={community}
          isAdmin={isAdmin}
          isMember={isMember}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onCommunityUpdate={(updated) => setCommunity(updated)}
          onDelete={handleDeleteCommunity}
        />
      </header>

      {/* CORPO */}
      <div className="w-full flex-1 px-3 md:px-6 pb-24 md:pb-8">
        <div className="flex gap-6 items-start">

          {/* FEED */}
          <section className="flex-1 min-w-0 flex flex-col">

            {/* barra de filtros */}
            <div className="flex items-center gap-2 px-1 mb-4 border-b border-gray-100 pb-3">
              <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#efce7b]/40 text-[#e1903e]">
                Para você
              </button>

              <button
                onClick={() => setInfoOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
                           text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors ml-auto"
              >
                <IconInfoCircle size={15} />
                Sobre
              </button>
            </div>

            {/* posts */}
            <div className="flex flex-col gap-4 md:gap-6">
              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-base font-medium text-gray-500">Nenhum post nesta comunidade ainda.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isMember ? "Seja o primeiro a publicar!" : "Entre na comunidade para publicar."}
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <CommunityPostItem
                    key={post.id}
                    post={post}
                    communityAdminId={community.adminId}
                    onDeleted={(deletedId) => {
                      setPosts((prev) => prev.filter((p) => p.id !== deletedId));
                      setCommunity((prev) =>
                        prev
                          ? { ...prev, _count: { ...prev._count, posts: Math.max(0, prev._count.posts - 1) } }
                          : prev,
                      );
                    }}
                  />
                ))
              )}
            </div>
          </section>

          {/* CARD DE INFOS — desktop */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-8">
            <CommunityInfoCard
              name={community.name}
              description={community.description}
              createdAt={community.createdAt}
              _count={community._count}
              adminName={community.admin?.name}
            />
          </aside>
        </div>
      </div>

      {/* MODAL DE INFO — mobile */}
      {infoOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setInfoOpen(false)}
          />
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center px-4 lg:hidden"
            onClick={() => setInfoOpen(false)}
          >
            <div
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Sobre a comunidade</h2>
                <button onClick={() => setInfoOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <IconX size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <CommunityInfoCard
                  name={community.name}
                  description={community.description}
                  createdAt={community.createdAt}
                  _count={community._count}
                  adminName={community.admin?.name}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
