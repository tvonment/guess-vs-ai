import { writeFeedback } from '@/services/cosmosService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { feedback } = req.body ?? {};
    if (!feedback || typeof feedback !== "object") {
        res.status(400).json({ error: "Missing required parameter: feedback" });
        return;
    }

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
