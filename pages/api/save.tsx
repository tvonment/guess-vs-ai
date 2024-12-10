import type { NextApiRequest, NextApiResponse } from 'next';
import { addToHistory } from "@/services/cosmosService";
import { Answer } from '@/model/Answer';
import { TurnState } from '@/model/TurnState';
import { aiGuessTurn } from '@/services/turnService';
import { Message } from '@/model/Message';
import { TurnResponse } from '@/model/TurnResponse';
import { WinnerState } from '@/model/WinnerState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;
    const answer = req.body.answer as Answer;
    const answerMessage = { role: "user", content: answer } as Message;

    try {
        // Append new user message to chat history
        const response = await addToHistory(userId, answerMessage)
        if (answer === Answer.YES || answer === Answer.PROBABLY_YES) {
            const aiGuess = await aiGuessTurn(userId);
            aiGuess.messages = [answerMessage, ...aiGuess.messages];
            res.status(200).json(aiGuess);
            return;
        } else {
            res.status(200).json(new TurnResponse([response], TurnState.HUMAN, WinnerState.PLAYING));
            return;
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