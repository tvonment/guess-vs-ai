import { Message } from "./Message"
import { Counter } from "./Counter";

// Lean category reference stored on game documents. Documents written before
// promptVersion 3 stored the full Category object (icon, image, subcategories);
// its name/description fields keep those documents readable through this type.
export type CategoryRef = {
    name: string;
    description: string;
    parentName: string | null;
    sectionName?: string;
};

export class Game {
    id: string;
    messages: Message[];
    userWord: string;
    aiWord: string;
    category: CategoryRef;
    counter: Counter;
    modelId: string;
    validationModelId: string;
    promptVersion: number;
    createdAt: string;
    finishedAt?: string;
    summary?: Message;
    winner?: string;
    issues?: ReportedIssue[];
    learnFact?: string;

    constructor(id: string, messages: Message[], userWord: string, aiWord: string, category: CategoryRef, counter: Counter, modelId: string, validationModelId: string) {
        this.id = id;
        this.messages = messages;
        this.userWord = userWord;
        this.aiWord = aiWord;
        this.category = category;
        this.counter = counter;
        this.modelId = modelId;
        this.validationModelId = validationModelId;
        this.promptVersion = 3;
        this.createdAt = new Date().toISOString();
    }
}

export class ReportedIssue {
    gameStatus: string;
    message: string;
    constructor(gameStatus: string, message: string) {
        this.gameStatus = gameStatus;
        this.message = message;
    }
}
