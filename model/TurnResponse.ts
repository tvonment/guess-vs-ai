import { Counter } from "./Counter";
import { Message } from "./Message";
import { TurnState } from "./TurnState";
import { WinnerState } from "./WinnerState";

export class TurnResponse {
    messages: Message[];
    turn: TurnState;
    winnerState: WinnerState;
    counter?: Counter;
    summary?: Message;
    aiWord?: string;
    learnFact?: string;

    constructor(messages: Message[], turn: TurnState, winnerState: WinnerState, counter?: Counter, summary?: Message, aiWord?: string, learnFact?: string) {
        this.messages = messages;
        this.turn = turn;
        this.winnerState = winnerState;
        this.counter = counter;
        this.summary = summary;
        this.aiWord = aiWord;
        this.learnFact = learnFact;
    }
}