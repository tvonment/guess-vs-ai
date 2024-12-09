"use client";
import React, { useState, useEffect } from 'react';

import Home from './components/Home';
import CategorySelection from './components/CategorySelection';
import Game from './components/game/Game';
import { Category } from '@/model/Categories';
import WordSelection from './components/WordSelection';
import Modal from './components/modal/Modal';
import Faq from './components/modal/Faq';
import TermsOfUse from './components/modal/TermsOfUse';
import Contact from './components/modal/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import Confirm from './components/modal/Confirm';
import Help from './components/modal/Help';
import VersionFlag from './components/VersionFlag';
import Menu from './components/Menu';
import ReportIssue from './components/modal/ReportIssue';
import FeedbackForm from './components/modal/FeedbackForm';
import GameOverModal from './components/modal/GameOver';
import { TurnState } from '@/model/TurnState';

export default function MainPage() {
    const [currentPage, setCurrentPage] = useState<'home' | 'categoryselection' | 'wordselection' | 'game'>('home');
    const [category, setCategory] = useState<Category>();
    const [userWord, setUserWord] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [winner, setWinner] = useState<string>("");
    const [aiWord, setAiWord] = useState<string>("");
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [turn, setTurn] = useState<TurnState>(TurnState.LOADING);
    const [summary, setSummary] = useState<string>("");

    const handleCounterIncrease = () => {
        setCounter(counter + 1);
    }

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    const handleMenuOpenModal = (content: string) => {
        closeMenu();
        openModal(content);
    };

    const openModal = (content: string) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const handleSetTurn = (turn: TurnState) => {
        setTurn(turn);
    }

    const handleSetSummary = (summary: string) => {
        setSummary(summary);
    }

    const renderModalContent = () => {
        switch (modalContent) {
            case 'FAQ':
                return <Faq />;
            case 'Terms of Use':
                return <TermsOfUse />;
            case 'Contact':
                return <Contact />;
            case 'giveup':
                return <Confirm onClose={closeModal} onConfirm={handleGameOver} userId={userId} />;
            case 'help':
                return <Help onClose={closeModal} category={category} />;
            case 'report-ingame':
                return <ReportIssue onClose={closeModal} gameStatus='ingame' userId={userId} />;
            case 'report-gameover':
                return <ReportIssue onClose={closeModal} gameStatus='gameover' userId={userId} />;
            case 'gameover':
                return <GameOverModal onClose={closeModal} winner={winner} aiWord={aiWord} summary={summary} openModal={openModal} onRestart={handleStart} />;
            case 'feedback':
                return <FeedbackForm onClose={closeModal} userId={userId} />;
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
        setCategory(undefined);
        setUserWord("");
        setUserId("");
        setWinner("");
        setAiWord("");
        setCounter(0);
        setSummary("");
        setTurn(TurnState.LOADING);
        setCurrentPage('categoryselection');
        closeModal();
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

    const handleGameOver = async (winner: string, aiWord: string, summary: string) => {
        setWinner(winner);
        setAiWord(aiWord);
        setTurn(TurnState.FINISHED);
        setSummary(summary);
        console.log("Game over with winner:", winner);
        openModal('gameover');
    }

    const handleNavigateBack = (targetPage: "home" | "categoryselection" | "wordselection" | "game") => {
        setCurrentPage(targetPage);
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
        <>
            <Header onClick={handleLogo} onToggleMenu={toggleMenu} />
            {currentPage === 'home' && <Home onNavigate={handleStart} />}
            {currentPage === 'categoryselection' && <CategorySelection onNavigateBack={() => { handleNavigateBack('home') }} onSetCategory={handleSetCategory} />}
            {currentPage === 'wordselection' && category && <WordSelection onNavigateBack={() => handleNavigateBack('categoryselection')} onStartGame={handleOnStartGame} category={category} />}
            {currentPage === 'game' && category && userId && <Game category={category} userId={userId} userWord={userWord} onSetWinner={handleGameOver} openModal={openModal} counter={counter} aiWord={aiWord} onCounterIncrease={handleCounterIncrease} turn={turn} summary={summary} onSetSummary={handleSetSummary} onSetTurn={handleSetTurn} />}
            <Footer openModal={openModal} />
            {showMenu && (
                <Menu onCloseMenu={closeMenu} onMenuOpenModal={handleMenuOpenModal} userWord={userWord} counter={counter} isGameScreen={currentPage === 'game'} turn={turn} />
            )}
            <VersionFlag />
            <Modal content={modalContent} onClose={closeModal} renderContent={renderModalContent} />
        </>
    );
}