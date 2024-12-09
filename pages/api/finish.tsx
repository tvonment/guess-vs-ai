import type { NextApiRequest, NextApiResponse } from 'next';
import { addToHistory, finishGame } from "@/services/cosmosService";
import { makeSummary } from '@/services/aiMessagesServcie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    try {
        const aiWord = await finishGame(userId);
        const responseSummary = await makeSummary(userId);
        await addToHistory(userId, responseSummary);
        res.status(200).json({ result: aiWord, summary: responseSummary.content });
        return;
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}