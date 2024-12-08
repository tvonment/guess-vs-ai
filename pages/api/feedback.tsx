import { writeFeedback } from '@/services/cosmosService';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
}