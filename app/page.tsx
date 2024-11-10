"use client";
import { useState } from 'react';

import Home from './components/Home';
import CategorySelection from './components/CategorySelection';
import Game from './components/Game';
import { Category } from '@/model/Categories';
import WordSelection from './components/WordSelection';
import GameOver from './components/GameOver';


export default function MainPage() {
    const [currentPage, setCurrentPage] = useState<'home' | 'categoryselection' | 'wordselection' | 'game' | 'gameover'>('home');
    const [category, setCategory] = useState<Category>();
    const [userId, setUserId] = useState<string>("");
    const [winner, setWinner] = useState<string>("");
    const [aiWord, setAiWord] = useState<string>("");

    const handleStart = () => {
        setCurrentPage('categoryselection');
    };

    const handleSetCategory = (selectedCategory: Category) => {
        setCategory(selectedCategory);
        setCurrentPage('wordselection');
    };

    const handleOnStartGame = (userId: string) => {
        setUserId(userId);
        setCurrentPage('game');
    }

    const handleGameOver = (winner: string, aiWord: string) => {
        setWinner(winner);
        setAiWord(aiWord);
        setCurrentPage('gameover');
    }

    return (
        <>
            {currentPage === 'home' && <Home onNavigate={handleStart} />}
            {currentPage === 'categoryselection' && <CategorySelection onNavigateBack={() => setCurrentPage('home')} onSetCategory={handleSetCategory} />}
            {currentPage === 'wordselection' && category && <WordSelection onNavigateBack={() => setCurrentPage('categoryselection')} onStartGame={handleOnStartGame} category={category} />}
            {currentPage === 'game' && category && userId && <Game category={category} userId={userId} onSetWinner={handleGameOver} />}
            {currentPage === 'gameover' && <GameOver winner={winner} aiWord={aiWord} onNavigate={() => setCurrentPage('categoryselection')} />}
        </>
    );
}