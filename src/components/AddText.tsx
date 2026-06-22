import type { ChangeEvent } from "react";

type Props = {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
};

export default function AddText({
  title,
  setTitle,
  content,
  setContent,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      
      {/* TITLE */}
      <div className="flex flex-col w-full h-[5rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-md focus-within:ring-1 focus-within:ring-zinc-400">
        <label className="text-sm text-slate-500 mb-1">Título*</label>

        <textarea
          value={title}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setTitle(e.target.value)
          }
          placeholder="Adicione um título"
          className="w-full bg-transparent text-zinc-800 text-md focus:outline-none resize-none"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col w-full h-[10rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-md focus-within:ring-1 focus-within:ring-zinc-400">
        <label className="text-sm text-slate-500 mb-1">Conteúdo</label>

        <textarea
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          placeholder="Adicione uma descrição (opcional)"
          className="w-full h-full bg-transparent text-zinc-800 text-md focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}