import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import AddImage from "../components/AddImage";
import AddText from "../components/AddText";

export default function Create({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string>("");

  const { user } = useAuth();

  async function handlePublish() {
    const authorId = user?.id ?? user?.sub;
    if (!authorId) return;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
        image: image || null,
        authorId,
      }),
    });

    onClose();
    
    window.location.reload();
  }

  console.log(image.length);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-stretch gap-6 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 flex flex-col min-w-0 w-full">
            {/* 🔥 AQUI está a correção */}
            <AddImage setImage={setImage} />
          </div>

          <div className="flex-1 flex flex-col min-w-0 w-full">
            <AddText
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
            />

            <div className="w-full flex justify-end mt-auto pt-6 md:pt-0">
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 bg-[#efce7b] hover:bg-[#e63946] text-white font-medium rounded-full transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}