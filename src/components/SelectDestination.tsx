import { useState } from "react";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

interface SelectDestinationProps {
    onBack: () => void;
    onPublishPost: () => void;
    onAdvanceCommunity: () => void;
}

export default function SelectDestination({ onBack, onPublishPost, onAdvanceCommunity }: SelectDestinationProps) {
    // Estado para controlar qual opção está selecionada
    const [selectedOption, setSelectedOption] = useState<'post' | 'community' | null>(null);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={onBack}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    title="Voltar"
                >
                    <IconArrowLeft size={20} />
                </button>
                <h3 className="text-lg md:text-xl font-medium text-gray-800">Onde você deseja publicar?</h3>
            </div>

            {/* Opções de Seleção */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch py-4">
                {/* CARD POST */}
                <button 
                    onClick={() => setSelectedOption('post')}
                    className={`w-full sm:w-1/2 flex flex-col items-center justify-center gap-3 p-8 border-2 rounded-xl transition-all group relative ${
                        selectedOption === 'post' 
                            ? 'border-[#efce7b] bg-[#efce7b]/5' 
                            : 'border-gray-200 hover:border-[#efce7b] hover:bg-[#efce7b]/10'
                    }`}
                >
                    {selectedOption === 'post' && (
                        <span className="absolute top-3 right-3 text-[#efce7b] animate-in fade-in zoom-in duration-200">
                            <IconCheck size={20} />
                        </span>
                    )}
                    <span className={`text-2xl font-bold transition-colors ${
                        selectedOption === 'post' ? 'text-[#efce7b]' : 'text-gray-700 group-hover:text-[#efce7b]'
                    }`}>
                        Post
                    </span>
                    <span className="text-sm text-gray-500 text-center">
                        Publicar no seu perfil para todos os seus seguidores verem.
                    </span>
                </button>
                
                {/* CARD COMUNIDADE */}
                <button 
                    onClick={() => setSelectedOption('community')}
                    className={`w-full sm:w-1/2 flex flex-col items-center justify-center gap-3 p-8 border-2 rounded-xl transition-all group relative ${
                        selectedOption === 'community' 
                            ? 'border-[#efce7b] bg-[#efce7b]/5' 
                            : 'border-gray-200 hover:border-[#efce7b] hover:bg-[#efce7b]/10'
                    }`}
                >
                    {selectedOption === 'community' && (
                        <span className="absolute top-3 right-3 text-[#efce7b] animate-in fade-in zoom-in duration-200">
                            <IconCheck size={20} />
                        </span>
                    )}
                    <span className={`text-2xl font-bold transition-colors ${
                        selectedOption === 'community' ? 'text-[#efce7b]' : 'text-gray-700 group-hover:text-[#efce7b]'
                    }`}>
                        Comunidade
                    </span>
                    <span className="text-sm text-gray-500 text-center">
                        Compartilhar esta publicação dentro de uma comunidade específica.
                    </span>
                </button>
            </div>

            {/* Rodapé Condicional com os botões de ação */}
            <div className="w-full flex justify-end mt-4 border-t border-gray-100 pt-4 shrink-0 min-h-[60px]">
                {selectedOption === 'post' && (
                    <button 
                        onClick={onPublishPost}
                        className="w-full sm:w-auto px-8 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-all animate-in fade-in zoom-in-95 duration-200"
                    >
                        Publicar
                    </button>
                )}
                
                {selectedOption === 'community' && (
                    <button 
                        onClick={onAdvanceCommunity}
                        className="w-full sm:w-auto px-8 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-all animate-in fade-in zoom-in-95 duration-200"
                    >
                        Avançar
                    </button>
                )}
            </div>
        </div>
    );
}