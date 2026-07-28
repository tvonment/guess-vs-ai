import { Category } from "./Categories";

export type Statistics = {
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
    winsBySection: SectionWins[];
};

// Aggregated per top-level category; games played on a subcategory roll up
// into their parent.
export type CategoryWins = {
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
};

export type SectionWins = {
    sectionName: string;
    humanWins: number;
    aiWins: number;
    givenUp: number;
    started: number;
};
