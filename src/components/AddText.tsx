import { useState, type ChangeEvent } from "react";

export default function AddText() {
    // Mudei o nome do estado para "title" para refletir a imagem
    const [title, setTitle] = useState("");

    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(event.target.value);
    };

    const[content, setContent] = useState("");
    const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full">        
            {/* 1. A CAIXA EXTERNA: Aqui é onde colocamos o fundo cinza, as bordas arredondadas e o padding */}
            <div className="
                flex flex-col /* Alinha os itens na vertical (um embaixo do outro) */
                w-full
                h-[5rem] /* Altura fixa para o exemplo, pode ser ajustada */
                px-4 py-2.5 /* Espaçamento interno para os textos não colarem nas bordas */
                bg-zinc-100 /* Cor de fundo cinza clara igual da imagem */
                border border-zinc-300
                rounded-md /* Bordas bem arredondadas */
                focus-within:ring-1 focus-within:ring-zinc-400 /* Adiciona o anel de foco na div quando o usuário clica no input */
            ">
                
                {/* 2. O TÍTULO: Texto menor, em cima do input */}
                <label 
                    htmlFor="titleInput" 
                    className="text-sm text-slate-500 mb-1"
                >
                    Título*
                </label>
                
                {/* 3. O INPUT DE VERDADE: Invisível, apenas para digitar */}
                <textarea
                    id="titleInput"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Adicione um título"
                    className="
                        w-full 
                        bg-transparent /* Fundo transparente para herdar o cinza da div pai */
                        text-zinc-800 text-md
                        placeholder:text-slate-400 /* Cor do placeholder suave */
                        focus:outline-none /* Remove aquela borda preta padrão do navegador */
                        resize-none /* Remove a capacidade de redimensionar */
                        overflow-y-auto /* Esconde scrollbar */
                    "
                />
            </div>

            {/* 4. A ÁREA DE TEXTO: Aqui é onde o usuário pode escrever o conteúdo */}
            <div className="flex flex-col /* Alinha os itens na vertical (um embaixo do outro) */
                w-full /* Largura fixa, mas responsiva */
                h-[10rem] /* Altura fixa para o exemplo, pode ser ajustada */
                px-4 py-2.5 /* Espaçamento interno para os textos não colarem nas bordas */
                bg-zinc-100 /* Cor de fundo cinza clara igual da imagem */
                border border-zinc-300
                rounded-md /* Bordas bem arredondadas */
                focus-within:ring-1 focus-within:ring-zinc-400 /* Adiciona o anel de foco na div quando o usuário clica no input */">

                    <label 
                    htmlFor="contentInput" 
                    className="text-sm text-slate-500 mb-1"
                >
                    Conteúdo
                </label>
                
                {/* 3. O INPUT DE VERDADE: Invisível, apenas para digitar */}
                <textarea
                    id="contentInput"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Adicione uma descrição/conteúdo (opcional)"
                    className="
                        w-full 
                        h-full
                        bg-transparent /* Fundo transparente para herdar o cinza da div pai */
                        text-zinc-800 text-md
                        placeholder:text-slate-400 /* Cor do placeholder suave */
                        focus:outline-none /* Remove aquela borda preta padrão do navegador */
                        resize-none /* Remove a capacidade de redimensionar */
                        overflow-y-auto /* Esconde scrollbar */
                    "
                />
                
            </div>
            
            
        </div>
    );
}