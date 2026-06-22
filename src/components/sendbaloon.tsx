{/*Balões de conversa*/}

type MessageBubbleProps = {
    text: string;
    senderId: string;     
    currentUserId: string; 
};

export default function SendBaloon({ text, senderId, currentUserId }: MessageBubbleProps) {
    const isMe = senderId === currentUserId;

    return (
        <div className={`flex w-full mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
            
            <div className={`
                w-fit 
                max-w-[85%] md:max-w-[50%] /* Mudança Aqui! 85% no mobile, 50% no PC */
                px-4 py-2.5 
                rounded-3xl 
                text-sm 
                shadow-sm
                ${isMe 
                    ? "bg-[#5468ff] text-white rounded-br-sm" 
                    : "bg-white text-zinc-800 border border-zinc-200 rounded-bl-sm"
                }
            `}>
                <p className="break-words leading-relaxed">{text}</p>
            </div>
            
        </div>
    );
}