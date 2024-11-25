import { Category } from "@/model/Categories";
import { Answer } from "@/model/Answer";
import { useState } from "react";
import { Message } from "@/model/Message";
import { TurnState } from "@/model/TurnState";
import GameHeader from "./GameHeader";
import GameWindow from "./GameWindow";
import GameInputs from "./GameInputs";
import GameInfo from "./GameInfo";
import GameNotes from "./GameNotes";
import GameButtons from "./GameButtons";
import Image from 'next/image';

type GameProps = {
    category: Category;
    userId: string;
    userWord: string;
    counter: number;
    onSetWinner: (winner: string, aiWord: string) => void;
    onCounterIncrease: () => void;
    openModal: (content: string) => void;
};

export default function Game({ category, userId, userWord, counter, onSetWinner, openModal, onCounterIncrease }: GameProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [turn, setTurn] = useState(TurnState.HUMAN);

    const handleAnswerClick = async (answer: Answer) => {
        setTurn(TurnState.LOADING); // Show loading spinner
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
            setTurn(TurnState.HUMAN); // Show input field after selection
            onCounterIncrease(); // Increase counter
        }
    };

    const handleHumanGuess = async (input: string) => {
        setTurn(TurnState.LOADING); // Show loading spinner
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
            setTurn(TurnState.AI); // Show buttons after sending the question
        }
    };

    return (
        <main className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
            <div className="col-span-1 md:col-span-3 rounded-lg">
                <GameHeader category={category} />
                <GameWindow messages={messages} />
                <GameInputs onHandleAnswerClick={handleAnswerClick} onHandleHumanGuess={handleHumanGuess} turn={turn} />
            </div>
            <div className="col-span-1 md:col-span-2">
                <div className="hidden md:block">
                    <GameInfo userWord={userWord} counter={counter} />
                    <GameNotes />
                    <GameButtons openModal={openModal} />
                </div>
            </div>
            <Image src={category.image} alt={category.name} width={300} height={300} className="bg-image visible" />
        </main>
    );
}