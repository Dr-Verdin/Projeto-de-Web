import AddImage from "../components/AddImage";
import AddText from "../components/AddText";

export default function Create({ onClose }: { onClose: () => void }) {
    return (
        // 1. Div externa: Apenas o fundo escuro e o scroll (overflow-y-auto)
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
            
            {/* 2. Div do meio: É ELA que garante que o topo nunca seja cortado (min-h-full) */}
            <div className="flex min-h-full items-center justify-center p-4">
                
                {/* 3. A caixa branca do Modal (mantendo o items-stretch para alinhar o botão) */}
                <div 
                    className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-stretch gap-6 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Coluna da Esquerda (Imagem) */}
                    <div className="flex-1 flex flex-col min-w-0 w-full">
                        <AddImage />
                    </div>
                    
                    {/* Coluna da Direita (Textos + Botão) */}
                    <div className="flex-1 flex flex-col min-w-0 w-full">
                        <AddText />
                        
                        {/* mt-auto para colar o botão lá embaixo na mesma reta */}
                        <div className="w-full flex justify-end mt-auto pt-6 md:pt-0">
                            <button className="px-6 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-colors">
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}