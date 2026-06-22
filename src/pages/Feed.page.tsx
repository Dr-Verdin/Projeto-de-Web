import { CommunitiesCard } from "../components/CommunitiesCard";
import type { Post } from "../types/Post";
import { Post as PostComponent } from "../components/Post";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { postService } from "../services/postService";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  async function loadPosts() {
    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    window.addEventListener("posts-updated", loadPosts);
    return () => window.removeEventListener("posts-updated", loadPosts);
  }, []);

  return (
    <main className="w-full min-h-screen p-8 relative">
      {/* CONTAINER PRINCIPAL */}
      <div className="max-w-7xl mx-auto flex justify-center gap-8 relative">

        {/* FEED */}
        <section className="flex-1 max-w-2xl flex flex-col">

          {/* FILTROS */}
          <div className="h-11 flex items-center gap-4 px-4">
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
            {posts.map((post) => (
              <PostComponent key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* COMUNIDADES */}
        <aside className="shrink-0 absolute top-10 -right-1 h-full">
          <CommunitiesCard />
        </aside>
      </div>
    </main>
  );
}
