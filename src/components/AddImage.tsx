{/*Para selecionar imagem para o post no creat post*/}
import { useState, type ChangeEvent, type DragEvent } from "react";

export default function AddImage({
  setImage,
}: {
  setImage: (file: string) => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { setImageFile(file); processFile(file); }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) { setImageFile(file); processFile(file); }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => event.preventDefault();

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setImage("");
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 flex flex-col w-full rounded-md bg-white shadow-sm border border-slate-200 p-4 md:p-6">
        <label className="block text-slate-800 font-medium mb-3 shrink-0">
          Upload Image
        </label>

        <div className="flex flex-col items-center justify-center w-full relative flex-1 min-h-[12rem]">
          {previewUrl ? (
            <div className="w-full h-full relative group flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full aspect-video lg:aspect-square object-contain"
              />
              <button
                className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                onClick={handleClearImage}
                title="Remover imagem"
              >
                X
              </button>
            </div>
          ) : (
            <label
              htmlFor="dragdrop-file"
              className="flex flex-col items-center justify-center w-full aspect-video lg:aspect-square border-2 border-dashed border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md transition-colors p-6 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-cloud-arrow-up text-gray-400 mb-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
                  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                </svg>
                <p className="mb-2 text-slate-700 text-sm md:text-base">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX. 10MB)</p>
              </div>
              <input id="dragdrop-file" type="file" accept="image/*" className="hidden" onChange={handleInputChange}/>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
