import { Category } from "./Categories";

export class Statistics {
    totalGames: number;
    totalAIWins: number;
    totalHumanWins: number;
    totalGivenUp: number;
    avgQuestionCountHuman: number;
    avgQuestionCountAI: number;
    winsByCategory: CategoryWins[];
    constructor(totalGames: number, totalAIWins: number, totalHumanWins: number, totalGivenUp: number, avgQuestionCountHuman: number, avgQuestionCountAI: number, winsByCategory: CategoryWins[]) {
        this.totalGames = totalGames;
        this.totalAIWins = totalAIWins;
        this.totalHumanWins = totalHumanWins;
        this.totalGivenUp = totalGivenUp;
        this.avgQuestionCountHuman = avgQuestionCountHuman;
        this.avgQuestionCountAI = avgQuestionCountAI;
        this.winsByCategory = winsByCategory;
    }
}

export class CategoryWins {
    category: Category;
    humanWins: number;
    aiWins: number;
    avgQuestionCountHuman: number;
    avgQuestionCountAI: number;
    constructor(category: Category, humanWins: number, aiWins: number, avgQuestionCountHuman: number, avgQuestionCountAI: number) {
        this.category = category;
        this.humanWins = humanWins;
        this.aiWins = aiWins;
        this.avgQuestionCountHuman = avgQuestionCountHuman;
        this.avgQuestionCountAI = avgQuestionCountAI;
    }
}