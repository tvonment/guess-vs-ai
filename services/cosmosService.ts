import { CosmosClient } from "@azure/cosmos";
import { Message } from "@/model/Message";
import { Answer } from "@/model/Answer";
import { CategoryRef, Game, ReportedIssue } from "@/model/Game";
import { Feedback } from "@/model/Feedback";
import { Counter } from "@/model/Counter";
import { WinnerState } from "@/model/WinnerState";
import { CategoryWins, SectionWins, Statistics } from "@/model/Statistics";
import { Sections, findCategory } from "@/model/Sections";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";
const COSMOS_DB_DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME || "";
const COSMOS_DB_CONTAINER_NAME = process.env.COSMOS_DB_CONTAINER_NAME || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database(COSMOS_DB_DATABASE_NAME);
const container = database.container(COSMOS_DB_CONTAINER_NAME);
const feedbackContainer = database.container("feedback");

// Retries transient Cosmos failures with linear backoff before giving up.
async function retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 500): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: unknown) {
            lastError = error;
            console.warn(`Database operation attempt ${attempt}/${maxRetries} failed:`, error instanceof Error ? error.message : error);
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }
    throw lastError instanceof Error ? lastError : new Error("Database operation failed after retries");
}

async function getChatHistory(userId: string): Promise<Message[]> {
    // Retrieve chat history from Cosmos DB
    const historyQuery = `SELECT c.messages FROM c WHERE c.id = @userId`;
    const db = await retryOperation(() => container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext());
    const dbitem: { messages: Message[] } = db.resources[0];

    return dbitem.messages as Message[]
}

async function updateGame(game: Game) {
    await retryOperation(() => container.items.upsert(game));
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
        const db = await retryOperation(() => container.items.query({
            query: statusQuery,
            parameters: [{ name: "@userId", value: userId }]
        }).fetchNext());
        const game = db.resources[0] as Game | undefined;
        if (!game) {
            throw new Error(`No game found for id '${userId}'`);
        }
        return game;
    } catch (error: unknown) {
        console.error("Error:", error);
        throw error;
    }
}

