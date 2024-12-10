import type { NextApiRequest, NextApiResponse } from 'next';
import { TurnState } from "@/model/TurnState";
import { aiGuessTurn, humanGuessTurn } from "@/services/turnService";
import { TurnResponse } from '@/model/TurnResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text, userId } = req.body;

    try {
        const humanGuess = await humanGuessTurn(userId, text);

        if (humanGuess.turn !== TurnState.AI) {
            res.status(200).json(humanGuess);
            return;
        }

        const aiGuess = await aiGuessTurn(userId) as TurnResponse;
        aiGuess.messages = [...humanGuess.messages, ...aiGuess.messages];
        res.status(200).json(aiGuess);

    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}