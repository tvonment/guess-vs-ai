import { selectWord } from "@/services/aiWordSelectionService"; // Import the selectWord function
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "@/model/Message";
import { startGame } from "@/services/cosmosService";
import { GameStatus } from "@/model/GameStatus";
import { Category, Categories } from "@/model/Categories";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Start Request received");

    const { userId } = req.body;
    const { categoryName } = req.body;
    const { userWord } = req.body;
    const category = Categories.find((c) => c.name === categoryName) as Category;
    console.log(`User ID: ${userId}`);
    console.log(`Category: ${category.name}`);
    console.log(`Users word: ${userWord}`);

    const aiWord = await selectWord(category);
    console.log(`AI's word: ${aiWord}`);

    try {
        const startMessage: Message = { role: "assistant", content: `Alright, I've locked in my word from the '${category.name}' category. Your move—ask away, and let's see what you've got!` };
        const game = new GameStatus(userId, [], userWord, aiWord, category);
        await startGame(game);
        res.status(200).json({ result: [startMessage] });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}