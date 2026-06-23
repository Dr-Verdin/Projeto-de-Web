import { CommunitiesCard } from "../components/CommunitiesCard";
import type { Post } from "../types/Post";
import { Post as PostComponent } from "../components/Post";
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
    <main className="w-full min-h-screen px-3 py-4 md:p-8">
      <div className="max-w-7xl mx-auto flex gap-6 lg:gap-8 justify-center">

        {/* FEED */}
        <section className="w-full max-w-2xl flex flex-col min-w-0">

          {/* FILTROS */}
          <div className="h-11 flex items-center gap-2 px-1 mb-1">
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#efce7b]/40 text-[#e1903e]">
              Para você
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              Seguindo
            </button>
          </div>

          {/* POSTS */}
          <div className="flex flex-col gap-4 md:gap-6 pb-6 lg:pb-0">
            {posts.map((post) => (
              <PostComponent key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* COMUNIDADES — só no desktop, sticky */}
      <aside className="hidden md:block w-[clamp(12rem,16vw,16rem)] shrink-0">
        <div className="sticky top-8">
          <CommunitiesCard />
        </div>
      </aside>
      </div>
    </main>
  );
}
