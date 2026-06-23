import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfileCard } from "../components/UserProfileCard";
import { Post } from "../components/Post";
import { TaskChecklist } from "@/components/TaskChecklist";
import { userService } from "@/services/userService";
import { postService } from "@/services/postService";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "comunidades">("posts");

  useEffect(() => {
    async function loadUser() {
      if (!id) return;
      setLoadingUser(true);
      try {
        const data = await userService.getById(id);
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, [id]);

  useEffect(() => {
    async function loadPosts() {
      if (!id) return;
      setLoadingPosts(true);
      try {
        const data = await postService.getByUser(id);
        setUserPosts(data);
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

  return (
    <main className="w-full min-h-screen px-3 py-4 md:p-8">
      <div className="max-w-7xl mx-auto flex gap-6 lg:gap-8 items-start">

        {/* COLUNA ESQUERDA — card de perfil, some no mobile */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-8">
          <UserProfileCard user={user} />
        </aside>

        {/* COLUNA CENTRAL — feed */}
        <section className="flex-1 min-w-0 flex flex-col">

          {/* CARD DE PERFIL MOBILE — aparece só no mobile, horizontal */}
          <div className="lg:hidden mb-4">
            <UserProfileCard user={user} mobile />
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
            <button
              onClick={() => setActiveTab("comunidades")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "comunidades"
                  ? "bg-[#efce7b]/40 text-[#e1903e]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Comunidades
            </button>
          </div>

          {/* LISTA DE POSTS */}
          <div className="flex flex-col gap-4 md:gap-6 pb-6 lg:pb-0">
            {userPosts.length === 0 ? (
              <EmptyPostsState />
            ) : (
              userPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* COLUNA DIREITA — tasks, só no desktop */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-8">
          <TaskChecklist />
        </aside>

      </div>
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
