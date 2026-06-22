{/*Para adicionar titulo e texto na publicação*/}
import { useState, type ChangeEvent } from "react";

export default function AddText() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => setTitle(event.target.value);
    const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value);

    return (
        <div className="flex flex-col gap-4 w-full flex-1">        
            
            {/* TÍTULO */}
            <div className="flex flex-col w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-md focus-within:ring-1 focus-within:ring-zinc-400 shrink-0">
                <label htmlFor="titleInput" className="text-xs md:text-sm text-slate-500 mb-1 font-medium">
                    Título*
                </label>
                <textarea
                    id="titleInput"
                    value={title}
                    onChange={handleTitleChange}
                    rows={1}
                    placeholder="Adicione um título"
                    className="w-full bg-transparent text-zinc-800 text-sm md:text-base placeholder:text-slate-400 focus:outline-none resize-none overflow-hidden"
                />
            </div>

            {/* CONTEÚDO / DESCRIÇÃO */}
            <div className="flex flex-col flex-1 w-full min-h-[8rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-md focus-within:ring-1 focus-within:ring-zinc-400">
                <label htmlFor="contentInput" className="text-xs md:text-sm text-slate-500 mb-1 font-medium">
                    Conteúdo
                </label>
                <textarea
                    id="contentInput"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Adicione uma descrição/conteúdo (opcional)"
                    className="w-full h-full bg-transparent text-zinc-800 text-sm md:text-base placeholder:text-slate-400 focus:outline-none resize-none overflow-y-auto"
                />
            </div>
            
        </div>
    );
}