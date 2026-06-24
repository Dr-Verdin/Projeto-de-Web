import type { Message } from "../services/messageService";

type MessageBubbleProps = {
  message: Message;
  currentUserId: string;
};

export default function SendBaloon({ message, currentUserId }: MessageBubbleProps) {
  const isMe = message.senderId === currentUserId;

  const time = new Date(message.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex w-full mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`
        flex flex-col gap-1
        w-fit max-w-[85%] md:max-w-[55%]
        px-4 py-2.5
        rounded-3xl
        text-sm
        shadow-sm
        ${isMe
          ? "bg-[#5468ff] text-white rounded-br-sm"
          : "bg-white text-zinc-800 border border-zinc-200 rounded-bl-sm"
        }
      `}>
        {message.image && (
          <img
            src={message.image}
            alt="imagem"
            className="rounded-2xl max-h-60 w-auto object-cover"
          />
        )}
        {message.content && (
          <p className="break-words leading-relaxed">{message.content}</p>
        )}
        <span className={`text-[10px] self-end mt-0.5 ${isMe ? "text-white/60" : "text-zinc-400"}`}>
          {time}
          {isMe && (
            <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>
          )}
        </span>
      </div>
    </div>
  );
}
