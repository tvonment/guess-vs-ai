import { CosmosClient } from "@azure/cosmos";
import { makeGuess } from "./guess"; // Import the selectWord function
import { winCheck } from "./wincheck";
import type { NextApiRequest, NextApiResponse } from 'next';
import { Message } from "./Message";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database("gvaDB");
const container = database.container("chatContainer");

const temperature = 0.5;
const max_tokens = 100;
const top_p = 1;

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_API_URL;

const verifySystemMessage = "verify if the human's question is correct. Only answer with 'yes', 'probably yes', 'probably no', 'no' or 'i don't know'.";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("GameRound Request received");

    const { text, userId } = req.body;

    const userMessage = {
        role: "user",
        content: text
    };

    const systemMessage = {
        role: "system",
        content: verifySystemMessage
    };

    try {
        // Retrieve chat history from Cosmos DB
        const historyQuery = `SELECT * FROM c WHERE c.id = @userId`;
        const db = await container.items.query({
            query: historyQuery,
            parameters: [{ name: "@userId", value: userId }]
        }).fetchNext();
        const dbitem: { id: string, messages: Message[], userWord: string, aiWord: string, category: string } = db.resources[0];

        const chatHistory = dbitem.messages

        // Append new user message to chat history
        chatHistory.push(userMessage);

        const response = await fetch(`${OPENAI_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${API_KEY}`,
            },
            body: JSON.stringify({
                messages: [...chatHistory, systemMessage],
                temperature: temperature,
                max_tokens: max_tokens,
                top_p: top_p
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message;

        // Append AI response to chat history
        chatHistory.push(aiMessage);

        const guess = await makeGuess(userId);
        chatHistory.push(guess);

        // Check if user won
        const userwin = await winCheck(text, dbitem.aiWord);

        // Check if AI won
        const aiwin = await winCheck(guess.content, dbitem.userWord);

        if (userwin || aiwin) {
            chatHistory.push({ role: "system", content: "Game Over" });
            await container.items.upsert({ id: userId, messages: chatHistory, userWord: dbitem.userWord, aiWord: dbitem.aiWord, category: dbitem.category, winner: userwin ? "human" : "ai" });
            res.status(200).json({ result: [aiMessage, guess], aiWin: aiwin, userWin: userwin, aiWord: dbitem.aiWord });
        } else {
            // Persist updated chat history in Cosmos DB
            await container.items.upsert({ id: userId, messages: chatHistory, userWord: dbitem.userWord, aiWord: dbitem.aiWord, category: dbitem.category });
            res.status(200).json({ result: [aiMessage, guess], aiWin: aiwin, userWin: userwin });
        }
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}