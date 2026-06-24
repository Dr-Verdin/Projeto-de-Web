import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { communityService, type Community } from "../services/communityService";
import { IconUsers, IconX } from "@tabler/icons-react";

function CommunityRow({ c, onClick }: { c: Community; onClick?: () => void }) {
  return (
    <Link
      to={`/comunidade/${c.id}`}
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors"
    >
      <img
        src={
          c.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=b7bb86&color=fff&size=64`
        }
        alt={c.name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
        <div className="flex items-center gap-1 text-gray-400">
          <IconUsers size={11} />
          <span className="text-xs">{c._count.members.toLocaleString("pt-BR")} membros</span>
        </div>
      </div>
    </Link>
  );
}

export function CommunitiesCard() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    communityService.getAll().then(setCommunities).catch(() => {});
  }, []);

  // mobile: navega para /comunidades; desktop: abre modal
  function handleVerMais() {
    if (window.innerWidth < 768) {
      navigate("/comunidades");
    } else {
      setModalOpen(true);
    }
  }

  const top = communities.slice(0, 5);

  return (
    <>
      <div className="bg-gray-50 rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
        <div className="text-sm font-semibold tracking-wide text-[#e1903e]">
          Comunidades populares
        </div>

        <div className="flex flex-col gap-1">
          {top.map((c) => (
            <CommunityRow key={c.id} c={c} />
          ))}

          {communities.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">Nenhuma comunidade ainda</p>
          )}
        </div>

        {communities.length > 5 && (
          <button
            onClick={handleVerMais}
            className="text-sm text-[#e1903e] hover:underline font-medium text-left"
          >
            Ver mais ({communities.length - 5} restantes) →
          </button>
        )}
        {communities.length > 0 && communities.length <= 5 && (
          <button
            onClick={handleVerMais}
            className="text-sm text-[#e1903e] hover:underline font-medium text-left"
          >
            Ver todas →
          </button>
        )}
      </div>

      {/* MODAL — renderizado no body via portal para não ser afetado pelo sticky/overflow do aside */}
      {modalOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center px-4"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <h2 className="font-bold text-gray-900">
                  Todas as comunidades{" "}
                  <span className="text-sm font-normal text-gray-400">({communities.length})</span>
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IconX size={18} className="text-gray-500" />
                </button>
              </div>

              {/* lista */}
              <div className="overflow-y-auto flex-1 px-3 py-3 flex flex-col gap-1">
                {communities.map((c) => (
                  <CommunityRow key={c.id} c={c} onClick={() => setModalOpen(false)} />
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
