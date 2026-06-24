import { IconCalendarEvent, IconUsers } from "@tabler/icons-react";
import type { Community } from "../services/communityService";

type Props = Pick<Community, "name" | "description" | "createdAt" | "_count"> & {
  adminName?: string;
};

export function CommunityInfoCard({ name, description, createdAt, _count, adminName }: Props) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 p-4 flex flex-col gap-3 text-sm text-slate-700">
      <h2 className="font-bold text-base text-[#e1903e]">{name}</h2>

      {description && <p className="text-slate-600 leading-relaxed">{description}</p>}

      <div className="flex flex-col gap-2 text-slate-500">
        <span className="flex items-center gap-1.5 leading-none">
          <IconUsers size={14} className="shrink-0" />
          {_count.members.toLocaleString("pt-BR")} membros
        </span>

        <span className="flex items-center gap-1.5 leading-none">
          <IconCalendarEvent size={14} className="shrink-0" />
          Criada em{" "}
          {new Date(createdAt).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </span>

        {adminName && (
          <span className="text-xs text-slate-400">
            Admin: {adminName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{_count.posts} posts</span>
      </div>
    </div>
  );
}
