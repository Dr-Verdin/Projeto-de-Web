import { useState, type ChangeEvent, type DragEvent, useEffect } from "react";

export default function AddImage({
  setImage,
}: {
  setImage: (file: string) => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // converte arquivo para base64
  const processFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      setPreviewUrl(base64);
      setImage(base64); // envia pro Create
    };

    reader.readAsDataURL(file);
  };

  // 1. Input click
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);
      processFile(file);
    }
  };

  // 2. Drag & drop
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      processFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setImage(""); 
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

              {/* Botão X */}
              <button
                className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                onClick={handleClearImage}
                title="Remover imagem"
              >
                X
              </button>
            </div>
          ) : (
            /* Área que aparece quando NÃO tem imagem */
            <label
              htmlFor="dragdrop-file"
              className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md transition-colors p-6 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="mb-2 text-slate-700">
                  <span className="font-semibold text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drap and drop
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF (MAX. 10MB)
                </p>
              </div>

              <input
                id="dragdrop-file"
                type="file"
                accept="image/*"
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