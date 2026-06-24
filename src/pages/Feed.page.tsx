import { CommunitiesCard } from "../components/CommunitiesCard";
import { Post as PostComponent } from "../components/Post";
import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import { communityPostService } from "../services/communityPostService";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  async function loadPosts() {
    try {
      const [regularPosts, communityPosts] = await Promise.all([
        postService.getAll().catch(() => []),
        communityPostService.getAll().catch(() => []),
      ]);

      const all = [...regularPosts, ...communityPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(all);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    // reload silencioso — não zera o estado antes de receber os dados
    function handlePostsUpdated() { loadPosts(); }
    window.addEventListener("posts-updated", handlePostsUpdated);
    return () => window.removeEventListener("posts-updated", handlePostsUpdated);
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
          </div>

          {/* POSTS */}
          <div className="flex flex-col gap-4 md:gap-6 pb-24 md:pb-8">
            {posts.map((post) => (
              <PostComponent key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* COMUNIDADES — só no desktop, sticky */}
        <aside className="hidden md:block w-[clamp(14rem,20vw,22rem)] shrink-0">
          <div className="sticky top-8">
            <CommunitiesCard />
          </div>
        </aside>
      </div>
    </main>
  );
}
