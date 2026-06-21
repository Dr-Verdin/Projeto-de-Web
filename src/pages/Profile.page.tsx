import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfileCard } from "../components/UserProfileCard";
import { ProfileEditorModal } from "../components/ProfileEditorModal";
import { Post } from "../components/Post";
import { TaskChecklist } from "@/components/TaskChecklist";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import { posts, users } from "../lib/mock";

export default function Profile() {
  const { id } = useParams();
  const user = users[id!];
  const [profileUser, setProfileUser] = useState(user);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    setProfileUser(user);
  }, [user]);

  useEffect(() => {
    if (id) {
      setIsOwnProfile(localStorage.getItem("userId") === id);
    }
  }, [id]);

  if (!user) return <div>Usuário não encontrado</div>;

  const userPosts = posts
    .filter((post) => post.userId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  function handleSave(updatedUser: typeof user) {
    users[id!] = updatedUser;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setProfileUser(updatedUser);
    try {
      window.dispatchEvent(new CustomEvent("user-updated", { detail: { userId: id } }));
    } catch (e) {
      // ignore in non-browser env
    }
  }

  return (
    <main className="w-full min-h-screen p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="justify-center gap-8 relative">
          {/* POSTS */}
          <section className="min-w-0 max-w-2xl mx-auto">
            {/* PERFIL */}
            <aside className="shrink-0 absolute top-10 left-0 h-full">
              <div className="sticky top-4 space-y-6">
                <div className="flex flex-col gap-4">
                  <UserProfileCard
                    user={profileUser}
                    onEdit={isOwnProfile ? () => setEditorOpen((open) => !open) : undefined}
                    isEditing={editorOpen}
                  />
                </div>
                {isOwnProfile ? (
                  <ProfileEditorModal
                    open={editorOpen}
                    user={profileUser}
                    onSave={handleSave}
                    onClose={() => setEditorOpen(false)}
                  />
                ) : null}
              </div>
            </aside>

            {/* TASKS (direita) */}
            <aside className="shrink-0 absolute top-10 right-1 h-full">
              <div className="sticky top-4">
                <TaskChecklist />
              </div>
            </aside>
            {/* FILTROS */}
            <div className="h-11 flex items-center gap-4 px-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Posts</NavigationMenuTrigger>
                    <NavigationMenuTrigger>Comunidades</NavigationMenuTrigger>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* LISTA */}
            <div className="flex flex-col gap-6">
              {userPosts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
