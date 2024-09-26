import { Category } from "@/enum/Categories"
import { Message } from "./Message"

export class GameStatus {
    id: string;
    messages: Message[];
    userWord: string;
    aiWord: string;
    category: Category;
    winner?: string;
    constructor(id: string, messages: Message[], userWord: string, aiWord: string, category: Category, winner?: string) {
        this.id = id;
        this.messages = messages;
        this.userWord = userWord;
        this.aiWord = aiWord;
        this.category = category;
        this.winner = winner;
    }
}