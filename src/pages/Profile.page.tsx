import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfileCard } from "../components/UserProfileCard";
import { Post } from "../components/Post";
import { TaskChecklist } from "@/components/TaskChecklist";
import { userService } from "@/services/userService";
import { postService } from "@/services/postService";
import { communityPostService } from "@/services/communityPostService";
import { useAuth } from "../contexts/AuthContext";
import { IconChecklist } from "@tabler/icons-react";

export default function Profile() {
  const { id } = useParams();
  const { user: loggedUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "comunidades">("posts");
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // recarrega silenciosamente sem exibir tela de loading
  async function reloadUser(silent = false) {
    if (!id) return;
    if (!silent) setLoadingUser(true);
    try {
      const data = await userService.getById(id);
      setUser(data);
    } catch (err) {
      console.error(err);
      if (!silent) setUser(null);
    } finally {
      if (!silent) setLoadingUser(false);
    }
  }

  useEffect(() => {
    reloadUser();

    // recarrega quando o próprio usuário salva as configurações
    function handleUserUpdated(e: Event) {
      const detail = (e as CustomEvent).detail;
      // só recarrega se o id atualizado é o mesmo perfil sendo exibido
      if (!detail?.userId || detail.userId === id) {
        reloadUser(true); // silencioso — sem loading screen
      }
    }
    window.addEventListener("user-updated", handleUserUpdated);
    return () => window.removeEventListener("user-updated", handleUserUpdated);
  }, [id]);

  useEffect(() => {
    async function loadPosts() {
      if (!id) return;
      setLoadingPosts(true);
      try {
        const [regularPosts, communityPosts] = await Promise.all([
          postService.getByUser(id).catch(() => []),
          communityPostService.getByUser(id).catch(() => []),
        ]);
        const all = [...regularPosts, ...communityPosts].sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUserPosts(all);
      } catch (err) {
        console.error(err);
        setUserPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    }
    loadPosts();
    window.addEventListener("posts-updated", loadPosts);
    return () => window.removeEventListener("posts-updated", loadPosts);
  }, [id]);

  if (loadingUser || loadingPosts) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p className="text-gray-400 text-sm">Usuário não encontrado</p>
      </div>
    );
  }

  const loggedUserId = loggedUser?.id ?? loggedUser?.sub;
  const isOwnProfile = loggedUserId === id;

  return (
    <main className="w-full min-h-screen px-3 py-4 md:p-6 xl:p-8">
      <div className="max-w-5xl mx-auto flex gap-6 items-start">

        {/* COLUNA ESQUERDA — card de perfil, some no mobile */}
        <aside className="hidden md:block w-56 lg:w-64 shrink-0 sticky top-8">
          <UserProfileCard user={user} isOwnProfile={isOwnProfile} postCount={userPosts.length} />
        </aside>

        {/* COLUNA CENTRAL — feed */}
        <section className="flex-1 min-w-0 flex flex-col">

          {/* CARD DE PERFIL MOBILE */}
          <div className="md:hidden mb-1">
            <UserProfileCard user={user} mobile isOwnProfile={isOwnProfile} postCount={userPosts.length} />
          </div>

          {/* FILTROS */}
          <div className="h-11 flex items-center gap-2 px-1 mb-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "posts"
                  ? "bg-[#efce7b]/40 text-[#e1903e]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Posts
            </button>

            {/* botão Tarefas — só no próprio perfil, some em xl (onde a coluna direita aparece) */}
            {isOwnProfile && (
              <button
                onClick={() => setTaskModalOpen(true)}
                className="xl:hidden flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <IconChecklist size={15} />
                Tarefas
              </button>
            )}
          </div>

          {/* LISTA DE POSTS */}
          <div className="flex flex-col gap-4 md:gap-6 pb-24 md:pb-8">
            {userPosts.length === 0 ? (
              <EmptyPostsState />
            ) : (
              userPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* COLUNA DIREITA — tasks, só no próprio perfil e em telas bem largas */}
        {isOwnProfile && (
          <aside className="hidden xl:block w-56 shrink-0 sticky top-8">
            <TaskChecklist showFloatingButton />
          </aside>
        )}

      </div>

      {/* MODAL DE TAREFAS — janela centralizada */}
      {isOwnProfile && taskModalOpen && (
        <>
          {/* overlay + área de clique para fechar */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm xl:hidden flex items-center justify-center px-4"
            onClick={() => setTaskModalOpen(false)}
          >
            {/* card — para propagação para não fechar ao clicar dentro */}
            <div
              className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskChecklist onClose={() => setTaskModalOpen(false)} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function EmptyPostsState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <div className="text-5xl mb-3">📝</div>
      <h2 className="text-lg font-semibold text-gray-700">
        Nenhuma publicação ainda
      </h2>
      <p className="mt-2 max-w-sm text-sm">
        Este usuário ainda não publicou nada. Quando houver posts, eles aparecerão aqui.
      </p>
    </div>
  );
}
