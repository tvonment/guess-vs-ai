import { Message } from "@/model/Message";
import { addToHistory, finishGame, getWinningWords, increaseCounter } from "./cosmosService";
import { winCheck } from "./winCheckService";
import { verifyHumanQuestion } from "./humanQuestionVerificationService";
import { TurnState } from "@/model/TurnState";
import { makeGuess, makeHumiliation } from "./aiMessagesServcie";
import { TurnResponse } from "@/model/TurnResponse";
import { WinnerState } from "@/model/WinnerState";

export async function humanGuessTurn(userId: string, text: string): Promise<TurnResponse> {
    const winningWords = await getWinningWords(userId);
    const userwin = await winCheck(text, winningWords.aiWord);
    const counter = await increaseCounter(userId, "human");

    if (userwin) {
        const aiAnswer = new Message("assistant", "Congrats, you won!");
        const finished = await finishGame(userId, WinnerState.HUMAN);
        return new TurnResponse([aiAnswer], TurnState.FINISHED, WinnerState.HUMAN, counter, finished.summary, finished.aiWord);
    }

    const aiAnswer = await verifyHumanQuestion(userId, text);
    const aiAnswerResponse = await addToHistory(userId, aiAnswer);

    if (aiAnswer.content.toLowerCase().includes("yes")) {
        return new TurnResponse([aiAnswerResponse], TurnState.HUMAN, WinnerState.PLAYING, counter);
    }

    return new TurnResponse([aiAnswerResponse], TurnState.AI, WinnerState.PLAYING, counter);
}


export async function aiGuessTurn(userId: string): Promise<TurnResponse> {
    const winningWords = await getWinningWords(userId);

    const guess = await makeGuess(userId);
    const counter = await increaseCounter(userId, "ai");
    const guessResponse = await addToHistory(userId, guess);
    const aiwin = await winCheck(guess.content, winningWords.userWord);

    if (aiwin) {
        const finished = await finishGame(userId, WinnerState.AI);
        return new TurnResponse([guessResponse], TurnState.FINISHED, WinnerState.AI, finished.counter, finished.summary, finished.aiWord);
    } else {
        if (counter.ai % 5 === 0) {
            const humiliation = await makeHumiliation(userId);
            return new TurnResponse([humiliation, guessResponse], TurnState.AI, WinnerState.PLAYING, counter);
        }
        return new TurnResponse([guessResponse], TurnState.AI, WinnerState.PLAYING, counter);
    }
}