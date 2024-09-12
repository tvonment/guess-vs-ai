import { CosmosClient } from "@azure/cosmos";
import { selectWord } from "./wordselection"; // Import the selectWord function
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "./Message";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database("gvaDB");
const container = database.container("chatContainer");

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

        // Append new AI message to chat history
        chatHistory.push(systemMessage);

        // Update chat history in Cosmos DB
        await container.items.create({ id: userId, category: category, userWord: userWord, aiWord: aiWord, messages: chatHistory });
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