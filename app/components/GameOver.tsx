import React from 'react';
import Image from 'next/image';

type GameOverProps = {
    onNavigate: () => void;
    winner: string;
    aiWord: string;
};

export default function GameOver({ winner, aiWord, onNavigate }: GameOverProps) {
    const renderContent = () => {
        switch (winner) {
            case 'assistant':
                return (
                    <>
                        <div className="flex justify-center mb-4">
                            <Image src={`/images/assistant-icon.png`} width={300} height={300} alt="Logo" className="w-100 h-100 mb-4" />
                        </div>
                        <div className="flex justify-center mb-4">
                            <h1 className="text-2xl font-bold text-white">AI won!</h1>
                        </div>
                        <div className="flex justify-center mb-4">
                            <p className="text-lg font-semibold text-white">AI&apos;s word was: {aiWord}</p>
                        </div>
                    </>
                );
            case 'user':
                return (
                    <>
                        <div className="flex justify-center mb-4">
                            <Image src={`/images/user-icon.png`} width={300} height={300} alt="Logo" className="w-100 h-100 mb-4" />
                        </div>
                        <div className="flex justify-center mb-4">
                            <h1 className="text-2xl font-bold text-white">You won!</h1>
                        </div>
                        <div className="flex justify-center mb-4">
                            <p className="text-lg font-semibold text-white">AI&apos;s word was: {aiWord}</p>
                        </div>
                    </>
                );
            case 'givenup':
                return (
                    <>
                        <div className="flex justify-center mb-4">
                            <Image src={`/images/Guess vs AI logo.png`} width={300} height={300} alt="Logo" className="w-100 h-100 mb-4" />
                        </div>
                        <div className="flex justify-center mb-4">
                            <h1 className="text-2xl font-bold text-white">You gave up!</h1>
                        </div>
                        <div className="flex justify-center mb-4">
                            <p className="text-lg font-semibold text-white">AI&apos;s word was: {aiWord}</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <main className="shadow-lg w-full">
            {renderContent()}
            <div className="flex justify-center">
                <button onClick={onNavigate} className="btn-orange font-bold py-5 px-8">Again</button>
            </div>
        </main>
    );
}