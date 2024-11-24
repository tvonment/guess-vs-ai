import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

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
                <div className="flex max-w-1/3">
                    <button className="btn-orange py-4 px-8 rounded-lg shadow sm:flex-1 flex items-center justify-between text-2xl font-extrabold" onClick={onNavigate}>
                        <FontAwesomeIcon icon={faRotateLeft} className="icon-margin" />
                        <span className="mx-2 text-center">Again</span>
                        <FontAwesomeIcon icon={faRotateLeft} className="icon-margin" />
                    </button>
                </div>
            </div>
        </main>
    );
}