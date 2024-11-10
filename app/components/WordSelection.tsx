"use client";

import { Category } from "@/model/Categories";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

interface WordSelectionProps {
    onNavigateBack: () => void;
    onStartGame: (userId: string) => void;
    category: Category;
}

export default function WordSelection({ onNavigateBack, category, onStartGame }: WordSelectionProps) {
    const [userWord, setUserWord] = useState(""); // State for character input
    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    const handleWordLock = async () => {
        // Initialize user after character is locked
        const generatedUserId = uuidv4();

        // Call the /api/start endpoint to retrieve chat history
        try {
            const response = await fetch('/api/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: generatedUserId, categoryName: category.name, userWord: userWord }),
            });
            const data = await response.json();
            // Set the retrieved chat history
            if (data.result) {
                setErrorMessage("");
                console.log("Game started", data);
                console.log("User ID:", generatedUserId);
                onStartGame(generatedUserId);
            }

            if (data.invalid) {
                console.log("Invalid word", data);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error starting game:", error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    const handleWordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && userWord) {
            handleWordLock();
        }
    };

    return (
        <main className="">
            <div className="box-orange flex justify-center mb-4">
                <h1>{category.name}</h1>
            </div>
            <div className="box-gray mb-4">
                <div className="w-full box-blue mb-4">
                    <p>{category.description}</p>
                </div>
                <div className="w-full flex justify-center mb-4">
                    <input
                        type="text"
                        value={userWord}
                        onChange={(e) => setUserWord(e.target.value)} // Update character input value
                        onKeyDown={handleWordKeyDown} // Add keydown event listener
                        placeholder={`Enter a word from the ${category.name} category`} // Dynamic placeholder
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        color="black"
                    />
                </div>
            </div>
            {errorMessage && (
                <div className="box-red mb-4">
                    <p>{errorMessage}</p>
                </div>
            )}
            <div className="flex items-center justify-center">
                <button onClick={handleWordLock} className="btn-orange">
                    Start Game
                </button>
            </div>

        </main>
    );
}