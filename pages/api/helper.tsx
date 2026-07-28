import type { NextApiRequest, NextApiResponse } from 'next';
import { getGameStatus } from "@/services/cosmosService";
import { askHelper, HelperMessage } from "@/services/helperService";

const MAX_QUESTION_CHARS = 500;
const MAX_HISTORY = 10;
const MAX_MESSAGE_CHARS = 1000;

// Only user/assistant turns from the client are trusted; anything else
// (injected system/tool roles, non-strings) is dropped silently.
function sanitizeHistory(history: unknown): HelperMessage[] {
    if (!Array.isArray(history)) {
        return [];
    }
    return history
        .filter((entry): entry is HelperMessage =>
            !!entry && typeof entry === "object"
            && ((entry as HelperMessage).role === "user" || (entry as HelperMessage).role === "assistant")
            && typeof (entry as HelperMessage).content === "string")
        .slice(-MAX_HISTORY)
        .map((entry) => ({ role: entry.role, content: entry.content.slice(0, MAX_MESSAGE_CHARS) }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { userId, question, history } = req.body ?? {};
    if (typeof userId !== "string" || !userId || typeof question !== "string" || !question.trim()) {
        res.status(400).json({ error: "Missing required parameters: userId and question" });
        return;
    }
    if (question.length > MAX_QUESTION_CHARS) {
        res.status(400).json({ error: `Question too long (max ${MAX_QUESTION_CHARS} characters)` });
        return;
    }

    try {
        const game = await getGameStatus(userId);
        // Only the player's own word and category cross into the helper —
        // never the AI's word or the game transcript.
        const reply = await askHelper(game.userWord, game.category, sanitizeHistory(history), question.trim());
        res.status(200).json(reply);
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
