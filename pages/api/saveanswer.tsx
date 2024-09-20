import type { NextApiRequest, NextApiResponse } from 'next';
import { addToHistory } from "./cosmosService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("SaveAnswer Request received");

    const { answer, userId } = req.body;
    const answerMessage = { role: "user", content: answer };

    try {
        // Append new user message to chat history
        const response = await addToHistory(userId, answerMessage)
        res.status(200).json({ result: response });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}