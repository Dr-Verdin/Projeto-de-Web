import { CommunitiesCard } from "../components/CommunitiesCard";
import { Post } from "../components/Post";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { posts, users, communities } from "../lib/mock";

export default function Feed() {
  const feedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <main className="w-full min-h-screen p-8 relative">
      {/* CONTAINER PRINCIPAL */}
      <div className="max-w-[1300px] mx-auto flex justify-center gap-8 relative">

        {/* FEED */}
        <section className="flex-1 max-w-[640px] flex flex-col">

          {/* FILTROS */}
          <div className="h-[40px] flex items-center gap-4 px-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>For You</NavigationMenuTrigger>
                  <NavigationMenuTrigger>Seguindo</NavigationMenuTrigger>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* POSTS */}
          <div className="flex flex-col gap-6">
            {feedPosts.map((post) => (
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
                avatar={post.avatar}
              />
            ))}
          </div>
        </section>

        {/* COMUNIDADES */}
        <aside className="w-[280px] shrink-0 absolute top-10 -right-1 h-full">
          <CommunitiesCard />
        </aside>
      </div>
    </main>
  );
}
