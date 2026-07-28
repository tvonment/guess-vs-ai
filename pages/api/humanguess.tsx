import type { NextApiRequest, NextApiResponse } from 'next';
import { TurnState } from "@/model/TurnState";
import { aiGuessTurn, humanGuessTurn } from "@/services/turnService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { text, userId } = req.body ?? {};
    if (typeof userId !== "string" || !userId || typeof text !== "string" || !text.trim()) {
        res.status(400).json({ error: "Missing required parameters: userId and text" });
        return;
    }

    try {
        const humanGuess = await humanGuessTurn(userId, text);

        if (humanGuess.turn !== TurnState.AI) {
            res.status(200).json(humanGuess);
            return;
        }

        const aiGuess = await aiGuessTurn(userId);
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
