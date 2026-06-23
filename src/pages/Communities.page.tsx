import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IconArrowLeft, IconUsers } from "@tabler/icons-react";
import { communities } from "../lib/mock";

export default function CommunitiesPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-lg text-gray-900">Comunidades</span>
        <div className="w-9" />
      </header>

      {/* CONTEÚDO */}
      <div className="flex-1 px-4 py-4 pb-24 flex flex-col gap-3">

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-1">
          Populares
        </p>

        {Object.values(communities).map((community) => (
          <Link
            key={community.communityId}
            to={`/comunidade/${community.communityId}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
          >
            {/* banner */}
            <div
              className="w-full h-24 bg-cover bg-center bg-gray-200"
              style={{ backgroundImage: community.background ? `url(${community.background})` : undefined }}
            />

            <div className="flex items-center gap-3 px-4 py-3">
              <img
                src={community.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=e1903e&color=fff`}
                alt={community.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white -mt-8 shrink-0 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm truncate">{community.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{community.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-gray-400">
                <IconUsers size={14} />
                <span className="text-xs">{community.members.toLocaleString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
