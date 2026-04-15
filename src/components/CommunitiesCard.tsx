import ButtonCommunity from "./ButtonCommunity";
import { communities } from "../lib/mock";
import { Link } from "react-router-dom";

export function CommunitiesCard() {
  return (
    <section className="w-[320px] self-start min-h-full">
      <div className="sticky top-8">
        <div className="bg-gray-50 rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
          <div className="text-sm font-semibold tracking-wide text-[#e63946]">
            Comunidades populares
          </div>

          <div className="flex flex-col gap-2 pr-1">
            {Object.values(communities).map((community) => (
              <Link
                key={community.communityId}
                to={`/comunidade/${community.communityId}`}
              >
                <ButtonCommunity
                  
                  nome={community.name}
                  inscritos={community.members.toLocaleString("pt-BR")}
                  imagem={community.avatar || ""}
                />
              </Link>
            ))}
          </div>

          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium transition text-left">
            Ver mais →
          </button>
        </div>
      </div>
    </section>
  );
}
