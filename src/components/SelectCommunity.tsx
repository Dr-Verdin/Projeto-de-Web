import { useState, useEffect } from "react";
import { IconArrowLeft, IconSearch, IconCheck } from "@tabler/icons-react";
import { communityService, type Community } from "../services/communityService";

interface SelectCommunityProps {
    onBack: () => void;
    onPublish: (communityId: string) => void;
    publishing?: boolean;
    publishError?: string;
    initialSelectedId?: string;
}

export default function SelectCommunity({ onBack, onPublish, publishing, publishError, initialSelectedId }: SelectCommunityProps) {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
    const [communities, setCommunities] = useState<Community[]>([]);

    useEffect(() => {
        communityService.getAll().then(setCommunities).catch(() => {});
    }, []);

    function normalize(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    const filteredCommunities = communities.filter((c) =>
        normalize(c.name).includes(normalize(query))
    );

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* CABEÇALHO */}
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

            {/* BUSCA */}
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

            {/* GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                {filteredCommunities.length > 0 ? (
                    filteredCommunities.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all relative group ${
                                selectedId === c.id
                                    ? "bg-[#efce7b]/10 border-2 border-[#efce7b]"
                                    : "border-2 border-transparent hover:bg-gray-50"
                            }`}
                        >
                            {selectedId === c.id && (
                                <span className="absolute top-1 right-1 text-[#efce7b] bg-white rounded-full animate-in zoom-in duration-200 z-10 shadow-sm">
                                    <IconCheck size={16} />
                                </span>
                            )}
                            <img
                                src={c.image || `https://ui-avatars.api/?name=${encodeURIComponent(c.name)}&background=b7bb86&color=fff&size=64`}
                                alt={c.name}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                                {c.name}
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full text-center p-4 text-sm text-gray-500 mt-5">
                        {communities.length === 0 ? "Carregando..." : "Nenhuma comunidade encontrada."}
                    </div>
                )}
            </div>

            {/* PUBLICAR */}
            <div className="w-full flex flex-col items-end gap-2 mt-4 border-t border-gray-100 pt-4 shrink-0 min-h-[60px]">
                {publishError && (
                    <p className="text-sm text-red-500 font-medium w-full text-right">{publishError}</p>
                )}
                <button
                    onClick={() => selectedId && onPublish(selectedId)}
                    disabled={!selectedId || publishing}
                    className={`w-full sm:w-auto px-8 py-2.5 font-medium rounded-full transition-all duration-200 ${
                        selectedId && !publishing
                            ? "bg-[#efce7b] hover:bg-[#e63946] text-white animate-in zoom-in-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {publishing ? "Publicando..." : "Publicar"}
                </button>
            </div>
        </div>
    );
}
