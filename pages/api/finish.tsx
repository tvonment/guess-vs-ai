import type { NextApiRequest, NextApiResponse } from 'next';
import { finishTurn } from "@/services/turnService";
import { TurnResponse } from '@/model/TurnResponse';
import { TurnState } from '@/model/TurnState';
import { WinnerState } from '@/model/WinnerState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { userId } = req.body ?? {};
    if (typeof userId !== "string" || !userId) {
        res.status(400).json({ error: "Missing required parameter: userId" });
        return;
    }

    try {
        const { aiWord, counter, summary } = await finishTurn(userId, WinnerState.GIVENUP);
        res.status(200).json(new TurnResponse([], TurnState.FINISHED, WinnerState.GIVENUP, counter, summary, aiWord));
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
