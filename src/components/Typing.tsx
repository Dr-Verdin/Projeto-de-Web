import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { IconMoodSmile, IconPhoto, IconSend, IconX } from "@tabler/icons-react";

type TypingProps = {
  onSend: (content: string, image?: string) => Promise<void>;
  disabled?: boolean;
};

const commonEmojis = ["😀", "😂", "🥰", "😎", "🤔", "🙌", "👍", "🔥", "✨", "🎉", "❤️", "👀"];

export default function Typing({ onSend, disabled = false }: TypingProps) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [sending, setSending] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => { adjustHeight(); }, [text]);

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function addEmoji(emoji: string) {
    setText((prev) => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  }

  function handleImageSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleSend() {
    if ((!text.trim() && !imagePreview) || sending || disabled) return;
    setSending(true);
    try {
      await onSend(text.trim(), imagePreview ?? undefined);
      setText("");
      setImagePreview(null);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = (text.trim().length > 0 || !!imagePreview) && !sending && !disabled;

  return (
    <div className="flex flex-col items-center gap-2 w-full relative">

      {/* MENU DE EMOJIS */}
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

      {/* PREVIEW DE IMAGEM */}
      {imagePreview && (
        <div className="relative self-start ml-2">
          <img src={imagePreview} alt="preview" className="h-20 rounded-xl object-cover" />
          <button
            onClick={() => setImagePreview(null)}
            className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-500 hover:text-red-500 transition-colors"
          >
            <IconX size={14} />
          </button>
        </div>
      )}

      {/* INPUT INVISÍVEL PARA IMAGEM */}
      <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageSelected} className="hidden" />

      {/* CAIXA DE DIGITAÇÃO */}
      <div className="flex items-end w-full min-h-[3rem] px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-3xl focus-within:ring-1 focus-within:ring-zinc-400 gap-3">

        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className={`mb-0.5 shrink-0 transition-colors ${showEmojis ? "text-[#e1903e]" : "text-zinc-400 hover:text-zinc-600"}`}
        >
          <IconMoodSmile size={24} stroke={1.5} />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          rows={1}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Envie uma mensagem..."
          disabled={disabled || sending}
          className="flex-1 bg-transparent text-zinc-800 text-sm placeholder:text-slate-400 focus:outline-none resize-none max-h-40 overflow-y-auto scrollbar-none disabled:opacity-50"
        />

        <button
          onClick={() => imageInputRef.current?.click()}
          className="mb-0.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
        >
          <IconPhoto size={24} stroke={1.5} />
        </button>

        {canSend && (
          <button
            onClick={handleSend}
            disabled={sending}
            className="mb-0.5 text-[#e1903e] hover:scale-110 transition-all shrink-0 disabled:opacity-40"
          >
            <IconSend size={24} stroke={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
