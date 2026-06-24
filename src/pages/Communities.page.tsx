import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconArrowLeft, IconUsers } from "@tabler/icons-react";
import { communityService, type Community } from "../services/communityService";

export default function CommunitiesPage() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityService
      .getAll()
      .then(setCommunities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

        {loading && (
          <p className="text-xs text-gray-400 text-center py-8">Carregando...</p>
        )}

        {!loading && communities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏘️</p>
            <p className="text-sm">Nenhuma comunidade ainda</p>
          </div>
        )}

        {!loading && communities.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-1">
              Populares
            </p>

            {communities.map((c) => (
              <Link
                key={c.id}
                to={`/comunidade/${c.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
              >
                {/* banner */}
                <div
                  className="w-full h-24 bg-cover bg-center bg-gray-200"
                  style={{
                    backgroundImage: c.wallpaper ? `url(${c.wallpaper})` : undefined,
                    backgroundColor: c.wallpaper ? undefined : "#e5e7eb",
                  }}
                />

                <div className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={
                      c.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=b7bb86&color=fff&size=64`
                    }
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white -mt-8 shrink-0 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 text-sm truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-gray-400">
                    <IconUsers size={14} />
                    <span className="text-xs">{c._count.members.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
