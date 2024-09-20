import { selectWord } from "./wordselection"; // Import the selectWord function
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "./Message";
import { startGame } from "./cosmos";
import { GameStatus } from "./GameStatus";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Start Request received");

    const { userId } = req.body;
    const { category } = req.body;
    const { userWord } = req.body;
    console.log(`User ID: ${userId}`);
    console.log(`Category: ${category}`);
    console.log(`Users word: ${userWord}`);

    const aiWord = await selectWord(category);
    console.log(`AI's word: ${aiWord}`);

    const systemMessageText = "You are playing a game of guess what. You play against a human and you are eager to win. You and the humen are asking questions in turn to narrow down a selected word from the category '" + category + "'! The player who finds it first winns. Your word, that the user has to guess is '" + aiWord + "'. Under no circumstances should you reveal your word to the user. Good luck!";

    try {
        const chatHistory: Message[] = [];

        const systemMessage = {
            role: "system",
            content: systemMessageText,
        };

        const game = new GameStatus(userId, [systemMessage], userWord, aiWord, category);
        await startGame(game);

        res.status(200).json({ result: chatHistory });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}