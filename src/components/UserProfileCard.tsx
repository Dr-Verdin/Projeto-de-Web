import { useState } from "react";
import type { User } from "../types/User";

type Props = {
  user: User;
  mobile?: boolean;
  isOwnProfile?: boolean;
  postCount?: number;
};

export function UserProfileCard({ user, mobile = false, isOwnProfile = true, postCount }: Props) {
  const [following, setFollowing] = useState(false);

  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User",
    )}&background=e1903e&color=fff&size=200`;

  const followers = user.followers ?? 0;
  const followingCount = user.following ?? 0;
  const studyTime = user.studyTime ?? 0;

  function handleFollow() {
    setFollowing((v) => !v);
    // TODO: chamar API de follow quando existir
    // if (!following) await followService.follow(user.id);
    // else await followService.unfollow(user.id);
  }

  /* ── MOBILE: layout estilo Instagram ── */
  if (mobile) {
    return (
      <div className="w-full px-4 pt-4 pb-3 flex flex-col gap-3">

        {/* LINHA 1: avatar + stats */}
        <div className="flex items-center gap-4">
          {/* avatar */}
          <div className="shrink-0">
            <img
              src={avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-[#efce7b]"
            />
          </div>

          {/* nome + pronome + stats */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div>
              <p className="text-base font-bold text-gray-900 leading-tight">
                {user.name || "Novo usuário"}
                {user.pronoun && (
                  <span className="text-sm font-normal text-gray-500 ml-2">{user.pronoun}</span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user.username || "@user"}</p>
            </div>

            {/* stats em linha */}
            <div className="flex gap-5 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{postCount ?? 0}</span>
                <span className="text-gray-500 text-xs">posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{followers}</span>
                <span className="text-gray-500 text-xs">seguidores</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{followingCount}</span>
                <span className="text-gray-500 text-xs">seguindo</span>
              </div>
            </div>
          </div>
        </div>

        {/* bio */}
        {user.bio && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {user.bio}
          </p>
        )}

        {/* LINHA 4: botão seguir (outros perfis) */}
        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className={`w-full py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              following
                ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500"
                : "bg-[#b7bb86] text-white hover:bg-[#e1903e]"
            }`}
          >
            {following ? "Seguindo" : "Seguir"}
          </button>
        )}
      </div>
    );
  }

  /* ── DESKTOP: layout vertical ── */
  return (
    <div className="w-full rounded-2xl bg-gray-50 p-4 flex flex-col items-center text-center">
      <img
        src={avatar}
        alt={user.name}
        className="w-40 h-40 object-cover rounded-full mb-4
                   animate-[spin_8s_linear_infinite]
                   ring-4 ring-white shadow-md"
      />

      <h2 className="text-xl font-semibold text-gray-900">
        {user.name || "Novo usuário"}
      </h2>

      <p className="text-sm mt-1">
        <span className="text-gray-600 font-medium">{user.username || "@user"}</span>
        {user.pronoun && <span className="text-gray-400"> {user.pronoun}</span>}
      </p>

      {/* stats */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{followers}</span>
          <span className="text-gray-500 text-xs">seguidores</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{followingCount}</span>
          <span className="text-gray-500 text-xs">seguindo</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{studyTime}h</span>
          <span className="text-gray-500 text-xs">estudadas</span>
        </div>
      </div>

      {/* botão seguir — só para outros perfis */}
      {!isOwnProfile && (
        <button
          onClick={handleFollow}
          className={`mt-4 w-full py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
            following
              ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
              : "bg-[#b7bb86] text-white hover:bg-[#e1903e]"
          }`}
        >
          {following ? "Seguindo" : "Seguir"}
        </button>
      )}

      {/* bio */}
      {user.bio && (
        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio}
        </p>
      )}
    </div>
  );
}
