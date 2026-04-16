import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  IconHeart,
  IconMessageCircle,
  IconSend,
  IconBookmark,
  IconDots,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Post as PostType } from "../types/Post";
import { users, communities } from "../lib/mock";

export function Post({
  createdAt = "agora",
  avatar = "https://github.com/shadcn.png",
  image,
  title,
  text,
  type,
  userId,
  communityId,
}: PostType) {
  const displayName =
  type === "user"
    ? users[userId!]?.name
    : communities[communityId!]?.name;

  return (
    <div className="w-full flex flex-col gap-3 p-2 rounded-lg transition-colors duration-300 hover:bg-[#efce7b]/30">
      {/* HEADER */}
      <header className="w-full h-[42px] flex items-center gap-2 px-4">
        <Avatar className="w-[30px] h-[30px]">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback>CN</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>

        <Link
            to={
              type === "user"
                ? `/perfil/${userId}`
                : `/comunidade/${communityId}`
            }
            className="flex items-center"
          >
          <span className="text-slate-800 text-xs font-medium">
            {type === "user" ? "u/" + displayName : "c/" + displayName}
          </span>
        </Link>

        <span className="text-black text-xs font-thin">• {createdAt}</span>

        <div className="ml-auto flex items-center gap-2">
          <Button className="rounded-full px-2 h-5 text-xs text-white bg-[#b7bb86] hover:bg-[#e1903e]">
            seguir
          </Button>

          <Button className="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-transparent hover:bg-slate-300 text-slate-900">
            <IconDots size={18} />
          </Button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="w-full flex flex-col gap-2 px-4">
        {title && <h2 className="text-slate-900 font-bold text-lg">{title}</h2>}

        {text && (
          <div className="flex flex-col gap-1 text-slate-700 text-sm">
            <p>{text}</p>
            <button className="text-xs hover:text-slate-950 text-slate-600 w-fit">
              ver mais
            </button>
          </div>
        )}

        {image && (
          <div className="relative w-full h-[540px] overflow-hidden rounded-lg bg-black">
            <img
              src={image}
              alt="blur background"
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40"
            />

            <img
              src={image}
              alt="post"
              className="relative z-10 w-full h-full object-contain"
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-5">
          <button className="hover:text-[#e63946] transition-colors text-black">
            <IconHeart size={26} />
          </button>

          <button className="text-black">
            <IconMessageCircle size={26} />
          </button>

          <button className="text-black">
            <IconSend size={26} />
          </button>
        </div>

        <button className="text-black">
          <IconBookmark size={26} />
        </button>
      </footer>
    </div>
  );
}
