import React from 'react';
import Image from 'next/image';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameOverWinner from './GameOverWinner';
import Game from '../game/Game';
import { faArrowCircleLeft, faCircleArrowLeft, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

type GameOverProps = {
    winner: string;
    aiWord: string;
    onClose: () => void;
    onRestart: () => void;
    openModal: (content: string) => void;
};


export default function GameOverModal({ winner, aiWord, openModal, onRestart }: GameOverProps) {
    const handleFeedback = () => {
        openModal('feedback');
    };

    const handleRestart = () => {
        onRestart();
    };

    const renderContent = () => {
        switch (winner) {
            case 'assistant':
                return <GameOverWinner winnerText="AI won!" image="assistant-icon.png" aiWord={aiWord} />;
            case 'user':
                return <GameOverWinner winnerText="You won!" image="user-icon.png" aiWord={aiWord} />;
            case 'givenup':
                return <GameOverWinner winnerText="You gave up!" image="Guess vs AI logo.png" aiWord={aiWord} />;
            default:
                return null;
        }
    };

    return (
        <main className="w-full overflow-hidden">
            {renderContent()}
            <div className="flex justify-center space-x-4 mt-3">
                <button className="btn-blue p-3 rounded-lg shadow flex items-center justify-between w-48 transform transition-transform duration-300 hover:scale-105" onClick={handleFeedback}>
                    <FontAwesomeIcon icon={faHeart} className="icon-margin-small" />
                    <span className="mx-2 text-center">Feedback</span>
                    <FontAwesomeIcon icon={faHeart} className="icon-margin-small hidden sm:inline" />
                </button>
                <button className="btn-orange p-3 rounded-lg shadow flex items-center justify-between w-48 transform transition-transform duration-300 hover:scale-105" onClick={handleRestart}>
                    <FontAwesomeIcon icon={faRotateLeft} className="icon-margin-small" />
                    <span className="mx-2 text-center">Again</span>
                    <FontAwesomeIcon icon={faRotateLeft} className="icon-margin-small hidden sm:inline" />
                </button>
            </div>
        </main>
    );
}