import { NextApiRequest, NextApiResponse } from "next";
import { selectWord } from "@/services/aiWordSelectionService";
import { startGame } from "@/services/cosmosService";
import { CategoryRef, Game } from "@/model/Game";
import { findCategory } from "@/model/Sections";
import { checkWordInCategory } from "@/services/validationService";
import { Counter } from "@/model/Counter";
import { startMessage } from "@/services/aiMessagesService";
import { modelIdOf } from "@/services/llmService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { userId, categoryName, userWord } = req.body ?? {};
    if (typeof userId !== "string" || !userId || typeof categoryName !== "string" || typeof userWord !== "string" || !userWord.trim()) {
        res.status(400).json({ error: "Missing required parameters: userId, categoryName, userWord" });
        return;
    }

    const found = findCategory(categoryName);
    if (!found) {
        res.status(400).json({ error: `Unknown category '${categoryName}'` });
        return;
    }
    const category: CategoryRef = {
        name: found.category.name,
        description: found.category.description,
        parentName: found.parentName,
        sectionName: found.sectionName,
    };

    try {
        const validWord = await checkWordInCategory(userWord.trim(), category);
        if (!validWord) {
            res.status(200).json({ invalid: true, message: `The word you entered is not valid for the '${category.name}' category. Please try again.` });
            return;
        }

        const aiWord = await selectWord(category);
        const message = await startMessage(category);
        const game = new Game(userId, [message], userWord.trim(), aiWord, category, new Counter(0, 0), modelIdOf("game"), modelIdOf("validation"));
        await startGame(game);
        res.status(200).json({ message: message });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
