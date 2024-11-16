import { Category } from "@/model/Categories";
import { Answer } from "@/model/Answer";
import { useState } from "react";
import { Message } from "@/model/Message";
import GameHeader from "./GameHeader";
import GameWindow from "./GameWindow";
import { Player } from "@/model/Player";
import GameInputs from "./GameInputs";
import GameInfo from "./GameInfo";
import GameNotes from "./GameNotes";
import GameButtons from "./GameButtons";

type GameProps = {
    category: Category;
    userId: string;
    userWord: string;
    onSetWinner: (winner: string, aiWord: string) => void;
    openModal: (content: string) => void;
};

export default function Game({ category, userId, userWord, onSetWinner, openModal }: GameProps) {

    const [counter, setCounter] = useState(1); // State for error message
    const [messages, setMessages] = useState<Message[]>([]);
    const [turn, setTurn] = useState(Player.HUMAN);

    const handleAnswerClick = async (answer: Answer) => {
        setTurn(Player.LOADING); // Show loading spinner
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
            setTurn(Player.HUMAN); // Show input field after selection
            setCounter(counter + 1); // Increase counter
        }
    };

    const handleHumanGuess = async (input: string) => {
        setTurn(Player.LOADING); // Show loading spinner
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
            onSetWinner("user", data.aiWord);
        } else if (aiWin) {
            console.log("AI won!");
            setMessages([...messages, newMessage, ...aiMessages]); // Add AI response to messages
            onSetWinner("assistant", data.aiWord);
        } else {
            let updatedMessages = [...messages, newMessage];
            for (let i = 0; i < aiMessages.length; i++) {
                updatedMessages = [...updatedMessages, aiMessages[i]];
                setMessages([...updatedMessages]); // Update state with accumulated messages
                await new Promise(r => setTimeout(r, 500));
            }
            setTurn(Player.AI); // Show buttons after sending the question
        }
    };

    return (
        <main className="w-full grid grid-cols-5 gap-4 p-4">
            <div className="col-span-3 rounded-lg">
                <GameHeader category={category} />
                <GameWindow messages={messages} />
                <GameInputs onHandleAnswerClick={handleAnswerClick} onHandleHumanGuess={handleHumanGuess} turn={turn} />
            </div>
            <div className="col-span-2 rounded-lg">
                <GameInfo userWord={userWord} counter={counter} />
                <GameNotes />
                <GameButtons openModal={openModal} />
            </div>
        </main>
    );
}