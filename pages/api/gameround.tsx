import { makeGuess } from "./guess"; // Import the selectWord function
import { verifyUserQuestion } from "./verifyuserquestion";
import { winCheck } from "./wincheck";
import type { NextApiRequest, NextApiResponse } from 'next';
import { addToHistory, getCategory, getChatHistory, getWinningWords, updateGameStatus } from "./cosmos";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("GameRound Request received");

    const { text, userId } = req.body;

    try {
        const aiAnswer = await verifyUserQuestion(userId, text);
        const aiAnswerResponse = await addToHistory(userId, aiAnswer);
        const guess = await makeGuess(userId);
        const guessResponse = await addToHistory(userId, guess);
        const winningWords = await getWinningWords(userId);
        // Check if user won
        const userwin = await winCheck(text, winningWords.aiWord);
        // Check if AI won
        const aiwin = await winCheck(guess.content, winningWords.userWord);

        if (userwin || aiwin) {
            const systemResponse = await addToHistory(userId, { role: "system", content: "Game over!" }, userwin ? "human" : "ai");
            res.status(200).json({ result: [aiAnswerResponse, guessResponse], aiWin: aiwin, userWin: userwin, aiWord: winningWords.aiWord });
        } else {
            res.status(200).json({ result: [aiAnswerResponse, guessResponse], aiWin: aiwin, userWin: userwin });
        }

    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }

    try {


    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}