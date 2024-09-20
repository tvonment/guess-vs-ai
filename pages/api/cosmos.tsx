import { CosmosClient } from "@azure/cosmos";
import { Message } from "./Message";
import { Answer } from "@/enum/Answer";
import { Category } from "@/enum/Categories";
import { GameStatus } from "./GameStatus";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database("gvaDB");
const container = database.container("chatContainer");

export async function startGame(gameStatus: GameStatus) {
    await container.items.create(gameStatus);
}

export async function getChatHistory(userId: string): Promise<Message[]> {
    // Retrieve chat history from Cosmos DB
    const historyQuery = `SELECT c.messages FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { id: string, messages: Message[], userWord: string, aiWord: string, category: string } = db.resources[0];

    return dbitem.messages as Message[]
}

export async function getFilteredAiChatHistory(userId: string): Promise<Message[]> {
    // Retrieve chat history from Cosmos DB
    const historyQuery = `SELECT * FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { id: string, messages: Message[], userWord: string, aiWord: string, category: string } = db.resources[0];
    return dbitem.messages.filter(entry => {
        // remove special characters
        entry.content = entry.content.replace(/[^a-zA-Z ]/g, "");
        if (entry.role === 'assistant') {
            return !Object.values(Answer).includes(entry.content as Answer);
        } else if (entry.role === 'user') {
            return Object.values(Answer).includes(entry.content as Answer);
        }
    });
}

export async function getWinningWords(userId: string): Promise<{ userWord: string, aiWord: string }> {
    const historyQuery = `SELECT c.userWord, c.aiWord FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { userWord: string, aiWord: string } = db.resources[0];
    return { userWord: dbitem.userWord, aiWord: dbitem.aiWord };
}

export async function getAiWord(userId: string): Promise<string> {
    const historyQuery = `SELECT c.aiWord FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { aiWord: string } = db.resources[0];
    return dbitem.aiWord;
}

export async function getCategory(userId: string): Promise<Category> {
    const categoryQuery = `SELECT c.category FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: categoryQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { category: Category } = db.resources[0];
    return dbitem.category;
}

export async function updateGameStatus(gameStatus: GameStatus) {
    await container.items.upsert(gameStatus);
}

export async function getGameStatus(userId: string): Promise<GameStatus> {
    const statusQuery = `SELECT * FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: statusQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    return db.resources[0] as GameStatus;
}

export async function addToHistory(userId: string, message: Message, winner?: string): Promise<Message> {
    const gameStatus = await getGameStatus(userId);
    gameStatus.messages.push(message);
    if (winner) {
        gameStatus.winner = winner;
    }
    try {
        await updateGameStatus(gameStatus);
        return message;
    } catch (error: unknown) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getUsedCharacters(category: string): Promise<string[]> {
    console.log("Get Used Characters Request received");

    try {
        // Retrieve chat history from Cosmos DB
        const query = `SELECT c.aiWord FROM c WHERE c.category = @category`;
        const db = await container.items.query({
            query: query,
            parameters: [{ name: "@category", value: category }]
        }).fetchAll();
        const usedCharacters: { aiWord: string }[] = db.resources;
        const usedCharactersArray: string[] = usedCharacters.map((item) => item.aiWord);
        return usedCharactersArray as string[] || [];
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        return [];
    }
}