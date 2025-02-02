import { Category } from "@/model/Categories"
import { Message } from "./Message"
import { Counter } from "./Counter";
import { Opponent } from "./Opponent";

export class Game {
    id: string;
    messages: Message[];
    userWord: string;
    aiWord: string;
    opponent: Opponent;
    category: Category;
    counter: Counter;
    summary?: Message;
    winner?: string;
    issues?: ReportedIssue[];

    constructor(id: string, messages: Message[], userWord: string, aiWord: string, opponent: Opponent, category: Category, counter: Counter, winner?: string, issues?: ReportedIssue[]) {
        this.id = id;
        this.messages = messages;
        this.userWord = userWord;
        this.aiWord = aiWord;
        this.opponent = opponent;
        this.category = category;
        this.counter = counter;
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