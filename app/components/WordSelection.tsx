"use client";

import { Category } from "@/model/Categories";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faX } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import Image from 'next/image';

interface WordSelectionProps {
    onStartGame: (userId: string, userWord: string) => void;
    category: Category;
}

export default function WordSelection({ category, onStartGame }: WordSelectionProps) {
    const [userWord, setUserWord] = useState(""); // State for character input
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [loading, setLoading] = useState(false); // State for loading state

    const handleWordLock = async () => {
        setLoading(true); // Set loading state to true
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
                console.log("User word:", userWord);
                onStartGame(generatedUserId, userWord);
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
        setLoading(false); // Set loading state to false
    };

    const handleWordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && userWord) {
            handleWordLock();
        }
    };

    useEffect(() => {
        const bgImage = document.querySelector('.bg-image');
        if (bgImage) {
            setTimeout(() => {
                bgImage.classList.add('visible');
            }, 100); // Add a slight delay to ensure the transition is noticeable
        }
    }, []);


    return (
        <main className="w-full flex flex-col items-center md:mt-12 lg:mt-20 xl:mt-24">
            <div className="w-3/4 md:w-2/3">
                <div className="box-orange flex justify-center mb-4">
                    <h1 className="text-center text-4xl flex items-center justify-between font-extrabold py-6">
                        <FontAwesomeIcon icon={category.icon} className="icon-margin hidden sm:inline" />
                        {category.name}
                        <FontAwesomeIcon icon={category.icon} className="icon-margin hidden sm:inline" />
                    </h1>
                </div>
                <div className="w-full box-blue mb-4">
                    <h2 className="text-center text-3xl font-bold py-4 text-white">
                        {category.description}
                    </h2>
                </div>
                <div className="w-full flex justify-center mb-4">
                    <input
                        type="text"
                        value={userWord}
                        onChange={(e) => setUserWord(e.target.value)} // Update character input value
                        onKeyDown={handleWordKeyDown} // Add keydown event listener
                        placeholder={`Enter your character`} // Dynamic placeholder
                        className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                        color="black"
                    />
                </div>
                <div className="flex items-center justify-center mb-4 mt-8 md:mt-32 w-full">
                    <div className="w-full sm:w-1/3 flex justify-center">
                        {!loading ? (
                            <button className="w-full btn-orange py-4 px-8 rounded-lg shadow sm:flex-1 flex items-center justify-between text-3xl font-extrabold" onClick={handleWordLock}>
                                <FontAwesomeIcon icon={faGamepad} className="icon-margin-small" />
                                <span className="mx-2 text-center text-3xl">Start</span>
                                <FontAwesomeIcon icon={faGamepad} className="icon-margin-small" />
                            </button>
                        ) : (
                            <p className="center-spinner">
                                <span className="loading-spinner"></span>
                            </p>
                        )}
                    </div>
                </div>
                {errorMessage && (
                    <div className="flex box-red items-center justify-center w-full py-4 px-8">
                        <FontAwesomeIcon icon={faX} className="icon-margin" />
                        <span className="mx-2 text-center">{errorMessage}</span>
                        <FontAwesomeIcon icon={faX} className="icon-margin" />
                    </div>
                )}
            </div>
            <Image src={category.image} alt={category.name} width={300} height={300} className="bg-image" />
        </main>
    );
}