import { Category } from "@/model/Categories";
import { Answer } from "@/model/Answer";
import { useState, useEffect } from "react";
import { Message } from "@/model/Message";
import { TurnState } from "@/model/TurnState";
import GameHeader from "./GameHeader";
import GameWindow from "./GameWindow";
import GameInputs from "./GameInputs";
import GameInfo from "./GameInfo";
import GameButtons from "./GameButtons";
import Image from 'next/image';
import { TurnResponse } from "@/model/TurnResponse";
import { WinnerState } from "@/model/WinnerState";
import { Counter } from "@/model/Counter";
import { ModalState } from "@/model/ModalState";

type GameProps = {
    category: Category;
    userId: string;
    userWord: string;
    counter: Counter;
    turn: TurnState;
    aiWord: string;
    summary: Message;
    startMessage: Message;
    feedbackSent: boolean;
    onRestart: () => void;
    onSetSummary: (summary: Message) => void;
    onSetTurn: (turn: TurnState) => void;
    onSetWinner: (winner: string, aiWord: string, summary: Message, learnFact?: string) => void;
    onSetCounter: (counter: Counter) => void;
    openModal: (content: ModalState) => void;
};

export default function Game({ category, userId, userWord, counter, turn, aiWord, summary, startMessage, feedbackSent, onRestart, onSetWinner, openModal, onSetTurn, onSetCounter }: GameProps) {
    const [messages, setMessages] = useState<Message[]>([startMessage]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (summary && summary.content) {
                floatMessages([summary]);
            }
        };

        fetchSummary();
    }, [summary]);

    const floatMessages = async (newMessages: Message[]) => {
        if (!newMessages || !Array.isArray(newMessages) || newMessages.length === 0) {
            return;
        }
        for (let i = 0; i < newMessages.length; i++) {
            setMessages(prevMessages => [...prevMessages, newMessages[i]]); // Use functional update
            await new Promise(r => setTimeout(r, 500));
        }
    };

    // Turn POSTs are NOT idempotent — the server persists the player's action
    // before the AI work that can fail — so they are sent exactly once and
    // never auto-retried (the server already retries its flaky LLM/DB hops).
    // Failures restore the turn so the player can retry visibly.
    const postTurn = async (url: string, body: object): Promise<TurnResponse> => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as TurnResponse;
    };

    const handleAnswerClick = async (answer: Answer) => {
        onSetTurn(TurnState.LOADING); // Show loading spinner
        try {
            const data = await postTurn('/api/save', { userId: userId, answer: answer });
            await handleResponse(data);
        } catch (error) {
            console.error("Error saving answer:", error);
            onSetTurn(TurnState.AI); // bring the answer buttons back so the player can retry
        }
    };

    const handleHumanGuess = async (input: string) => {
        onSetTurn(TurnState.LOADING); // Show loading spinner
        const newMessage = new Message("user", input);
        setMessages(prevMessages => [...prevMessages, newMessage]); // Use functional update
        try {
            const data = await postTurn('/api/humanguess', { userId: userId, text: input });
            await handleResponse(data);
        } catch (error) {
            console.error("Error sending question:", error);
            onSetTurn(TurnState.HUMAN); // give the input back so the player can retry
        }
    };

    const handleResponse = async (data: TurnResponse) => {
        const newMessages = data.messages as Message[];
        const winner = data.winnerState as WinnerState;
        const counter = data.counter as Counter;
        const turn = data.turn as TurnState;
        if (counter) { onSetCounter(counter) };
        await floatMessages(newMessages);
        onSetTurn(turn);
        if (winner && data.aiWord && data.summary) { onSetWinner(winner, data.aiWord, data.summary, data.learnFact); }
    }

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
                    <GameButtons openModal={openModal} turn={turn} feedbackSent={feedbackSent} onRestart={onRestart} />
                </div>
            </div>
            <Image src={category.image} alt={category.name} width={300} height={300} className="bg-image visible" />
        </main>
    );
}