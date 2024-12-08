import type { NextApiRequest, NextApiResponse } from 'next';
import { finishGame } from "@/services/cosmosService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    try {
        const aiWord = await finishGame(userId);
        res.status(200).json({ result: aiWord });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}