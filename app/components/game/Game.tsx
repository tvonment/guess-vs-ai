import { Category } from "@/model/Categories";
import { Answer } from "@/model/Answer";
import { useState, useEffect } from "react";
import { Message } from "@/model/Message";
import { TurnState } from "@/model/TurnState";
import GameHeader from "./GameHeader";
import GameWindow from "./GameWindow";
import GameInputs from "./GameInputs";
import GameInfo from "./GameInfo";
import GameNotes from "./GameNotes";
import GameButtons from "./GameButtons";
import Image from 'next/image';
import { MessageRequestType } from "@/model/MessageRequestType";

type GameProps = {
    category: Category;
    userId: string;
    userWord: string;
    counter: number;
    turn: TurnState;
    aiWord: string;
    summary: string;
    onSetSummary: (summary: string) => void;
    onSetTurn: (turn: TurnState) => void;
    onSetWinner: (winner: string, aiWord: string, summary: string) => void;
    onCounterIncrease: () => void;
    openModal: (content: string) => void;
};

export default function Game({ category, userId, userWord, counter, turn, aiWord, summary, onSetSummary, onSetWinner, openModal, onCounterIncrease, onSetTurn }: GameProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    const onInit = async () => {
        onSetTurn(TurnState.LOADING); // Show loading spinner
        const response = await fetch('/api/messagerequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, category: category, messageRequestType: MessageRequestType.START }),
        });
        const data = await response.json();
        if (data.messages) {
            setMessages([...messages, ...data.messages]); // Add user message to messages
        }
        onSetTurn(TurnState.HUMAN); // Set turn back to human after initialization
    };

    useEffect(() => {
        onInit();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (counter % 3 === 0 && counter !== 0) {
                onSetTurn(TurnState.LOADING); // Show loading spinner
                const response = await fetch('/api/messagerequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId, category: category, messages: messages, messageRequestType: MessageRequestType.HUMILIATE }),
                });
                const data = await response.json();
                if (data.messages) {
                    setMessages([...messages, ...data.messages]); // Add user message to messages
                }
                onSetTurn(TurnState.HUMAN); // Set turn back to human after initialization
            }
        };

        fetchMessages();
    }, [counter]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (summary) {
                setMessages([...messages, { role: "system", content: summary }]);
            }
        };

        fetchSummary();
    }, [summary]);


    const handleWinner = async (winner: string, aiWord: string) => {
        onSetTurn(TurnState.FINISHED);
        try {
            const response = await fetch('/api/messagerequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, category: category, messageRequestType: MessageRequestType.SUMMARY }),
            });
            const data = await response.json();
            console.log("Summary data:", data);
            const message = data.message as Message;
            if (data.message) {
                onSetSummary(message.content);
                onSetWinner(winner, aiWord, message.content);
                openModal("gameover");
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    };

    const handleAnswerClick = async (answer: Answer) => {
        onSetTurn(TurnState.LOADING); // Show loading spinner
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
            onSetTurn(TurnState.HUMAN); // Show input field after selection
            onCounterIncrease(); // Increase counter
        }
    };

    const handleHumanGuess = async (input: string) => {
        onSetTurn(TurnState.LOADING); // Show loading spinner
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
            handleWinner("user", data.aiWord);
        } else if (aiWin) {
            console.log("AI won!");
            setMessages([...messages, newMessage, ...aiMessages]); // Add AI response to messages
            handleWinner("assistant", data.aiWord);
        } else {
            let updatedMessages = [...messages, newMessage];
            for (let i = 0; i < aiMessages.length; i++) {
                updatedMessages = [...updatedMessages, aiMessages[i]];
                setMessages([...updatedMessages]); // Update state with accumulated messages
                await new Promise(r => setTimeout(r, 500));
            }
            onSetTurn(TurnState.AI); // Show buttons after sending the question
        }
    };

    return (
        <main className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 p-4 overflow-hidden">
            <div className="col-span-1 md:col-span-3 rounded-lg">
                <GameHeader category={category} />
                <GameWindow messages={messages} />
                {turn !== TurnState.FINISHED ? (
                    <GameInputs onHandleAnswerClick={handleAnswerClick} onHandleHumanGuess={handleHumanGuess} turn={turn} />
                ) : (
                    <>
                        <h2 className="text-lg font-semibold text-white">AI&apos;s word was: {aiWord}</h2>
                    </>
                )}
            </div>
            <div className="col-span-1 md:col-span-2">
                <div className="hidden md:block">
                    <GameInfo userWord={userWord} counter={counter} />
                    <GameNotes />
                    <GameButtons openModal={openModal} turn={turn} />
                </div>
            </div>
            <Image src={category.image} alt={category.name} width={300} height={300} className="bg-image visible" />
        </main>
    );
}