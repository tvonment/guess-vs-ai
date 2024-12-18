import { Category } from "./Categories";
import { Counter } from "./Counter";
import { Message } from "./Message";

export class Statistics {
    totalGames: number;
    totalAIWins: number;
    totalHumanWins: number;
    totalGivenUp: number;
    totalStarted: number;
    minQuestionCountHuman: number;
    maxQuestionCountHuman: number;
    medQuestionCountHuman: number;
    avgQuestionCountHuman: number;
    minQuestionCountAI: number;
    maxQuestionCountAI: number;
    medQuestionCountAI: number;
    avgQuestionCountAI: number;
    winsByCategory: CategoryWins[];
    constructor(totalGames: number, totalAIWins: number, totalHumanWins: number, totalGivenUp: number, totalStarted: number, avgQuestionCountHuman: number, avgQuestionCountAI: number, winsByCategory: CategoryWins[], minQuestionCountHuman: number, maxQuestionCountHuman: number, medQuestionCountHuman: number, minQuestionCountAI: number, maxQuestionCountAI: number, medQuestionCountAI: number) {
        this.totalGames = totalGames;
        this.totalAIWins = totalAIWins;
        this.totalHumanWins = totalHumanWins;
        this.totalGivenUp = totalGivenUp;
        this.totalStarted = totalStarted;
        this.avgQuestionCountHuman = avgQuestionCountHuman;
        this.avgQuestionCountAI = avgQuestionCountAI;
        this.winsByCategory = winsByCategory;
        this.minQuestionCountHuman = minQuestionCountHuman;
        this.maxQuestionCountHuman = maxQuestionCountHuman;
        this.medQuestionCountHuman = medQuestionCountHuman;
        this.minQuestionCountAI = minQuestionCountAI;
        this.maxQuestionCountAI = maxQuestionCountAI;
        this.medQuestionCountAI = medQuestionCountAI;
    }
}

export class CategoryWins {
    category: Category;
    humanWins: number;
    aiWins: number;
    givenUp: number;
    started: number;
    minQuestionCountHuman: number;
    maxQuestionCountHuman: number;
    medQuestionCountHuman: number;
    avgQuestionCountHuman: number;
    minQuestionCountAI: number;
    maxQuestionCountAI: number;
    medQuestionCountAI: number;
    avgQuestionCountAI: number;
    constructor(category: Category, humanWins: number, aiWins: number, givenUp: number, started: number, avgQuestionCountHuman: number, avgQuestionCountAI: number, minQuestionCountHuman: number, maxQuestionCountHuman: number, medQuestionCountHuman: number, minQuestionCountAI: number, maxQuestionCountAI: number, medQuestionCountAI: number) {
        this.category = category;
        this.humanWins = humanWins;
        this.aiWins = aiWins;
        this.givenUp = givenUp;
        this.started = started;
        this.minQuestionCountAI = minQuestionCountAI;
        this.maxQuestionCountAI = maxQuestionCountAI;
        this.medQuestionCountAI = medQuestionCountAI;
        this.avgQuestionCountAI = avgQuestionCountAI;
        this.minQuestionCountHuman = minQuestionCountHuman;
        this.maxQuestionCountHuman = maxQuestionCountHuman;
        this.medQuestionCountHuman = medQuestionCountHuman;
        this.avgQuestionCountHuman = avgQuestionCountHuman;
    }
}

export class DetailedStatistics {
    basic: Statistics;
    games: GameStatistics[];
    constructor(basic: Statistics, games: GameStatistics[]) {
        this.basic = basic;
        this.games = games;
    }
}

export class GameStatistics {
    id: string;
    userWord: string;
    aiWord: string;
    categoryName: string;
    counter: Counter;
    winner: string;
    messages: Message[];
    constructor(id: string, userWord: string, aiWord: string, category: Category, counter: Counter, winner: string, messages: Message[]) {
        this.id = id;
        this.userWord = userWord;
        this.aiWord = aiWord;
        this.categoryName = category.name;
        this.counter = counter;
        this.winner = winner;
        this.messages = messages;
    }
}