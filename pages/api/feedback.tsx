import { getFeedback, writeFeedback } from '@/services/cosmosService';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { feedback } = req.body;
        try {
            const response = await writeFeedback(feedback);
            res.status(200).json({ result: response });
        } catch (error: unknown) {
            console.error("Error:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    } else if (req.method === 'GET') {
        try {
            const response = await getFeedback();
            res.status(200).json({ result: response });
        } catch (error: unknown) {
            console.error("Error:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    } else {
        res.status(400).json({ error: "Bad request" });
    }
}