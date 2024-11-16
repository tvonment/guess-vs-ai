"use client";
import { useState } from 'react';

import Home from './components/Home';
import CategorySelection from './components/CategorySelection';
import Game from './components/game/Game';
import { Category } from '@/model/Categories';
import WordSelection from './components/WordSelection';
import GameOver from './components/GameOver';
import Modal from './components/Modal';
import Faq from './components/modal/Faq';
import TermsOfUse from './components/modal/TermsOfUse';
import Contact from './components/modal/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import Confirm from './components/modal/Confirm';
import Help from './components/modal/Help';

export default function MainPage() {
    const [currentPage, setCurrentPage] = useState<'home' | 'categoryselection' | 'wordselection' | 'game' | 'gameover'>('home');
    const [category, setCategory] = useState<Category>();
    const [userWord, setUserWord] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [winner, setWinner] = useState<string>("");
    const [aiWord, setAiWord] = useState<string>("");
    const [modalContent, setModalContent] = useState<string | null>(null);

    const openModal = (content: string) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const renderModalContent = () => {
        switch (modalContent) {
            case 'FAQ':
                return <Faq />;
            case 'Terms of Use':
                return <TermsOfUse />;
            case 'Contact':
                return <Contact />;
            case 'giveup':
                return <Confirm onClose={closeModal} onConfirm={handleGivenUp} userId={userId} />;
            case 'help':
                return <Help onClose={closeModal} />;
            default:
                return null;
        }
    };

    const handleLogo = () => {
        switch (currentPage) {
            case 'game':
                openModal('giveup');
                break;
            default:
                setCurrentPage('home');
                break;
        }
    }

    const handleStart = () => {
        setCurrentPage('categoryselection');
    };

    const handleSetCategory = (selectedCategory: Category) => {
        setCategory(selectedCategory);
        setCurrentPage('wordselection');
    };

    const handleOnStartGame = (userId: string, userWord: string) => {
        setUserId(userId);
        setUserWord(userWord);
        setCurrentPage('game');
    }

    const handleGameOver = (winner: string, aiWord: string) => {
        setWinner(winner);
        setAiWord(aiWord);
        setCurrentPage('gameover');
    }

    const handleGivenUp = (aiWord: string) => {
        // Handle confirm action with the AI word
        console.log("Confirmed with AI word:", aiWord);
        setAiWord(aiWord);
        setWinner('givenup');
        setCurrentPage('gameover');
        closeModal();
    };

    return (
        <>
            <Header onClick={handleLogo} />
            {currentPage === 'home' && <Home onNavigate={handleStart} />}
            {currentPage === 'categoryselection' && <CategorySelection onNavigateBack={() => setCurrentPage('home')} onSetCategory={handleSetCategory} />}
            {currentPage === 'wordselection' && category && <WordSelection onNavigateBack={() => setCurrentPage('categoryselection')} onStartGame={handleOnStartGame} category={category} />}
            {currentPage === 'game' && category && userId && <Game category={category} userId={userId} userWord={userWord} onSetWinner={handleGameOver} openModal={openModal} />}
            {currentPage === 'gameover' && <GameOver winner={winner} aiWord={aiWord} onNavigate={() => setCurrentPage('categoryselection')} />}
            <Footer openModal={openModal} />
            <Modal content={modalContent} onClose={closeModal} renderContent={renderModalContent} />
        </>
    );
}