import { Category } from "@/model/Categories";
import { Answer } from "@/model/Answer";
import { useEffect, useState } from "react";
import { Message } from "@/model/Message";
import { TurnState } from "@/model/TurnState";
import GameHeader from "./GameHeader";
import GameWindow from "./GameWindow";
import GameInputs from "./GameInputs";
import GameInfo from "./GameInfo";
import GameNotes from "./GameNotes";
import GameButtons from "./GameButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

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
    const [turn, setTurn] = useState(TurnState.HUMAN);

    const [showMenu, setShowMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    const handleOpenModal = (content: string) => {
        closeMenu();
        openModal(content);
    };

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
            setCounter(counter + 1); // Increase counter
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                closeMenu();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <main className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
            <div className="col-span-1 md:col-span-3 rounded-lg">
                <GameHeader category={category} />
                <GameWindow messages={messages} />
                <GameInputs onHandleAnswerClick={handleAnswerClick} onHandleHumanGuess={handleHumanGuess} turn={turn} />
            </div>
            <div className="col-span-1 md:col-span-2">
                <div className="absolute top-4 right-4 flex justify-end md:hidden text-white">
                    <button onClick={toggleMenu} className="btn p-2">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                {showMenu && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}></div>
                        <div className="fixed top-0 right-0 h-full w-4/5 bg-white shadow-lg p-4 z-50 flex flex-col">
                            <div className="flex justify-end">
                                <button onClick={closeMenu} className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <GameInfo userWord={userWord} counter={counter} />
                                <GameButtons openModal={handleOpenModal} />
                            </div>
                        </div>
                    </>
                )}
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