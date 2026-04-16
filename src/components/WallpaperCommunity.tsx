import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconPlus } from "@tabler/icons-react";
import type { Community } from "../types/Community";

type WallpaperCommunityProps = {
  community: Community;
};

export default function WallpaperCommunity({ community }: WallpaperCommunityProps) {
  return (
    <div className="w-full mx-auto">
      
      {/* Banner */}
      <div className="w-full aspect-[1072/136] overflow-hidden flex justify-center items-center rounded-lg bg-gray-200">
        <img
          src={community.background}
          alt={community.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:gap-1 gap-4">

        {/* LADO ESQUERDO */}
        <div className="flex flex-row items-end gap-3">
          <div className="-mt-8 sm:-mt-10 ml-2">
            <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-md">
              <AvatarImage src={community.avatar} alt={community.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="pb-1">
            <h1 className="text-xl sm:text-[28px] font-bold text-[#1c1c1c]">
              {community.name}
            </h1>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex items-center gap-2 mt-4 sm:mt-6">
            <button className="px-6 py-1.5 rounded-full text-white bg-[#5C8001] border border-[#5C8001] hover:bg-[#7CB518] hover:border-[#7CB518] transition-colors">
                seguir
            </button>

            <button className="w-12 h-12 flex items-center justify-center rounded-full text-white bg-[#5C8001] border border-[#5C8001] hover:bg-[#7CB518] hover:border-[#7CB518] transition-colors">
                <IconPlus size={24} />
            </button>
        </div>

      </div>
    </div>
  );
}
