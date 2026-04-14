import Post from "../components/Post";
import BotaoComu from "../components/botaocomunidades";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { posts, users, communities } from "../lib/mock";

function Feed() {
  // junta os posts e ordena por data (mais recente primeiro)
  const feedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <>
      <header></header>

      <main className="bg-slate-100 w-full min-h-screen flex justify-center items-start flex-row p-4">
        <div className="flex flex-row items-start gap-[64px]">
          
          {/* POSTS */}
          <div className="w-[732px] min-h-screen flex items-center flex-col gap-[10px]">
            
            <div className="w-[732px] h-[40px] text-black flex justify-start items-center gap-[20px] pl-[16px] pr-[16px]">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
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

                  title={post.title}
                  text={post.text}
                  image={post.image}
                />
              ))}
            </div>
          </div>

          {/* COMUNIDADES */}
          <div className="w-[320px] sticky top-4">
  
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
              
              {/* Título */}
              <div className="text-sm font-semibold text-slate-500 tracking-wide">
                Comunidades populares
              </div>

              {/* Lista */}
              <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                <BotaoComu nome="Geografia" inscritos="1.000" />
                <BotaoComu nome="Matemática" inscritos="1.000.000" />
                <BotaoComu nome="Redes" inscritos="5.700.000" />
                <BotaoComu nome="Web" inscritos="5.900.000" />
                <BotaoComu nome="UI/UX" inscritos="320.000" />
              </div>

              {/* Botão */}
              <button className="text-sm text-blue-500 hover:text-blue-600 font-medium transition">
                Ver mais →
              </button>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Feed;
