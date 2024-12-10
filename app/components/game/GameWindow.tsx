import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Message } from '@/model/Message';


interface GameWindowProps {
    messages: Message[];
}

export default function GameWindow({ messages }: GameWindowProps) {
    const chatWindowRef = useRef<HTMLDivElement>(null); // Ref for chat window

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]); // Scroll to bottom when messages change

    return (
        <div ref={chatWindowRef} className="chat-window p-4 flex-grow h-2/3 max-h-[55vh] md:max-h-[60vh] overflow-y-auto mb-4">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                    {message.role === "assistant" && (
                        <Image src={`/images/${message.role}-icon.png`} width={50} height={50} alt={message.role} className="w-10 h-10 mr-2" />
                    )}
                    <span className="message-content">{message.content}</span>
                    {message.role === "user" && (
                        <Image src={`/images/${message.role}-icon.png`} width={50} height={50} alt={message.role} className="w-10 h-10 ml-2" />
                    )}
                </div>
            ))}
        </div>
    );
}