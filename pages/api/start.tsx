import { selectWord } from "@/services/aiWordSelectionService"; // Import the selectWord function
import { NextApiRequest, NextApiResponse } from "next";
import { startGame } from "@/services/cosmosService";
import { Game } from "@/model/Game";
import { Category, Categories } from "@/model/Categories";
import { characterCheck } from "@/services/characterCheckService";
import { Counter } from "@/model/Counter";
import { Message } from "@/model/Message";
import { startMessage } from "@/services/aiMessagesService";
import { Opponent, Opponents } from "@/model/Opponent";

function findCategoryByName(name: string): Category | undefined {
    for (const c of Categories) {
        if (c.name === name) return c;
        if (c.subcategories) {
            const sub = c.subcategories.find((s) => s.name === name);
            if (sub) return sub;
        }
    }
    return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;
    const { categoryName } = req.body;
    const { userWord } = req.body;
    const { opponentName } = req.body
    const opponent = Opponents.find((o) => o.name === opponentName) as Opponent;
    const category = findCategoryByName(categoryName) as Category;
    const validWord = await characterCheck(userWord, category);
    if (!validWord) {
        res.status(200).json({ invalid: true, message: `The word you entered is not valid for the '${category.name}' category. Please try again.` });
        return;
    }
    const aiWord = await selectWord(category, opponent);

    console.log(`User ID: ${userId}`);
    console.log(`Category: ${category.name}`);
    console.log(`Users word: ${userWord}`);
    console.log(`AI's word: ${aiWord}`);

    if (!userId || !category || !userWord || !aiWord) {
        console.error("Missing required fields");
        res.status(500).json({ error: "An unknown error occured" });
        return;
    }

    try {
        const message: Message = await startMessage(category, opponent);
        const game = new Game(userId, [message], userWord, aiWord, opponent, category, new Counter(0, 0));
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