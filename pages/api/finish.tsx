import type { NextApiRequest, NextApiResponse } from 'next';
import { finishGame } from "@/services/cosmosService";
import { TurnResponse } from '@/model/TurnResponse';
import { TurnState } from '@/model/TurnState';
import { WinnerState } from '@/model/WinnerState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    try {
        const { aiWord, counter, summary } = await finishGame(userId, WinnerState.GIVENUP);
        res.status(200).json(new TurnResponse([], TurnState.FINISHED, WinnerState.GIVENUP, counter, summary, aiWord));
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