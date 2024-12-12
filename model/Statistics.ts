import { Category } from "./Categories";

export class Statistics {
    totalGames: number;
    totalAIWins: number;
    totalHumanWins: number;
    totalGivenUp: number;
    minQuestionCountHuman: number;
    maxQuestionCountHuman: number;
    medQuestionCountHuman: number;
    avgQuestionCountHuman: number;
    minQuestionCountAI: number;
    maxQuestionCountAI: number;
    medQuestionCountAI: number;
    avgQuestionCountAI: number;
    winsByCategory: CategoryWins[];
    constructor(totalGames: number, totalAIWins: number, totalHumanWins: number, totalGivenUp: number, avgQuestionCountHuman: number, avgQuestionCountAI: number, winsByCategory: CategoryWins[], minQuestionCountHuman: number, maxQuestionCountHuman: number, medQuestionCountHuman: number, minQuestionCountAI: number, maxQuestionCountAI: number, medQuestionCountAI: number) {
        this.totalGames = totalGames;
        this.totalAIWins = totalAIWins;
        this.totalHumanWins = totalHumanWins;
        this.totalGivenUp = totalGivenUp;
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
    minQuestionCountHuman: number;
    maxQuestionCountHuman: number;
    medQuestionCountHuman: number;
    avgQuestionCountHuman: number;
    minQuestionCountAI: number;
    maxQuestionCountAI: number;
    medQuestionCountAI: number;
    avgQuestionCountAI: number;
    constructor(category: Category, humanWins: number, aiWins: number, avgQuestionCountHuman: number, avgQuestionCountAI: number, minQuestionCountHuman: number, maxQuestionCountHuman: number, medQuestionCountHuman: number, minQuestionCountAI: number, maxQuestionCountAI: number, medQuestionCountAI: number) {
        this.category = category;
        this.humanWins = humanWins;
        this.aiWins = aiWins;
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