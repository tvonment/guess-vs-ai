import { CosmosClient } from "@azure/cosmos";
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

const verifySystemMessage = "Ask a question to narrow down the searched character or make a good guess!";

export async function makeGuess(userId: string) {
    console.log("Make Guess Request received");
    console.log(`User ID: ${userId}`);

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

        // Persist updated chat history in Cosmos DB
        await container.items.upsert({ id: userId, messages: chatHistory, userWord: dbitem.userWord, aiWord: dbitem.aiWord, category: dbitem.category });

        return aiMessage;
    } catch (error: unknown) {
        console.error("Error:", error);
    }
}