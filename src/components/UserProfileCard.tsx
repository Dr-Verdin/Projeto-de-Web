import type { User } from "../types/User";

type UserProfileCardProps = {
  user: User;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="max-h-2xl w-72 shrink-0 p-4 rounded-xl bg-gray-50">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar}
          className="w-52 h-52 object-cover rounded-full mb-4 animate-[spin_8s_linear_infinite]"
        />

        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
            <span>{user.username}</span>
            <span className="text-gray-400">{user.pronoun}</span>
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-3 text-sm">
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {user.followers}
            </span>{" "}
            <span className="text-gray-500">seguidores</span>
          </p>
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {user.following}
            </span>{" "}
            <span className="text-gray-500">seguindo</span>
          </p>
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {user.studyTime}h
            </span>{" "}
            <span className="flex flex-col text-gray-500">tempo estudado</span>
          </p>
        </div>

        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio}
        </p>
      </div>
    </div>
  );
}
