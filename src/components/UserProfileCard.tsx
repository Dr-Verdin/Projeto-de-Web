import type { User } from "../types/User";

type Props = {
  user: User;
  mobile?: boolean;
};

export function UserProfileCard({ user, mobile = false }: Props) {
  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User",
    )}&background=e1903e&color=fff&size=200`;

  const followers  = user.followers  ?? 0;
  const following  = user.following  ?? 0;
  const studyTime  = user.studyTime  ?? 0;

  /* ── MOBILE: layout horizontal compacto ── */
  if (mobile) {
    return (
      <div className="w-full rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        {/* avatar menor */}
        <img
          src={avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-[#efce7b]"
        />

        {/* info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900 truncate">
            {user.name || "Novo usuário"}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {user.username || "@user"}
            {user.pronoun ? <span className="text-gray-400"> · {user.pronoun}</span> : null}
          </p>

          {/* stats em linha */}
          <div className="flex gap-4 mt-2 text-xs">
            <span>
              <strong className="text-gray-800">{followers}</strong>{" "}
              <span className="text-gray-400">seguidores</span>
            </span>
            <span>
              <strong className="text-gray-800">{following}</strong>{" "}
              <span className="text-gray-400">seguindo</span>
            </span>
            <span>
              <strong className="text-gray-800">{studyTime}h</strong>{" "}
              <span className="text-gray-400">estudadas</span>
            </span>
          </div>
        </div>
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
        {user.pronoun && (
          <span className="text-gray-400"> {user.pronoun}</span>
        )}
      </p>

      {/* STATS */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{followers}</span>
          <span className="text-gray-500 text-xs">seguidores</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{following}</span>
          <span className="text-gray-500 text-xs">seguindo</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900">{studyTime}h</span>
          <span className="text-gray-500 text-xs">estudadas</span>
        </div>
      </div>

      {/* BIO */}
      {user.bio && (
        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio}
        </p>
      )}
    </div>
  );
}
