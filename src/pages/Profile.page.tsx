import { UserProfileCard } from "../components/UserProfileCard";
import { Post } from "../components/Post";
import { TaskChecklist } from "@/components/TaskChecklist";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userService } from "@/services/userService";
import { postService } from "@/services/postService"

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

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
  }, [id]);

  if (loadingUser || loadingPosts) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

   function EmptyPostsState() {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <div className="text-5xl mb-3">📝</div>

        <h2 className="text-lg font-semibold text-gray-700">
          Nenhuma publicação ainda
        </h2>

        <p className="mt-2 max-w-sm">
          Este usuário ainda não publicou nada. Quando houver posts, eles aparecerão aqui.
        </p>

        <div className="mt-4 text-sm text-gray-400">
          Seja o primeiro a interagir com este perfil
        </div>
      </div>
    );
  } 

  return (
    <main className="w-full min-h-screen p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="justify-center gap-8 relative">
          {/* POSTS */}
          <section className="min-w-0 max-w-2xl mx-auto">
            {/* PERFIL */}
            <aside className="shrink-0 absolute top-10 left-0 h-full">
              <div className="sticky top-4">
                <UserProfileCard
                  user={{
                    ...user,
                    avatarUrl:
                      user?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                      )}&background=6366f1&color=fff`,
                  }}
                />
              </div>
            </aside>

            {/* TASKS (direita) */}
            <aside className="shrink-0 absolute top-10 right-1 h-full">
              <div className="sticky top-4">
                <TaskChecklist />
              </div>
            </aside>
            {/* FILTROS */}
            <div className="h-11 flex items-center gap-4 px-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Posts</NavigationMenuTrigger>
                    <NavigationMenuTrigger>Comunidades</NavigationMenuTrigger>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* LISTA */}
            <div className="flex flex-col gap-6">
              {userPosts.length === 0 ? (
                <EmptyPostsState />
              ) : (
                userPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
