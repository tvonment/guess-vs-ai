import { reportIssue } from '@/services/cosmosService';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { userId, reportedIssue } = req.body ?? {};
    if (typeof userId !== "string" || !userId || !reportedIssue || typeof reportedIssue !== "object") {
        res.status(400).json({ error: "Missing required parameters: userId and reportedIssue" });
        return;
    }

    try {
        const response = await reportIssue(userId, reportedIssue);
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