import { CommunityInfoCard } from "@/components/CommunityInfoCard";
import WallpaperCommunity from "../components/WallpaperCommunity";
import { Post } from "../components/Post";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { posts, communities } from "../lib/mock";
import { useParams } from "react-router-dom";

export default function Community() {
  // junta os posts e ordena por data (mais recente primeiro)
  const { id } = useParams();
  const community = communities[id!];
  const feedPosts = posts
    .filter((post) => post.type === "community" && post.communityId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <main className="flex flex-col">
      {/* WALLPAPER DA COMUNIDADE */}
      <header className="w-full h-auto flex mx-auto py-4 pb-4">
        <WallpaperCommunity community={community} />
      </header>

      <div className="w-full min-h-screen flex justify-center items-start flex-row p-4 relative">
        <div className="flex flex-row items-start gap-[64px]">
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
              {feedPosts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>
          </section>

          {/*INFOS*/}
          <div className="mt-10 sticky top-4">
            <CommunityInfoCard
              name={communities["1"].name}
              description={communities["1"].description}
              createdAt={communities["1"].createdAt}
              visibility={communities["1"].visibility}
              members={communities["1"].members}
              rules={communities["1"].rules}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
