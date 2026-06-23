{/*Para adicionar titulo e texto na publicação*/}
import type { ChangeEvent } from "react";

type Props = {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
};

export default function AddText({ title, setTitle, content, setContent }: Props) {
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
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)}
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
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder="Adicione uma descrição/conteúdo (opcional)"
          className="w-full h-full bg-transparent text-zinc-800 text-sm md:text-base placeholder:text-slate-400 focus:outline-none resize-none overflow-y-auto"
        />
      </div>

    </div>
  );
}
