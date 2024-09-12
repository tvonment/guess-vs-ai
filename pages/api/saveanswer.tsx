import { CosmosClient } from "@azure/cosmos";
import type { NextApiRequest, NextApiResponse } from 'next';
import { Message } from "./Message";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database("gvaDB");
const container = database.container("chatContainer");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("SaveAnswer Request received");

    const { answer, userId } = req.body;

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
        chatHistory.push(answer);

        // Persist updated chat history in Cosmos DB
        await container.items.upsert({ id: userId, messages: chatHistory, userWord: dbitem.userWord, aiWord: dbitem.aiWord, category: dbitem.category });

        res.status(200).json({ result: true });
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}