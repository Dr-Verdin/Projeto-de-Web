import type { User } from "../types/User";

export function UserProfileCard({ user }: { user: User }) {
  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User",
    )}&background=6366f1&color=fff`;

  const followers = user.followers ?? 0;
  const following = user.following ?? 0;
  const studyTime = user.studyTime ?? 0;

  return (
    <div className="max-h-2xl w-72 shrink-0 p-4 rounded-xl bg-gray-50">
      <div className="flex flex-col items-center text-center">
        <img
          src={avatar}
          className="w-52 h-52 object-cover rounded-full mb-4 animate-[spin_8s_linear_infinite]"
        />

        <h2 className="text-xl font-semibold text-gray-900">
          {user.name || "Novo usuário"}
        </h2>

        <p className="text-sm mt-1">
          <span className="text-gray-600 font-medium">
            {user.username || "@user"}
          </span>{" "}
          <span className="text-gray-400">{user.pronoun || ""}</span>
        </p>

        {/* STATS */}
        <div className="flex justify-center gap-6 mt-3 text-sm">
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {followers}
            </span>
            <span className="text-gray-500">
              {followers === 1 ? "follower" : "followers"}
            </span>
          </p>

          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {following}
            </span>
            <span className="text-gray-500">following</span>
          </p>

          <p>
            <span className="flex flex-col font-semibold text-gray-900">
              {studyTime}h
            </span>
            <span className="text-gray-500">study time</span>
          </p>
        </div>

        {/* BIO */}
        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio || "Bio..."}
        </p>
      </div>
    </div>
  );
}
