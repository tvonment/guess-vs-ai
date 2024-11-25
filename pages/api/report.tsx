import { reportIssue } from '@/services/cosmosService';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Report Request received");

    const { userId, gameStatus, message } = req.body;

    try {
        const response = await reportIssue(userId, gameStatus, message);
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