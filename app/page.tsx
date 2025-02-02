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
import { Message } from '@/model/Message';
import { Counter } from '@/model/Counter';
import { PageState } from '@/model/PageState';
import { ModalState } from '@/model/ModalState';
import StatisticsModal from './components/modal/StatisticsModal';
import Install from './components/modal/Install';
import { Opponent } from '@/model/Opponent';
import OpponentSelection from './components/OpponentSelection';

export default function MainPage() {
    const [currentPage, setCurrentPage] = useState<PageState>(PageState.HOME);
    const [opponent, setOpponent] = useState<Opponent>();
    const [category, setCategory] = useState<Category>();
    const [userWord, setUserWord] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [winner, setWinner] = useState<string>("");
    const [aiWord, setAiWord] = useState<string>("");
    const [modalContent, setModalContent] = useState<ModalState | null>(null);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [counter, setCounter] = useState<Counter>(new Counter(0, 0));
    const [turn, setTurn] = useState<TurnState>(TurnState.LOADING);
    const [summary, setSummary] = useState<Message>({ role: 'system', content: '' });
    const [startMessage, setStartMessage] = useState<Message>({ role: 'assistant', content: '' });
    const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    const handleMenuOpenModal = (content: ModalState) => {
        closeMenu();
        openModal(content);
    };

    const openModal = (content: ModalState) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const handleSetTurn = (turn: TurnState) => {
        setTurn(turn);
    }

    const handleSetSummary = (summary: Message) => {
        setSummary(summary);
    }

    const handleFeedbackSent = () => {
        setFeedbackSent(true);
    }

    const renderModalContent = () => {
        switch (modalContent) {
            case ModalState.STATISTICS:
                return <StatisticsModal />;
            case ModalState.FAQ:
                return <Faq />;
            case ModalState.TOU:
                return <TermsOfUse />;
            case ModalState.CONTACT:
                return <Contact />;
            case ModalState.GIVEUP:
                return <Confirm onClose={closeModal} onConfirm={handleGameOver} userId={userId} />;
            case ModalState.HELP:
                return <Help onClose={closeModal} category={category} />;
            case ModalState.REPORT_INGAME:
                return <ReportIssue onClose={closeModal} gameStatus='ingame' userId={userId} />;
            case ModalState.REPORT_GAMEOVER:
                return <ReportIssue onClose={closeModal} gameStatus='gameover' userId={userId} />;
            case ModalState.GAME_OVER:
                return <GameOverModal onClose={closeModal} winner={winner} aiWord={aiWord} summary={summary} openModal={openModal} />;
            case ModalState.FEEDBACK:
                return <FeedbackForm onClose={closeModal} userId={userId} onFeedbackSent={handleFeedbackSent} />;
            case ModalState.INSTALL:
                return <Install />;
            default:
                return null;
        }
    };

    const handleLogo = () => {
        switch (currentPage) {
            case 'game':
                openModal(ModalState.GIVEUP);
                break;
            default:
                setCurrentPage(PageState.HOME);
                break;
        }
    }

    const handleStart = () => {
        setOpponent(undefined);
        setCategory(undefined);
        setUserWord("");
        setUserId("");
        setWinner("");
        setAiWord("");
        setFeedbackSent(false);
        setCounter(new Counter(0, 0));
        setSummary({ role: 'system', content: '' });
        setTurn(TurnState.LOADING);
        setCurrentPage(PageState.OPPONENT_SELECTION);
        closeModal();
    };

    const handleSetOpponent = (selectedOpponent: Opponent) => {
        setOpponent(selectedOpponent);
        setCurrentPage(PageState.CATEGORY_SELECTION);
    };

    const handleSetCategory = (selectedCategory: Category) => {
        setCategory(selectedCategory);
        setCurrentPage(PageState.WORD_SELECTION);
    };

    const handleOnStartGame = (userId: string, userWord: string, startMessage: Message) => {
        setUserId(userId);
        setUserWord(userWord);
        setStartMessage(startMessage);
        setCurrentPage(PageState.GAME);
        setTurn(TurnState.HUMAN);
    }

    const handleGameOver = async (winner: string, aiWord: string, summary: Message) => {
        setWinner(winner);
        setAiWord(aiWord);
        setTurn(TurnState.FINISHED);
        setSummary(summary);
        console.log("Game over with winner:", winner);
        openModal(ModalState.GAME_OVER);
    }

    const handleNavigateBack = () => {
        switch (currentPage) {
            case PageState.OPPONENT_SELECTION:
                setCurrentPage(PageState.HOME);
                break;
            case PageState.CATEGORY_SELECTION:
                setCurrentPage(PageState.OPPONENT_SELECTION);
                break;
            case PageState.WORD_SELECTION:
                setCurrentPage(PageState.CATEGORY_SELECTION);
                break;
            default:
                setCurrentPage(PageState.HOME);
                break;
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
        <>
            <Header currentPage={currentPage} onClick={handleLogo} onToggleMenu={toggleMenu} onNavigateBack={() => handleNavigateBack()} />
            {currentPage === PageState.HOME && <Home onNavigate={handleStart} />}
            {currentPage === PageState.OPPONENT_SELECTION && <OpponentSelection onSetOpponent={handleSetOpponent} />}
            {currentPage === PageState.CATEGORY_SELECTION && <CategorySelection onSetCategory={handleSetCategory} />}
            {currentPage === PageState.WORD_SELECTION && category && opponent && <WordSelection onStartGame={handleOnStartGame} opponent={opponent} category={category} />}
            {currentPage === PageState.GAME && opponent && category && userId && <Game opponent={opponent} category={category} userId={userId} userWord={userWord} startMessage={startMessage} feedbackSent={feedbackSent} onSetWinner={handleGameOver} openModal={openModal} counter={counter} aiWord={aiWord} onSetCounter={setCounter} turn={turn} summary={summary} onSetSummary={handleSetSummary} onSetTurn={handleSetTurn} onRestart={handleStart} />}
            <Footer openModal={openModal} />
            {showMenu && (
                <Menu onCloseMenu={closeMenu} onMenuOpenModal={handleMenuOpenModal} userWord={userWord} opponent={opponent!} counter={counter} feedbackSent={feedbackSent} isGameScreen={currentPage === 'game'} turn={turn} onRestart={handleStart} />
            )}
            <VersionFlag />
            <Modal content={modalContent} onClose={closeModal} renderContent={renderModalContent} />
        </>
    );
}