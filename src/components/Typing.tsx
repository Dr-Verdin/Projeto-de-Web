{/*Para digitar mensagem*/}

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { IconMoodSmile, IconPhoto, IconVideo, IconSend, IconX } from "@tabler/icons-react";

export default function Typing() {
    const [title, setTitle] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);

    // Referências
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null); // Adicionamos a referência do textarea!

    const commonEmojis = ["😀", "😂", "🥰", "😎", "🤔", "🙌", "👍", "🔥", "✨", "🎉", "❤️", "👀"];

    // Função que recalcula a altura do textarea
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Zera a altura para o navegador recalcular
            textarea.style.height = `${textarea.scrollHeight}px`; // Define a altura exata do texto
        }
    };

    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(event.target.value);
        adjustTextareaHeight(); // Chama a função sempre que você digita
    };

    const addEmoji = (emoji: string) => {
        setTitle((prev) => prev + emoji);
        setShowEmojis(false);
    };

    // Garante que a caixa ajuste o tamanho se você apagar tudo ou enviar a mensagem
    useEffect(() => {
        adjustTextareaHeight();
    }, [title]);

    const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            event.target.value = ''; 
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full relative">        
            
            {/* MENU FLUTUANTE DE EMOJIS */}
            {showEmojis && (
                <div className="absolute bottom-16 left-0 md:left-4 bg-white border border-gray-200 shadow-lg rounded-xl p-3 flex flex-wrap w-64 max-w-[90vw] gap-2 z-50">
                    <div className="w-full flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">Emojis</span>
                        <button onClick={() => setShowEmojis(false)} className="text-gray-400 hover:text-red-500">
                            <IconX size={16} />
                        </button>
                    </div>
                    {commonEmojis.map((emoji) => (
                        <button 
                            key={emoji} 
                            onClick={() => addEmoji(emoji)}
                            className="text-xl hover:bg-gray-100 p-1 rounded-md transition-colors"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* INPUTS INVISÍVEIS PARA ARQUIVOS */}
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleFileSelected} className="hidden" />
            <input type="file" accept="video/*" ref={videoInputRef} onChange={handleFileSelected} className="hidden" />

            {/* CAIXA EXTERNA DE DIGITAÇÃO */}
            <div className="flex items-end w-full min-h-[3rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-3xl focus-within:ring-1 focus-within:ring-zinc-400 gap-3">
                
                {/* BOTÃO DE EMOJI */}
                <button 
                    onClick={() => setShowEmojis(!showEmojis)}
                    className={`mb-0.5 ${showEmojis ? 'text-[#e1903e]' : 'text-zinc-400'} hover:text-zinc-600 transition-colors shrink-0`}
                >
                    <IconMoodSmile size={24} stroke={1.5} />
                </button>

                {/* INPUT DE TEXTO */}
                <textarea
                    id="titleInput"
                    ref={textareaRef} 
                    value={title}
                    rows={1} 
                    onChange={handleTitleChange}
                    placeholder="Envie uma mensagem..."
                    className="
                        flex-1 
                        bg-transparent 
                        text-zinc-800 text-md
                        placeholder:text-slate-400 
                        focus:outline-none 
                        resize-none 
                        max-h-[10rem] overflow-y-auto /* Limite de altura: depois de 150px ele ganha barra de rolagem */
                        scrollbar-thin scrollbar-thumb-gray-300 /* Deixa a barra de rolagem mais bonita se o Tailwind Scrollbar estiver instalado */
                    "
                />

                {/* BOTÃO DE IMAGEM */}
                <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="mb-0.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                >
                    <IconPhoto size={24} stroke={1.5} />
                </button>

                {/* BOTÃO DE VÍDEO */}
                <button 
                    onClick={() => videoInputRef.current?.click()}
                    className="mb-0.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                >
                    <IconVideo size={24} stroke={1.5} />
                </button>

                {/* BOTÃO DE ENVIAR */}
                {title.trim().length > 0 && (
                    <button 
                        onClick={() => {
                            setTitle(""); 
                        }}
                        className="mb-0.5 text-[#e1903e] hover:scale-110 transition-all shrink-0"
                    >
                        <IconSend size={24} stroke={1.5} />
                    </button>
                )}

            </div>            
        </div>
    );
}