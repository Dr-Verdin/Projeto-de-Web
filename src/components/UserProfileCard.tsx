import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

type Props = {
  user: any;
  mobile?: boolean;
  isOwnProfile?: boolean;
  postCount?: number;
  onFollowChange?: (following: boolean) => void;
};

export function UserProfileCard({
  user,
  mobile = false,
  isOwnProfile = true,
  postCount,
  onFollowChange,
}: Props) {
  const { user: loggedUser } = useAuth();
  const loggedUserId = loggedUser?.id ?? loggedUser?.sub;

  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // followers/following podem vir como array (legado), número, ou _count do Prisma
  const followersCount = user._count?.followers
    ?? (Array.isArray(user.followers) ? user.followers.length : (user.followers ?? 0));
  const followingCount = user._count?.following
    ?? (Array.isArray(user.following) ? user.following.length : (user.following ?? 0));

  // contagens locais para atualizar otimisticamente
  const [localFollowers, setLocalFollowers] = useState(followersCount);

  useEffect(() => {
    setLocalFollowers(
      user._count?.followers
        ?? (Array.isArray(user.followers) ? user.followers.length : (user.followers ?? 0)),
    );
  }, [user.followers, user._count]);

  // busca o status de follow ao montar (só para perfis de outros usuários)
  useEffect(() => {
    if (isOwnProfile || !loggedUserId || !user.id) return;
    userService
      .getFollowStatus(user.id, loggedUserId)
      .then((res) => setFollowing(res.following))
      .catch(() => {});
  }, [user.id, loggedUserId, isOwnProfile]);

  async function handleFollow() {
    if (!loggedUserId || loadingFollow) return;
    setLoadingFollow(true);
    const wasFollowing = following;
    // otimista
    setFollowing(!wasFollowing);
    setLocalFollowers((n) => (wasFollowing ? n - 1 : n + 1));
    try {
      const res = await userService.toggleFollow(user.id, loggedUserId);
      setFollowing(res.following);
      setLocalFollowers((n) =>
        res.following !== wasFollowing
          ? res.following
            ? n  // já incrementamos
            : n  // já decrementamos
          : wasFollowing
          ? n + 1   // reverte decremento
          : n - 1,  // reverte incremento
      );
      onFollowChange?.(res.following);
    } catch {
      // reverte em caso de erro
      setFollowing(wasFollowing);
      setLocalFollowers((n) => (wasFollowing ? n + 1 : n - 1));
    } finally {
      setLoadingFollow(false);
    }
  }

  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User",
    )}&background=e1903e&color=fff&size=200`;

  const studyTime = user.studyTime ?? 0;

  /* ── MOBILE ── */
  if (mobile) {
    return (
      <div className="w-full px-4 pt-4 pb-3 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <img
              src={avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-[#efce7b]"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div>
              <p className="text-base font-bold text-gray-900 leading-tight">
                {user.name || "Novo usuário"}
                {user.pronoun && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {user.pronoun}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user.username || "@user"}</p>
            </div>

            <div className="flex gap-5 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{postCount ?? 0}</span>
                <span className="text-gray-500 text-xs">posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{localFollowers}</span>
                <span className="text-gray-500 text-xs">seguidores</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{followingCount}</span>
                <span className="text-gray-500 text-xs">seguindo</span>
              </div>
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {user.bio}
          </p>
        )}

        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            disabled={loadingFollow}
            className={`w-full py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${
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

  /* ── DESKTOP ── */
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

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{localFollowers}</span>
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

      {!isOwnProfile && (
        <button
          onClick={handleFollow}
          disabled={loadingFollow}
          className={`mt-4 w-full py-2 rounded-full text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${
            following
              ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
              : "bg-[#b7bb86] text-white hover:bg-[#e1903e]"
          }`}
        >
          {following ? "Seguindo" : "Seguir"}
        </button>
      )}

      {user.bio && (
        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio}
        </p>
      )}
    </div>
  );
}
