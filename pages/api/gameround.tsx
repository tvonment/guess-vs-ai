import { makeGuess } from "./aiGuessService"; // Import the selectWord function
import { verifyHumanQuestion } from "./humanQuestionVerificationService";
import { winCheck } from "./winCheckService";
import type { NextApiRequest, NextApiResponse } from 'next';
import { addToHistory, getWinningWords } from "./cosmosService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("GameRound Request received");
    const { text, userId } = req.body;

    try {
        const winningWords = await getWinningWords(userId);
        // Check if user won
        const userwin = await winCheck(text, winningWords.aiWord);

        if (userwin) {
            const systemResponse = await addToHistory(userId, { role: "system", content: "Game over! - Human wins." }, "human");
            console.log(systemResponse.content);
            const aiAnswer = { role: "assistant", content: "Congrats, you won!" };
            res.status(200).json({ result: [aiAnswer], aiWin: false, userWin: userwin, aiWord: winningWords.aiWord });
            return;
        }

        const aiAnswer = await verifyHumanQuestion(userId, text);
        const aiAnswerResponse = await addToHistory(userId, aiAnswer);

        const guess = await makeGuess(userId);
        const guessResponse = await addToHistory(userId, guess);

        // Check if AI won
        const aiwin = await winCheck(guess.content, winningWords.userWord);

        if (aiwin) {
            const systemResponse = await addToHistory(userId, { role: "system", content: "Game over! - AI wins." }, "ai");
            console.log(systemResponse.content);
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
}