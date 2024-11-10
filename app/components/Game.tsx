import { Category } from "@/model/Categories";
import { Answer } from "@/model/Answer";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/model/Message";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

type GameProps = {
    category: Category;
    userId: string;
    onSetWinner: (winner: string, aiWord: string) => void;
};

export default function Game({ category, userId, onSetWinner }: GameProps) {

    const [counter, setCounter] = useState(1); // State for error message
    const [input, setInput] = useState(""); // State for error message
    const [showButtons, setShowButtons] = useState(false); // State for error message
    const [showInputField, setShowInputField] = useState(true); // State for error message
    const [messages, setMessages] = useState<Message[]>([]);
    const chatWindowRef = useRef<HTMLDivElement>(null); // Ref for chat window

    const handleAnswerClick = async (answer: string) => {
        setShowInputField(false); // Hide input field after selection
        setShowButtons(false); // Hide buttons after selection
        // Call the /api/saveanswer endpoint to save the humens answer
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, answer: answer }),
        });
        const data = await response.json();
        const responseMessage = data.result;
        if (responseMessage) {
            setMessages([...messages, responseMessage]); // Add user message to messages
            setShowInputField(true); // Show input field after selection
            setCounter(counter + 1); // Increase counter
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && input) {
            handleHumanGuess();
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]); // Scroll to bottom when messages change

    const handleHumanGuess = async () => {
        setShowInputField(false); // Show input field after sending
        const newMessage = { role: "user", content: input };
        setMessages([...messages, newMessage]); // Add user message to messages
        const response = await fetch('/api/guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, text: input }), // Use input value
        });
        const data = await response.json();
        const aiMessages = data.result;
        const userWin = data.userWin;
        const aiWin = data.aiWin;
        if (userWin) {
            console.log("You won!");
            //setWinner("human");
            onSetWinner("user", data.aiWord);
            //setAiWord(data.aiWord)
        } else if (aiWin) {
            console.log("AI won!");
            setMessages([...messages, newMessage, ...aiMessages]); // Add AI response to messages
            //setWinner("ai");
            onSetWinner("assistant", data.aiWord);
            //setAiWord(data.aiWord)
        } else {
            let updatedMessages = [...messages, newMessage];
            for (let i = 0; i < aiMessages.length; i++) {
                updatedMessages = [...updatedMessages, aiMessages[i]];
                setMessages([...updatedMessages]); // Update state with accumulated messages
                await new Promise(r => setTimeout(r, 500));
            }
            //setMessages([...messages, newMessage, ...aiMessages]); // Add AI response to messages
            setShowButtons(true); // Show buttons after sending the question
            setInput(""); // Clear input field
        }
    };

    return (
        <main className="w-full grid grid-cols-5 gap-4 p-4">
            <div className="col-span-3 rounded-lg">
                <div className="box-orange flex items-center h-20 mb-4">
                    <p className="text-lg font-semibold">{category.name}</p>
                </div>
                <div ref={chatWindowRef} className="box-gray chat-window p-4 h-64 overflow-y-scroll mb-4">
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
                <div className="w-full flex justify-center mb-4 w-100">
                    {showButtons ? (
                        <div className="flex flex-wrap justify-center mb-4">
                            <button onClick={() => handleAnswerClick(Answer.YES)} className="m-1 p-2 bg-green-800 text-white rounded hover:bg-green-600 flex-1">{Answer.YES}</button>
                            <button onClick={() => handleAnswerClick(Answer.PROBABLY_YES)} className="m-1 p-2 bg-green-400 text-white rounded hover:bg-green-500 flex-1">{Answer.PROBABLY_YES}</button>
                            <button onClick={() => handleAnswerClick(Answer.PROBABLY_NO)} className="m-1 p-2 bg-red-400 text-white rounded hover:bg-red-500 flex-1">{Answer.PROBABLY_NO}</button>
                            <button onClick={() => handleAnswerClick(Answer.NO)} className="m-1 p-2 bg-red-800 text-white rounded hover:bg-red-600 flex-1">{Answer.NO}</button>
                            <button onClick={() => handleAnswerClick(Answer.I_DONT_KNOW)} className="m-1 p-2 bg-gray-400 text-white rounded hover:bg-gray-500 flex-1">{Answer.I_DONT_KNOW}</button>
                        </div>
                    ) : showInputField ? (
                        <div className="flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)} // Update input value
                                onKeyDown={handleKeyDown} // Add keydown event listener
                                placeholder="Enter your question" // Conditional placeholder text
                                className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                            />
                            <button onClick={handleHumanGuess}
                                disabled={!input} // Disable button if character is not locked or input is empty
                                className={`flex items-center justify-center rounded-r-lg px-4 ${!input ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-800 text-white hover:bg-blue-600'}`}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    ) : (
                        <p className="center-spinner">
                            <span className="loading-spinner"></span>
                        </p>
                    )}
                </div>
            </div>
            <div className="col-span-2 rounded-lg">
                <div className="flex gap-4 mb-4 h-20">
                    <div className="bg-white p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                        <p className="text-sm font-semibold">Your Word</p>
                        <p className="text-sm font-semibold"></p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                        <p className="text-sm font-semibold">Round: {counter}</p>
                    </div>
                </div>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                    placeholder="Enter your notes here"
                    rows={4}
                ></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <button className="btn-orange p-2 rounded-lg shadow">Hint</button>
                    <button className="btn-red p-2 rounded-lg shadow">Give up</button>
                </div>
            </div>
        </main>
    );
}