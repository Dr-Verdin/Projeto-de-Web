import type { User } from "../types/User";

export function UserProfileCard({ user }: { user: User }) {
  return (
    <div className="w-[320px] shrink-0 shrink-0 p-4 rounded-xl bg-gray-50">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar}
          className="w-52 h-52 object-cover rounded-full mb-4 animate-[spin_8s_linear_infinite]"
        />

        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
        <p className="text-sm mt-1">
          <span className="text-gray-600 font-medium">{user.username}</span>{" "}
          <span className="text-gray-400">{user.pronoun}</span>
        </p>

        <div className="flex gap-6 mt-3 text-sm">
          <p>
            <span className="font-semibold text-gray-900 cursor-pointer">
              {user.followers}
            </span>{" "}
            <span className="text-gray-500">followers</span>
          </p>
          <p>
            <span className="font-semibold text-gray-900 cursor-pointer">
              {user.following}
            </span>{" "}
            <span className="text-gray-500">following</span>
          </p>
        </div>

        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio}
        </p>
      </div>
    </div>
  );
}
