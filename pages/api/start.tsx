import { selectWord } from "@/services/aiWordSelectionService"; // Import the selectWord function
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "@/model/Message";
import { startGame } from "@/services/cosmosService";
import { Game } from "@/model/Game";
import { Category, Categories } from "@/model/Categories";
import { characterCheck } from "@/services/characterCheckService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Start Request received");
    const { userId } = req.body;
    const { categoryName } = req.body;
    const { userWord } = req.body;
    const category = Categories.find((c) => c.name === categoryName) as Category;
    console.log(`User ID: ${userId}`);
    console.log(`Category: ${category.name}`);
    console.log(`Users word: ${userWord}`);
    const validWord = await characterCheck(userWord, category);
    if (!validWord) {
        res.status(200).json({ invalid: true, message: `The word you entered is not valid for the '${category.name}' category. Please try again.` });
        return;
    }
    const aiWord = await selectWord(category);
    console.log(`AI's word: ${aiWord}`);

    try {
        const startMessage: Message = { role: "assistant", content: `Alright, I've locked in my word from the '${category.name}' category. Your move—ask away, and let's see what you've got!` };
        const game = new Game(userId, [], userWord, aiWord, category);
        await startGame(game);
        res.status(200).json({ result: "success" });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}