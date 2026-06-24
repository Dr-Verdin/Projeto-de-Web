{/*Para adicionar o nome e a descrição da comunidade*/}

import { type ChangeEvent } from "react";

interface AddTextCommunityProps {
    communityName: string;
    setCommunityName: (name: string) => void;
    description: string;
    setDescription: (desc: string) => void;
}

export default function AddTextCommunity({ communityName, setCommunityName, description, setDescription }: AddTextCommunityProps) {

    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCommunityName(event.target.value); // Atualiza o estado lá no Pai
    };

    const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">        
            <div className="flex flex-col w-full h-[5rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-md focus-within:ring-1 focus-within:ring-zinc-400">
                <label htmlFor="titleInput" className="text-sm text-slate-500 mb-1">
                    Nome*
                </label>
                
                <textarea
                    id="titleInput"
                    value={communityName} // Agora usa a prop certinha
                    onChange={handleTitleChange}
                    placeholder="Adicione um nome à comunidade"
                    className="w-full bg-transparent text-zinc-800 text-md placeholder:text-slate-400 focus:outline-none resize-none overflow-y-auto"
                />
            </div>

            <div className="flex flex-col w-full h-[10rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-md focus-within:ring-1 focus-within:ring-zinc-400">
                <label htmlFor="contentInput" className="text-sm text-slate-500 mb-1">
                    Descrição*
                </label>
                
                <textarea
                    id="contentInput"
                    value={description}
                    onChange={handleContentChange}
                    placeholder="Adicione a descrição da comunidade"
                    className="w-full h-full bg-transparent text-zinc-800 text-md placeholder:text-slate-400 focus:outline-none resize-none overflow-y-auto"
                />
            </div>
        </div>
    );
}