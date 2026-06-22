import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfileCard } from "../components/UserProfileCard";
import { Post } from "../components/Post";
import { TaskChecklist } from "@/components/TaskChecklist";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { posts, users } from "../lib/mock";

export default function Profile() {
  const { id } = useParams();
  const user = users[id!];
  const [profileUser, setProfileUser] = useState(user);

  useEffect(() => {
    setProfileUser(users[id!]);
  }, [id]);

  useEffect(() => {
    function handleUserUpdated(e: CustomEvent<{ userId: string }>) {
      if (e.detail?.userId === id) {
        setProfileUser({ ...users[id!] });
      }
    }
    window.addEventListener("user-updated", handleUserUpdated as EventListener);
    return () => window.removeEventListener("user-updated", handleUserUpdated as EventListener);
  }, [id]);

  if (!user) return <div>Usuário não encontrado</div>;

  const [postList, setPostList] = useState(() =>
    posts.filter((p) => p.userId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  useEffect(() => {
    function refresh() {
      setPostList(posts.filter((p) => p.userId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    window.addEventListener("posts-updated", refresh);
    return () => window.removeEventListener("posts-updated", refresh);
  }, [id]);

  return (
    <main className="w-full min-h-screen p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="justify-center gap-8 relative">
          {/* POSTS */}
          <section className="min-w-0 max-w-2xl mx-auto">
            {/* PERFIL */}
            <aside className="shrink-0 absolute top-10 left-0 h-full">
              <div className="sticky top-4 space-y-6">
                <div className="flex flex-col gap-4">
                  <UserProfileCard user={profileUser} />
                </div>
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
              {postList.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
