import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconSettings } from "@tabler/icons-react";
import { CommunitySettingsModal } from "./CommunitySettingsModal";
import type { Community } from "../services/communityService";

type Props = {
  community: Community;
  isAdmin?: boolean;
  isMember?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onCommunityUpdate?: (updated: Community) => void;
  onDelete?: () => void;
};

export default function WallpaperCommunity({
  community,
  isAdmin = false,
  isMember = false,
  onJoin,
  onLeave,
  onCommunityUpdate,
  onDelete,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const avatarSrc =
    community.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=b7bb86&color=fff&size=128`;

  return (
    <>
      <div className="w-full">
        {/* Banner */}
        <div className="w-full aspect-[1072/136] overflow-hidden flex justify-center items-center rounded-lg bg-gray-200">
          {community.wallpaper ? (
            <img src={community.wallpaper} alt={community.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#b7bb86]/40 to-[#efce7b]/40" />
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-row justify-between gap-2 mt-1">
          {/* LADO ESQUERDO — avatar + nome + botões */}
          <div className="flex flex-row items-end gap-3">
            <div className="-mt-8 sm:-mt-10 ml-2 shrink-0">
              <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-md">
                <AvatarImage src={avatarSrc} alt={community.name} />
                <AvatarFallback>{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            {/* nome + botões alinhados */}
            <div className="flex items-center gap-4 pb-1">
              <h1 className="text-xl sm:text-[28px] font-bold text-[#1c1c1c] leading-tight">
                {community.name}
              </h1>

              {/* join/leave — para não-admins */}
              {!isAdmin && (
                <button
                  onClick={isMember ? onLeave : onJoin}
                  className={`flex justify-center items-center px-5 py-1.5 rounded-full text-sm font-semibold transition-colors shrink-0 ${
                    isMember
                      ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                      : "bg-[#b7bb86] text-white border border-[#b7bb86] hover:bg-[#e1903e] hover:border-[#e1903e]"
                  }`}
                >
                  {isMember ? "Sair" : "Join"}
                </button>
              )}

              {/* configurações — só para admin */}
              {isAdmin && (
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 bg-gray-50 border border-gray-300 hover:border-[#b7bb86] hover:text-[#b7bb86] transition-colors shrink-0"
                  title="Configurações da comunidade"
                >
                  <IconSettings size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {settingsOpen && (
        <CommunitySettingsModal
          community={community}
          onClose={() => setSettingsOpen(false)}
          onSaved={(updated) => {
            onCommunityUpdate?.(updated);
            setSettingsOpen(false);
          }}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
