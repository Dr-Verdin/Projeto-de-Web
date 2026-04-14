import UserProfileCard from "../components/UserProfileCard"
import Post from "../components/Post"
import { Checkbox } from "@/components/ui/checkbox";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { posts, users, communities } from "../lib/mock";
import { useParams } from "react-router-dom";

export default function Profile() {
  // junta os posts e ordena por data (mais recente primeiro)
  const { id } = useParams();
  const user = users[id!];

  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

  const userPosts = posts
    .filter((post) =>
      post.userId === id
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  return (
    <div className="flex">

      <div className="flex-1 p-6 flex gap-6 ml-100">
        
        {/* PERFIL */}
        <UserProfileCard user={user} />

        {/* POSTS */}
        <div className="w-[732px] min-h-screen flex items-center flex-col gap-[10px]">
          
          <div className="w-[732px] h-[40px] Post-black flex justify-start items-center gap-[20px] pl-[16px] pr-[16px]">
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
            {userPosts.map((post) => (
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

        <Checkbox/>

      </div>
    </div>
  );
}
