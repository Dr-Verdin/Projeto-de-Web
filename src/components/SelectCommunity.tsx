import { useState } from "react";
import { IconArrowLeft, IconSearch, IconCheck } from "@tabler/icons-react";
// Atualize o caminho da importação de acordo com o seu projeto
import { communities } from "../lib/mock"; 

interface SelectCommunityProps {
    onBack: () => void;
    onPublish: (communityId: string) => void;
}

export default function SelectCommunity({ onBack, onPublish }: SelectCommunityProps) {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Função de normalização idêntica à do ChatSidebar
    function normalize(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Filtra as comunidades transformando o objeto em array
    const filteredCommunities = Object.values(communities).filter((c) =>
        normalize(c.name).includes(normalize(query))
    );

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* --- CABEÇALHO --- */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={onBack}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    title="Voltar"
                >
                    <IconArrowLeft size={20} />
                </button>
                <h3 className="text-lg md:text-xl font-medium text-gray-800">Escolha a Comunidade</h3>
            </div>

            {/* --- BARRA DE PESQUISA --- */}
            <div className="relative">
                <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar comunidade..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#efce7b]/40 focus:border-[#efce7b] transition-all"
                />
            </div>

            {/* --- GRID DE COMUNIDADES --- */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                {filteredCommunities.length > 0 ? (
                    filteredCommunities.map((community) => (
                        <button
                            key={community.communityId}
                            onClick={() => setSelectedId(community.communityId)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all relative group ${
                                selectedId === community.communityId
                                    ? "bg-[#efce7b]/10 border-2 border-[#efce7b]"
                                    : "border-2 border-transparent hover:bg-gray-50"
                            }`}
                        >
                            {/* Ícone de check se estiver selecionado */}
                            {selectedId === community.communityId && (
                                <span className="absolute top-1 right-1 text-[#efce7b] bg-white rounded-full animate-in zoom-in duration-200 z-10 shadow-sm">
                                    <IconCheck size={16} />
                                </span>
                            )}
                            
                            {/* Foto e Nome da comunidade*/}
                            <img 
                                src={community.avatar} 
                                alt={community.name} 
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                                {community.name}
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full text-center p-4 text-sm text-gray-500 mt-5">
                        Nenhuma comunidade encontrada.
                    </div>
                )}
            </div>
            {/*Publica quando seleciona a comunidade*/}
            <div className="w-full flex justify-end mt-4 border-t border-gray-100 pt-4 shrink-0 min-h-[60px]">
                <button 
                    onClick={() => selectedId && onPublish(selectedId)}
                    disabled={!selectedId}
                    className={`w-full sm:w-auto px-8 py-2.5 font-medium rounded-full transition-all duration-200 ${
                        selectedId 
                            ? "bg-[#efce7b] hover:bg-[#e63946] text-white animate-in zoom-in-95" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    Publicar
                </button>
            </div>
        </div>
    );
}