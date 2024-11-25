import { Category } from "@/model/Categories"
import { Message } from "./Message"

export class Game {
    id: string;
    messages: Message[];
    userWord: string;
    aiWord: string;
    category: Category;
    winner?: string;
    issues?: ReportedIssue[];

    constructor(id: string, messages: Message[], userWord: string, aiWord: string, category: Category, winner?: string, issues?: ReportedIssue[]) {
        this.id = id;
        this.messages = messages;
        this.userWord = userWord;
        this.aiWord = aiWord;
        this.category = category;
        this.winner = winner;
        this.issues = issues;
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