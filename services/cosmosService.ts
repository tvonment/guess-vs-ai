import { CosmosClient } from "@azure/cosmos";
import { Message } from "@/model/Message";
import { Answer } from "@/model/Answer";
import { Category } from "@/model/Categories";
import { Game, ReportedIssue } from "@/model/Game";
import { Feedback } from "@/model/Feedback";
import { randomUUID } from "crypto";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";
const COSMOS_DB_DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME || "";
const COSMOS_DB_CONTAINER_NAME = process.env.COSMOS_DB_CONTAINER_NAME || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database(COSMOS_DB_DATABASE_NAME);
const container = database.container(COSMOS_DB_CONTAINER_NAME);
const feedbackContainer = database.container("feedback");

async function getChatHistory(userId: string): Promise<Message[]> {
    // Retrieve chat history from Cosmos DB
    const historyQuery = `SELECT c.messages FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { id: string, messages: Message[], userWord: string, aiWord: string, category: string } = db.resources[0];

    return dbitem.messages as Message[]
}

async function getGameStatus(userId: string): Promise<Game> {
    try {
        const statusQuery = `SELECT * FROM c WHERE c.id = @userId`;
        const db = await container.items.query({
            query: statusQuery,
            parameters: [{ name: "@userId", value: userId }]
        }).fetchNext();
        return db.resources[0] as Game;
    } catch (error: unknown) {
        console.error("Error:", error);
        throw error;
    }
}

export async function startGame(gameStatus: Game) {
    await container.items.create(gameStatus);
}

export async function getFilteredAiChatHistory(userId: string): Promise<Message[]> {
    // Retrieve chat history from Cosmos DB
    const messages = await getChatHistory(userId);
    return messages.filter(entry => {
        // remove special characters
        if (entry.role === 'assistant') {
            entry.content = entry.content.replace(/[^a-zA-Z ]/g, "");
            return !Object.values(Answer).includes(entry.content as Answer);
        } else if (entry.role === 'user') {
            return Object.values(Answer).includes(entry.content as Answer);
        } else if (entry.role === 'system') {
            return true;
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

export async function updateGame(game: Game) {
    await container.items.upsert(game);
}

export async function addToHistory(userId: string, message: Message, winner?: string): Promise<Message> {
    const game = await getGameStatus(userId);
    game.messages.push(message);
    if (winner) {
        game.winner = winner;
    }
    try {
        await updateGame(game);
        return message;
    } catch (error: unknown) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getUsedCharacters(category: Category): Promise<string[]> {
    try {
        // Retrieve chat history from Cosmos DB
        const query = `SELECT c.aiWord FROM c WHERE c.category.name = @categoryName`;
        const db = await container.items.query({
            query: query,
            parameters: [{ name: "@categoryName", value: category.name }]
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

export async function finishGame(userId: string): Promise<string> {
    const gameStatus = await getGameStatus(userId);
    gameStatus.winner = "given up";

    try {
        await updateGame(gameStatus);
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
    }

    try {
        const aiWord = await getAiWord(userId);
        return aiWord;
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        return "An error occurred";
    }
}

export async function reportIssue(userId: string, reportedIssue: ReportedIssue): Promise<string> {
    try {
        const game = await getGameStatus(userId);

        if (!reportedIssue.message) { reportedIssue.message = "No message provided"; }
        if (!game.issues) { game.issues = []; }

        game.issues.push(reportedIssue);
        await updateGame(game);
        return "Issue successfully reported!";
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        return "An error occurred";
    }
}

export async function writeFeedback(feedback: Feedback): Promise<string> {
    try {
        await feedbackContainer.items.create(feedback);
        return "Feedback successfully submitted";
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        return "An error occurred";
    }
}