export async function startGame(gameStatus: Game) {
    await retryOperation(() => container.items.create(gameStatus));
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
    const db = await retryOperation(() => container.items.query({
        query: historyQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext());
    const dbitem: { userWord: string, aiWord: string } = db.resources[0];
    return { userWord: dbitem.userWord, aiWord: dbitem.aiWord };
}

export async function getCategory(userId: string): Promise<CategoryRef> {
    const categoryQuery = `SELECT c.category FROM c WHERE c.id = @userId`;
    const db = await retryOperation(() => container.items.query({
        query: categoryQuery,
        parameters: [{ name: "@userId", value: userId }]
    }).fetchNext());
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

export async function finishGame(userId: string, winner: WinnerState, summary: Message, learnFact?: string): Promise<{ aiWord: string, counter: Counter, summary: Message, learnFact?: string }> {
    const gameStatus = await getGameStatus(userId);

    gameStatus.winner = winner;
    gameStatus.summary = summary;
    gameStatus.finishedAt = new Date().toISOString();
    if (learnFact) {
        gameStatus.learnFact = learnFact;
    }
    await updateGame(gameStatus);

    return { aiWord: gameStatus.aiWord, counter: gameStatus.counter, summary: summary, learnFact: learnFact };
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

type StatsRow = { winner?: string, counter?: Counter, categoryName?: string };

function questionStats(games: StatsRow[], side: "ai" | "human"): { min: number, max: number, med: number, avg: number } {
    const counts = games
        .map((game) => game.counter?.[side])
        .filter((count): count is number => typeof count === "number");
    if (counts.length === 0) {
        return { min: 0, max: 0, med: 0, avg: 0 };
    }
    return {
        min: Math.min(...counts),
        max: Math.max(...counts),
        med: getMedian(counts),
        avg: counts.reduce((sum, count) => sum + count, 0) / counts.length,
    };
}

export async function getStatistics(): Promise<Statistics> {
    try {
        // One projected scan replaces the previous 3 + 2-per-category queries,
        // and never pulls transcripts into memory.
        const query = `SELECT c.winner, c.counter, c.category.name AS categoryName FROM c`;
        const db = await container.items.query({ query: query }).fetchAll();
        const rows = db.resources as StatsRow[];

        // Older documents may reference subcategories as their own category —
        // resolve every leaf name to its top-level category and section.
        const hierarchy = new Map<string, { topLevelName: string, sectionName: string } | null>();
        const resolve = (leafName?: string) => {
            if (!leafName) return null;
            if (!hierarchy.has(leafName)) {
                const found = findCategory(leafName);
                hierarchy.set(leafName, found
                    ? { topLevelName: found.parentName ?? found.category.name, sectionName: found.sectionName }
                    : null);
            }
            return hierarchy.get(leafName) ?? null;
        };

        const aiWins = rows.filter((row) => row.winner === WinnerState.AI);
        const humanWins = rows.filter((row) => row.winner === WinnerState.HUMAN);
        const givenUp = rows.filter((row) => row.winner === WinnerState.GIVENUP);
        const aiQuestions = questionStats(aiWins, "ai");
        const humanQuestions = questionStats(humanWins, "human");

        const winsByCategory: CategoryWins[] = [];
        const winsBySection: SectionWins[] = [];
        for (const section of Sections) {
            const inSection = rows.filter((row) => resolve(row.categoryName)?.sectionName === section.name);
            winsBySection.push({
                sectionName: section.name,
                aiWins: inSection.filter((row) => row.winner === WinnerState.AI).length,
                humanWins: inSection.filter((row) => row.winner === WinnerState.HUMAN).length,
                givenUp: inSection.filter((row) => row.winner === WinnerState.GIVENUP).length,
                started: inSection.length,
            });

            for (const category of section.categories) {
                const inCategory = rows.filter((row) => resolve(row.categoryName)?.topLevelName === category.name);
                const categoryAiWins = inCategory.filter((row) => row.winner === WinnerState.AI);
                const categoryHumanWins = inCategory.filter((row) => row.winner === WinnerState.HUMAN);
                const categoryAiQuestions = questionStats(categoryAiWins, "ai");
                const categoryHumanQuestions = questionStats(categoryHumanWins, "human");
                winsByCategory.push({
                    category: category,
                    aiWins: categoryAiWins.length,
                    humanWins: categoryHumanWins.length,
                    givenUp: inCategory.filter((row) => row.winner === WinnerState.GIVENUP).length,
                    started: inCategory.length,
                    minQuestionCountAI: categoryAiQuestions.min,
                    maxQuestionCountAI: categoryAiQuestions.max,
                    medQuestionCountAI: categoryAiQuestions.med,
                    avgQuestionCountAI: categoryAiQuestions.avg,
                    minQuestionCountHuman: categoryHumanQuestions.min,
                    maxQuestionCountHuman: categoryHumanQuestions.max,
                    medQuestionCountHuman: categoryHumanQuestions.med,
                    avgQuestionCountHuman: categoryHumanQuestions.avg,
                });
            }
        }

        return {
            totalGames: aiWins.length + humanWins.length,
            totalAIWins: aiWins.length,
            totalHumanWins: humanWins.length,
            totalGivenUp: givenUp.length,
            totalStarted: rows.length,
            minQuestionCountHuman: humanQuestions.min,
            maxQuestionCountHuman: humanQuestions.max,
            medQuestionCountHuman: humanQuestions.med,
            avgQuestionCountHuman: humanQuestions.avg,
            minQuestionCountAI: aiQuestions.min,
            maxQuestionCountAI: aiQuestions.max,
            medQuestionCountAI: aiQuestions.med,
            avgQuestionCountAI: aiQuestions.avg,
            winsByCategory: winsByCategory,
            winsBySection: winsBySection,
        };
    } catch (error: unknown) {
        console.error("Error computing statistics:", error);
        throw error instanceof Error ? error : new Error("Failed to compute statistics");
    }
}
