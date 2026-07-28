import React from 'react';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameOverWinner from './GameOverWinner';
import { Message } from '@/model/Message';
import { WinnerState } from '@/model/WinnerState';
import { ModalState } from '@/model/ModalState';

type GameOverProps = {
    winner: string;
    aiWord: string;
    summary: Message;
    learnFact?: string;
    onClose: () => void;
    openModal: (content: ModalState) => void;
};


export default function GameOverModal({ winner, aiWord, summary, learnFact, openModal }: GameOverProps) {
    const handleFeedback = () => {
        openModal(ModalState.FEEDBACK);
    };

    const renderContent = () => {
        switch (winner) {
            case WinnerState.AI:
                return <GameOverWinner winnerText="AI won!" image="assistant-icon.png" aiWord={aiWord} />;
            case WinnerState.HUMAN:
                return <GameOverWinner winnerText="You won!" image="user-icon.png" aiWord={aiWord} />;
            case WinnerState.GIVENUP:
                return <GameOverWinner winnerText="You gave up!" image="Guess vs AI logo.png" aiWord={aiWord} />;
            default:
                return null;
        }
    };

    return (
        <main className="w-full overflow-hidden">
            {renderContent()}
            <p className="summary text-center mt-4">{summary.content}</p>
            {learnFact && (
                <div className="box-blue p-4 rounded-lg mt-4 text-white text-left">
                    <p className="font-bold mb-2">
                        <FontAwesomeIcon icon={faGraduationCap} className="icon-margin-small" />
                        <span className="mx-2">Did you know?</span>
                    </p>
                    <p className="whitespace-pre-line">{learnFact}</p>
                </div>
            )}
            <div className="flex justify-center space-x-4 mt-3">
                <button className="btn-blue p-3 rounded-lg shadow flex items-center justify-between w-48 transform transition-transform duration-300 hover:scale-105" onClick={handleFeedback}>
                    <FontAwesomeIcon icon={faHeart} className="icon-margin-small" />
                    <span className="mx-2 text-center">Feedback</span>
                    <FontAwesomeIcon icon={faHeart} className="icon-margin-small hidden sm:inline" />
                </button>
            </div>
        </main>
    );
}