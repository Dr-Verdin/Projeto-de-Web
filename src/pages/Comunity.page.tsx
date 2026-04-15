import { Informacoes } from "@/components/Informacoes";
import Fundo from "../components/FundoComunidade"
import Post from "../components/Post";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { postsUser, postsCommunity, user, community } from "../lib/mock";

export default function Comunidade(){
     // junta os posts e ordena por data (mais recente primeiro)
      const feedPosts = [...postsUser, ...postsCommunity].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    return(
        <>
        <header className="w-full h-auto flex mx-auto py-4 pb-4 bg-slate-100">
            <Fundo/>
        </header>

              <main className="bg-slate-100 w-full min-h-screen flex justify-center items-start flex-row p-4">
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
                              ? user.name
                              : community.name
                          }
                          createdAt={post.createdAt}
                          avatar={
                            post.type === "user"
                              ? user.avatar
                              : community.image
                          }
                          title={post.title}
                          text={post.text}
                          image={post.image}
                        />
                      ))}
                    </div>
                  </div>
                  {/*BARRA LATERAL*/}
                  <div className="mt-10">
                    <Informacoes 
                      name={community.name}
                      description={community.description}
                      createdAt={community.createdAt}
                      visibility={community.visibility}
                      members={community.members}
                      rules={community.rules}
                    />
                  </div>
                </div>

              </main>
        </>
    );
} 