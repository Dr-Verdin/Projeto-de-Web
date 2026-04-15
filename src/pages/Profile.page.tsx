import { UserProfileCard } from "../components/UserProfileCard";
import { Post } from "../components/Post";
import { TaskChecklist } from "@/components/TaskChecklist";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { posts, users, communities } from "../lib/mock";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const user = users[id!];

  if (!user) return <div>Usuário não encontrado</div>;

  const userPosts = posts
    .filter((post) => post.userId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <main className="w-full min-h-screen p-8">
      <div className="w-full max-w-[1300px] mx-auto">
        <div className="justify-center gap-8 relative">
          {/* POSTS */}
          <section className="flex-1 min-w-0 max-w-[640px] mx-auto">
            {/* PERFIL */}
            <aside className="w-[280px] shrink-0 absolute top-10 left-0 h-full">
              <div className="sticky top-4">
                <UserProfileCard user={user} />
              </div>
            </aside>

            {/* TASKS (direita) */}
            <aside className="w-[260px] shrink-0 absolute top-10 right-1 h-full">
              <div className="sticky top-4">
                <TaskChecklist />
              </div>
            </aside>
            {/* FILTROS */}
            <div className="h-[40px] flex items-center gap-4 px-4">
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
              {userPosts.map((post) => (
                <Post
                  key={post.id}
                  name={
                    post.type === "user"
                      ? users[post.userId!]?.name
                      : communities[post.communityId!]?.name
                  }
                  type={post.type}
                  createdAt={post.createdAt}
                  title={post.title}
                  text={post.text}
                  image={post.image}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
