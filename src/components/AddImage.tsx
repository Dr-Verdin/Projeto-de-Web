import { useState, type ChangeEvent, type DragEvent, useEffect } from "react";

export default function AddImage() {
    // Mantemos o arquivo original (File) para enviar ao backend depois
    const [imageFile, setImageFile] = useState<File | null>(null);
    // Criamos um novo estado apenas para o link da miniatura
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Dica Importante de Performance:
    // URLs de objetos criados com URL.createObjectURL() consomem memória.
    // Usamos o useEffect para "limpar" a URL antiga sempre que a imagem mudar ou o componente sumir.
    useEffect(() => {
        // Se houver uma URL antiga na memória, nós a liberamos
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        // Se houver um novo arquivo de imagem, criamos a nova URL
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setPreviewUrl(url);
        } else {
            // Se o arquivo foi removido, a URL de preview também some
            setPreviewUrl(null);
        }
        
        // Função de cleanup (limpeza) quando o componente unmount
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [imageFile]); // Essa função roda toda vez que imageFile mudar


    // 1. Função para o Clique do Input
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file); // Salvamos o arquivo (o useEffect fará o preview)
        }
    };

    // 2. Função para Arrastar e Soltar (Drag & Drop)
    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault(); // Impede o navegador de abrir a imagem em outra aba
        
        // Em drag & drop, os arquivos vêm de dataTransfer!
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file); // Salvamos o arquivo
        }
    };

    // Necessário para permitir que o arquivo seja solto
    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault(); 
    };

    const handleClearImage = () => {
        setImageFile(null); // Reseta o arquivo, o useEffect reseta o preview
    };

    return (
        <div className="flex items-center justify-center w-full md:w-auto shrink-0">
            {/* Input div */}
            <div className="w-full md:w-[30rem] rounded-md bg-white shadow-md border border-slate-300 p-4 md:p-6">
                <label className="block text-slate-800 font-medium mb-3">
                    Upload Image
                </label>
                
                <div className="flex flex-col items-start w-full gap-4 relative h-full min-h-0">
                    {previewUrl ? (
                        /* Área que aparece quando tem imagem (Preview) */
                        <div className="w-full relative group flex-1 min-h-0">
                            <img 
                                src={previewUrl} 
                                alt="Preview da imagem selecionada" 
                                className="w-full aspect-square object-cover rounded-md border border-gray-200"
                            />
                            
                            {/* Botão X (fechar) - Aparece no top-right ao passar o mouse */}
                            <button 
                                className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer" 
                                onClick={handleClearImage}
                                title="Remover imagem"
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        /* Área que aparece quando NÃO tem imagem (Drop Zone) */
                        /* Colocamos os eventos de Drag & Drop aqui na label! */
                        <label 
                            htmlFor="dragdrop-file" 
                            className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md transition-colors p-6 text-center"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                {/* Ícone do Bootstrap Cloud Arrow Up */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cloud-arrow-up text-gray-400 mb-1" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
                                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                                </svg>
                                
                                <p className="mb-2 text-slate-700">
                                    <span className="font-semibold text-blue-600">Click to upload</span> or drap and drop
                                </p>
                                <p className="text-xs text-slate-500">
                                    PNG, JPG, GIF (MAX. 10MB)
                                </p>
                            </div>
                            
                            {/* Input escondido que usa a funçãohandleInputChange */}
                            <input 
                                id="dragdrop-file"
                                type="file"
                                accept="image/*" // Mostra apenas imagens na janela de arquivo
                                className="hidden"
                                onChange={handleInputChange}
                            />
                        </label>
                    )}
                </div>
            </div>                
        </div>
    );
}