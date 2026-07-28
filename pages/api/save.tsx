import type { NextApiRequest, NextApiResponse } from 'next';
import { addToHistory } from "@/services/cosmosService";
import { Answer } from '@/model/Answer';
import { TurnState } from '@/model/TurnState';
import { aiGuessTurn } from '@/services/turnService';
import { Message } from '@/model/Message';
import { TurnResponse } from '@/model/TurnResponse';
import { WinnerState } from '@/model/WinnerState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { userId, answer } = req.body ?? {};
    if (typeof userId !== "string" || !userId || !Object.values(Answer).includes(answer as Answer)) {
        res.status(400).json({ error: "Missing required parameters: userId and a valid answer" });
        return;
    }

    const answerMessage = new Message("user", answer as Answer);

    try {
        const response = await addToHistory(userId, answerMessage);
        if (answer === Answer.YES) {
            // A plain "Yes" lets the AI keep its turn and ask again.
            const aiGuess = await aiGuessTurn(userId);
            aiGuess.messages = [answerMessage, ...aiGuess.messages];
            res.status(200).json(aiGuess);
            return;
        }
        res.status(200).json(new TurnResponse([response], TurnState.HUMAN, WinnerState.PLAYING));
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
