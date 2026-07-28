import { CosmosClient } from "@azure/cosmos";
import { Message } from "@/model/Message";
import { Answer } from "@/model/Answer";
import { Categories, Category } from "@/model/Categories";
import { CategoryRef, Game, ReportedIssue } from "@/model/Game";
import { Feedback } from "@/model/Feedback";
import { Counter } from "@/model/Counter";
import { WinnerState } from "@/model/WinnerState";
import { CategoryWins, Statistics, DetailedStatistics, GameStatistics } from "@/model/Statistics";

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
    const dbitem: { messages: Message[] } = db.resources[0];

    return dbitem.messages as Message[]
}

async function updateGame(game: Game) {
    await container.items.upsert(game);
}

export async function increaseCounter(userId: string, player: string): Promise<Counter> {
    const game = await getGameStatus(userId);
    if (player === 'human') {
        game.counter.human++;
    } else if (player === 'ai') {
        game.counter.ai++;
    }
    await updateGame(game);
    return game.counter;
}

export async function getGameStatus(userId: string): Promise<Game> {
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

// The AI's guessing thread: its own questions plus the human's button answers.
// The human's free-text questions and the AI's answers to them are excluded.
export async function getFilteredAiChatHistory(userId: string): Promise<Message[]> {
    const messages = await getChatHistory(userId);
    const isAnswerValue = (content: string) => {
        const normalized = content.replace(/[^a-zA-Z' ]/g, "").trim().toLowerCase();
        return Object.values(Answer).some((answer) => answer.toLowerCase() === normalized);
    };
    return messages.filter(entry => {
        if (entry.role === 'assistant') {
            return !isAnswerValue(entry.content);
        } else if (entry.role === 'user') {
            return isAnswerValue(entry.content);
        }
        return entry.role === 'system';
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

export async function getCategory(userId: string): Promise<CategoryRef> {
    const categoryQuery = `SELECT c.category FROM c WHERE c.id = @userId`;
    const db = await container.items.query({
        query: categoryQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext();
    const dbitem: { category: CategoryRef } = db.resources[0];
    return dbitem.category;
}

export async function addToHistory(userId: string, message: Message): Promise<Message> {
    const game = await getGameStatus(userId);
    game.messages.push(message);
    try {
        await updateGame(game);
        return message;
    } catch (error: unknown) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getUsedCharacters(categoryName: string): Promise<string[]> {
    try {
        // Bounded to the 50 most recent games so the word-selection prompt
        // cannot grow without limit as more games are played.
        const query = `SELECT TOP 50 c.aiWord FROM c WHERE c.category.name = @categoryName ORDER BY c._ts DESC`;
        const db = await container.items.query({
            query: query,
            parameters: [{ name: "@categoryName", value: categoryName }]
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

export async function finishGame(userId: string, winner: WinnerState, summary: Message): Promise<{ aiWord: string, counter: Counter, summary: Message }> {
    const gameStatus = await getGameStatus(userId);

    gameStatus.winner = winner;
    gameStatus.summary = summary;
    gameStatus.finishedAt = new Date().toISOString();
    await updateGame(gameStatus);

    return { aiWord: gameStatus.aiWord, counter: gameStatus.counter, summary: summary };
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

export async function getFeedback(): Promise<Feedback[]> {
    try {
        const query = `SELECT * FROM c`;
        const db = await feedbackContainer.items.query({
            query: query
        }).fetchAll();
        return db.resources as Feedback[];
    }
    catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        throw "An error occurred";
    }
}

export async function getIssues(): Promise<{ id: string, issues: ReportedIssue[] }[]> {
    try {
        const query = `SELECT c.id, c.issues FROM c WHERE c.issues != null`;
        const db = await container.items.query({
            query: query
        }).fetchAll();
        const games: { id: string, issues: ReportedIssue[] }[] = db.resources;
        return games;
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        throw "An error occurred";
    }
}

function getMedian(arr: number[]): number {
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);

    if (sortedArr.length % 2 === 0) {
        return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    } else {
        return sortedArr[mid];
    }
}

export async function getStatistics(): Promise<Statistics> {
    try {
        const startedQuery = `SELECT VALUE COUNT(1) FROM c`;
        const startedResult = await container.items.query({
            query: startedQuery
        }).fetchAll();
        const startedCount = startedResult.resources[0];

        const givenUpQuery = `SELECT VALUE COUNT(1) FROM c WHERE c.winner = '${WinnerState.GIVENUP}'`;
        const givenUpResult = await container.items.query({
            query: givenUpQuery
        }).fetchAll();
        const givenUpCount = givenUpResult.resources[0];

        const statisticsQuery = `SELECT * FROM c WHERE c.winner IN ('${WinnerState.AI}', '${WinnerState.HUMAN}')`;
        const db = await container.items.query({
            query: statisticsQuery
        }).fetchAll();
        const totalGames = db.resources.length;

        const aiWins = db.resources.filter((game: Game) => game.winner === WinnerState.AI);
        const humanWins = db.resources.filter((game: Game) => game.winner === WinnerState.HUMAN);

        const totalAIWins = aiWins.length;
        const totalHumanWins = humanWins.length;

        const minQuestionCountAI = aiWins.reduce((acc: number, game: Game) => Math.min(acc, game.counter.ai), Number.MAX_VALUE);
        const maxQuestionCountAI = aiWins.reduce((acc: number, game: Game) => Math.max(acc, game.counter.ai), 0);
        const medQuestionCountAI = aiWins.length > 0 ? getMedian(aiWins.map(win => win.counter.ai)) : 0;
        const avgQuestionCountAI = aiWins.reduce((acc: number, game: Game) => acc + game.counter.ai, 0) / aiWins.length;

        const minQuestionCountHuman = humanWins.reduce((acc: number, game: Game) => Math.min(acc, game.counter.human), Number.MAX_VALUE);
        const maxQuestionCountHuman = humanWins.reduce((acc: number, game: Game) => Math.max(acc, game.counter.human), 0);
        const medQuestionCountHuman = humanWins.length > 0 ? getMedian(humanWins.map(win => win.counter.human)) : 0;
        const avgQuestionCountHuman = humanWins.reduce((acc: number, game: Game) => acc + game.counter.human, 0) / humanWins.length;

        const winsByCategory: CategoryWins[] = [];
        const categories: Category[] = Categories;

        await Promise.all(
            categories.map(async (category: Category) => {
                const startedQuery = `SELECT VALUE COUNT(1) FROM c WHERE c.category.name = '${category.name}'`;
                const startedResult = await container.items.query({
                    query: startedQuery
                }).fetchAll();
                const startedCount = startedResult.resources[0];

                const givenUpQuery = `SELECT VALUE COUNT(1) FROM c WHERE c.category.name = '${category.name}' AND c.winner = '${WinnerState.GIVENUP}'`;
                const givenUpResult = await container.items.query({
                    query: givenUpQuery
                }).fetchAll();
                const givenUpCount = givenUpResult.resources[0];

                const categoryAiWins = aiWins.filter((game: Game) => game.category.name === category.name);
                const categoryHumanWins = humanWins.filter((game: Game) => game.category.name === category.name);
                const categoryWins: CategoryWins = {
                    category: category,
                    aiWins: categoryAiWins.length,
                    humanWins: categoryHumanWins.length,
                    givenUp: givenUpCount,
                    started: startedCount,
                    minQuestionCountAI: categoryAiWins.length > 0 ? categoryAiWins.reduce((acc: number, game: Game) => Math.min(acc, game.counter.ai), Number.MAX_VALUE) : 0,
                    maxQuestionCountAI: categoryAiWins.length > 0 ? categoryAiWins.reduce((acc: number, game: Game) => Math.max(acc, game.counter.ai), 0) : 0,
                    medQuestionCountAI: categoryAiWins.length > 0 ? categoryAiWins[Math.floor(categoryAiWins.length / 2)].counter.ai : 0,
                    avgQuestionCountAI: categoryAiWins.length > 0 ? categoryAiWins.reduce((acc: number, game: Game) => acc + game.counter.ai, 0) / categoryAiWins.length : 0,
                    minQuestionCountHuman: categoryHumanWins.length > 0 ? categoryHumanWins.reduce((acc: number, game: Game) => Math.min(acc, game.counter.human), Number.MAX_VALUE) : 0,
                    maxQuestionCountHuman: categoryHumanWins.length > 0 ? categoryHumanWins.reduce((acc: number, game: Game) => Math.max(acc, game.counter.human), 0) : 0,
                    medQuestionCountHuman: categoryHumanWins.length > 0 ? categoryHumanWins[Math.floor(categoryHumanWins.length / 2)].counter.human : 0,
                    avgQuestionCountHuman: categoryHumanWins.length > 0 ? categoryHumanWins.reduce((acc: number, game: Game) => acc + game.counter.human, 0) / categoryHumanWins.length : 0
                };
                winsByCategory.push(categoryWins);
            })
        );

        return {
            totalGames: totalGames,
            totalAIWins: totalAIWins,
            totalHumanWins: totalHumanWins,
            totalGivenUp: givenUpCount,
            totalStarted: startedCount,
            minQuestionCountHuman: minQuestionCountHuman,
            maxQuestionCountHuman: maxQuestionCountHuman,
            medQuestionCountHuman: medQuestionCountHuman,
            avgQuestionCountHuman: avgQuestionCountHuman,
            minQuestionCountAI: minQuestionCountAI,
            maxQuestionCountAI: maxQuestionCountAI,
            medQuestionCountAI: medQuestionCountAI,
            avgQuestionCountAI: avgQuestionCountAI,
            winsByCategory: winsByCategory
        } as Statistics;
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        throw "An error occurred";
    }
}

async function getGameStatistics(): Promise<GameStatistics[]> {
    try {
        const query = `SELECT * FROM c WHERE c.winner IN ('${WinnerState.AI}', '${WinnerState.HUMAN}')`;
        const db = await container.items.query({
            query: query
        }).fetchAll();
        const games: Game[] = db.resources;
        const gameStatistics: GameStatistics[] = games.map((game: Game) => {
            return {
                id: game.id,
                userWord: game.userWord,
                aiWord: game.aiWord,
                categoryName: game.category.name,
                winner: game.winner,
                counter: game.counter,
                messages: game.messages,
            } as GameStatistics;
        });
        return gameStatistics;
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        throw "An error occurred";
    }
}

export async function getDetailedStatistics(): Promise<DetailedStatistics> {
    try {
        const basicStatistics = await getStatistics();
        const gamesStatistics = await getGameStatistics();
        const detailedStatistics: DetailedStatistics = {
            basic: basicStatistics,
            games: gamesStatistics
        };
        return detailedStatistics;
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        throw "An error occurred";
    }
}
