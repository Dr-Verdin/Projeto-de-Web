import { IconPencil } from "@tabler/icons-react";
import { Button } from "./ui/button";
import type { User } from "../types/User";

type UserProfileCardProps = {
  user: User;
  onEdit?: () => void;
  isEditing?: boolean;
};

export function UserProfileCard({ user, onEdit, isEditing }: UserProfileCardProps) {
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
          {onEdit ? (
           <Button
            type="button"
            variant="ghost"
            className="h-auto w-auto p-0 text-gray-500 hover:bg-transparent hover:text-gray-700"
            onClick={onEdit}
            aria-label={isEditing ? "Fechar editor" : "Editar perfil"}
          >
            <IconPencil size={16} />
          </Button>
          ) : null}
        </div>

        <div className="flex justify-center gap-6 mt-3 text-sm">
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {user.followers}
            </span>{" "}
            <span className="text-gray-500">followers</span>
          </p>
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {user.following}
            </span>{" "}
            <span className="text-gray-500">following</span>
          </p>
          <p>
            <span className="flex flex-col font-semibold text-gray-900 cursor-pointer">
              {user.studyTime}h
            </span>{" "}
            <span className="flex flex-col text-gray-500">study time</span>
          </p>
        </div>

        <p className="text-gray-600 text-sm mt-4 text-left w-full leading-relaxed">
          {user.bio}
        </p>
      </div>
    </div>
  );
}
