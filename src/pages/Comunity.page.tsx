import { CommunityInfoCard } from "@/components/CommunityInfoCard";
import WallpaperCommunity from "../components/WallpaperCommunity";
import { Post } from "../components/Post";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { posts, users, communities } from "../lib/mock";
import { useParams } from "react-router-dom";

export default function Comunidade() {
  // junta os posts e ordena por data (mais recente primeiro)
  const { id } = useParams();
  const community = communities[id!];
  const feedPosts = posts
    .filter((post) => post.type === "community" && post.communityId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="flex flex-col">

      {/* WALLPAPER DA COMUNIDADE */}
      <header className="w-full h-auto flex mx-auto py-4 pb-4">
        <WallpaperCommunity community={community} />
      </header>

      <main className="w-full min-h-screen flex justify-center items-start flex-row p-4 relative">
        <div className="flex flex-row items-start gap-[64px]">
          
          {/* FEED */}
          <div className="w-[732px] min-h-screen flex items-center flex-col gap-[10px]">
            <div className="w-[732px] h-[40px] text-black flex justify-start items-center gap-[20px] pl-[16px] pr-[16px]">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Melhores</NavigationMenuTrigger>
                    <NavigationMenuTrigger>Filtrar</NavigationMenuTrigger>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="w-[732px] min-h-screen flex flex-col gap-[24px]">
              {feedPosts.map((post) => (
                <Post
                  key={post.id}
                  name={
                    post.type === "user"
                      ? users[post.userId!]?.name
                      : communities[post.communityId!]?.name
                  }
                  createdAt={post.createdAt}
                  avatar={post.avatar}
                  title={post.title}
                  text={post.text}
                  image={post.image}
                />
              ))}
            </div>
          </div>

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
      </main>
    </div>
  );
}