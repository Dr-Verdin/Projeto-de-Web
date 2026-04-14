import { SidebarCommunities } from "../components/SidebarCommunities";
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
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <main className="bg-slate-100 w-full min-h-screen p-4">
      <div className="w-full max-w-[1200px]">
        <div className="flex gap-[32px] items-start">
          <section className="w-[732px] flex flex-col gap-[10px]">

            {/* FILTROS */}
            <div className="h-[40px] flex items-center gap-[20px] px-4">
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
            <div className="flex flex-col gap-[24px]">
              {feedPosts.map((post) => (
                <Post
                  key={post.id}
                  name={
                    post.type === "user"
                      ? users[post.userId!]?.name
                      : communities[post.communityId!]?.name
                  }
                  createdAt={post.createdAt}
                  title={post.title}
                  text={post.text}
                  image={post.image}
                />
              ))}
            </div>

          </section>
          <SidebarCommunities />
        </div>
      </div>
    </main>
  );
}

