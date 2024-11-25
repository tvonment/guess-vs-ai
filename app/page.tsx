"use client";
import React, { useState, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Home from './components/Home';
import CategorySelection from './components/CategorySelection';
import Game from './components/game/Game';
import { Category } from '@/model/Categories';
import WordSelection from './components/WordSelection';
import GameOver from './components/GameOver';
import Modal from './components/modal/Modal';
import Faq from './components/modal/Faq';
import TermsOfUse from './components/modal/TermsOfUse';
import Contact from './components/modal/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import Confirm from './components/modal/Confirm';
import Help from './components/modal/Help';
import VersionFlag from './components/VersionFlag';

export default function MainPage() {
    const [currentPage, setCurrentPage] = useState<'home' | 'categoryselection' | 'wordselection' | 'game' | 'gameover'>('home');
    const [category, setCategory] = useState<Category>();
    const [userWord, setUserWord] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [winner, setWinner] = useState<string>("");
    const [aiWord, setAiWord] = useState<string>("");
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [transitionDirection, setTransitionDirection] = useState('left');
    // Create a map to store refs for each page
    const nodeRefs = useRef<{
        home: React.RefObject<HTMLDivElement>,
        categoryselection: React.RefObject<HTMLDivElement>,
        wordselection: React.RefObject<HTMLDivElement>,
        gameover: React.RefObject<HTMLDivElement>,
    }>({
        home: React.createRef<HTMLDivElement>(),
        categoryselection: React.createRef<HTMLDivElement>(),
        wordselection: React.createRef<HTMLDivElement>(),
        gameover: React.createRef<HTMLDivElement>(),
    });

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
                setTransitionDirection('right');
                setCurrentPage('home');
                break;
        }
    }

    const handleStart = () => {
        setTransitionDirection('left');
        setCurrentPage('categoryselection');
    };

    const handleSetCategory = (selectedCategory: Category) => {
        setTransitionDirection('left');
        setCategory(selectedCategory);
        setCurrentPage('wordselection');
    };

    const handleOnStartGame = (userId: string, userWord: string) => {
        setTransitionDirection('left');
        setUserId(userId);
        setUserWord(userWord);
        setCurrentPage('game');
    }

    const handleGameOver = (winner: string, aiWord: string) => {
        setTransitionDirection('left');
        setWinner(winner);
        setAiWord(aiWord);
        setCurrentPage('gameover');
    }

    const handleGivenUp = (aiWord: string) => {
        // Handle confirm action with the AI word
        console.log("Confirmed with AI word:", aiWord);
        setTransitionDirection('right');
        setAiWord(aiWord);
        setWinner('givenup');
        setCurrentPage('gameover');
        closeModal();
    };

    const handleNavigateBack = (targetPage: "home" | "categoryselection" | "wordselection" | "game" | "gameover") => {
        setTransitionDirection('right');
        setCurrentPage(targetPage);
    };

    return (
        <>
            <Header onClick={handleLogo} />
            {currentPage !== 'game' &&
                <div className="transition-container">
                    <TransitionGroup component={null}>
                        <CSSTransition
                            key={currentPage}
                            nodeRef={nodeRefs.current[currentPage]} // Use a unique ref for each page
                            classNames={{
                                enter: `page-enter-${transitionDirection}`,
                                enterActive: `page-enter-${transitionDirection}-active`,
                                exit: `page-exit-${transitionDirection}`,
                                exitActive: `page-exit-${transitionDirection}-active`,
                            }}
                            timeout={600}
                        >
                            <div ref={nodeRefs.current[currentPage]} className="w-full h-full">
                                {currentPage === 'home' && <Home onNavigate={handleStart} />}
                                {currentPage === 'categoryselection' && <CategorySelection onNavigateBack={() => { handleNavigateBack('home') }} onSetCategory={handleSetCategory} />}
                                {currentPage === 'wordselection' && category && <WordSelection onNavigateBack={() => handleNavigateBack('categoryselection')} onStartGame={handleOnStartGame} category={category} />}
                                {currentPage === 'gameover' && <GameOver winner={winner} aiWord={aiWord} onNavigate={() => handleNavigateBack('categoryselection')} />}
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            }
            {currentPage === 'game' && category && userId && <Game category={category} userId={userId} userWord={userWord} onSetWinner={handleGameOver} openModal={openModal} />}
            <Footer openModal={openModal} />
            <VersionFlag />
            <Modal content={modalContent} onClose={closeModal} renderContent={renderModalContent} />
        </>
    );
}