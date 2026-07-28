"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Message } from "@/model/Message";

interface GameHelperProps {
    userId: string;
    messages: Message[];
    onMessagesChange: (messages: Message[]) => void;
}

export default function GameHelper({ userId, messages, onMessagesChange }: GameHelperProps) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const threadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (threadRef.current) {
            threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleAsk = async () => {
        const question = input.trim();
        if (!question || loading) {
            return;
        }
        const nextMessages = [...messages, new Message("user", question)];
        onMessagesChange(nextMessages);
        setInput("");
        setError("");
        setLoading(true);
        try {
            const response = await fetch('/api/helper', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, question: question, history: messages.slice(-10) }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            onMessagesChange([...nextMessages, new Message("assistant", data.answer)]);
        } catch (err) {
            console.error("Error asking the study buddy:", err);
            setError("The Study Buddy is unavailable right now — try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAsk();
        }
    };

    return (
        <div className="box-blue p-3 rounded-lg shadow mb-4 text-white">
            <p className="text-xl font-extrabold text-center mb-1">
                <FontAwesomeIcon icon={faGraduationCap} className="icon-margin-small" />
                <span className="mx-2">Study Buddy</span>
                <FontAwesomeIcon icon={faGraduationCap} className="icon-margin-small" />
            </p>
            <p className="text-xs text-center mb-2 opacity-80">Facts about your word — no game help 😉</p>
            <div ref={threadRef} className="helper-chat max-h-[35vh] overflow-y-auto mb-2">
                {messages.length === 0 && (
                    <p className="text-sm opacity-70 text-center py-2">Unsure how to answer a question about your word? Ask me!</p>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        <span className="message-content text-black text-sm">{message.content}</span>
                    </div>
                ))}
                {loading && (
                    <p className="center-spinner py-1">
                        <span className="loading-spinner"></span>
                    </p>
                )}
            </div>
            {error && <p className="text-xs text-center mb-2">{error}</p>}
            <div className="w-full flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your word"
                    className="flex-grow min-w-0 p-2 text-sm text-black border border-gray-300 rounded-l-lg"
                />
                <button onClick={handleAsk}
                    disabled={!input.trim() || loading}
                    className={`flex items-center justify-center rounded-r-lg px-3 ${!input.trim() || loading ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'btn-orange'}`}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}
