import { Message } from "@/model/Message";
import { addToHistory, finishGame, getCategory, getWinningWords, increaseCounter } from "./cosmosService";
import { answerQuestion, checkWin } from "./validationService";
import { TurnState } from "@/model/TurnState";
import { makeGuess, makeLearnFact, makePlayfulComment, makeSummary } from "./aiMessagesService";
import { TurnResponse } from "@/model/TurnResponse";
import { WinnerState } from "@/model/WinnerState";
import { Answer } from "@/model/Answer";
import { Counter } from "@/model/Counter";

const CLASSROOM_SECTION = "Classroom";

export async function humanGuessTurn(userId: string, text: string): Promise<TurnResponse> {
    await addToHistory(userId, new Message("user", text));
    const winningWords = await getWinningWords(userId);
    const userWin = await checkWin(text, winningWords.aiWord);
    const counter = await increaseCounter(userId, "human");

    if (userWin) {
        const winMessage = await addToHistory(userId, new Message("assistant", "Congrats, you won!"));
        const finished = await finishTurn(userId, WinnerState.HUMAN);
        return new TurnResponse([winMessage], TurnState.FINISHED, WinnerState.HUMAN, counter, finished.summary, finished.aiWord, finished.learnFact);
    }

    const answer = await answerQuestion(text, winningWords.aiWord);
    const answerMessage = await addToHistory(userId, new Message("assistant", answer));

    const nextTurn = answer === Answer.YES ? TurnState.HUMAN : TurnState.AI;
    return new TurnResponse([answerMessage], nextTurn, WinnerState.PLAYING, counter);
}

export async function aiGuessTurn(userId: string): Promise<TurnResponse> {
    const winningWords = await getWinningWords(userId);

    const guess = await makeGuess(userId);
    const counter = await increaseCounter(userId, "ai");
    const guessResponse = await addToHistory(userId, guess);
    const aiWin = await checkWin(guess.content, winningWords.userWord);

    if (aiWin) {
        const finished = await finishTurn(userId, WinnerState.AI);
        return new TurnResponse([guessResponse], TurnState.FINISHED, WinnerState.AI, finished.counter, finished.summary, finished.aiWord, finished.learnFact);
    }

    if (counter.ai % 5 === 0) {
        const playfulComment = await makePlayfulComment(userId);
        await addToHistory(userId, playfulComment);
        return new TurnResponse([guessResponse, playfulComment], TurnState.AI, WinnerState.PLAYING, counter);
    }
    return new TurnResponse([guessResponse], TurnState.AI, WinnerState.PLAYING, counter);
}

// Generates the summary (and, for Classroom games, the educational fact card)
// and persists the finished game. Lives here (not in cosmosService) so the
// persistence layer stays free of LLM calls.
export async function finishTurn(userId: string, winner: WinnerState): Promise<{ aiWord: string, counter: Counter, summary: Message, learnFact?: string }> {
    const summary = await makeSummary(userId, winner);

    let learnFact: string | undefined;
    const category = await getCategory(userId);
    if (category.sectionName === CLASSROOM_SECTION) {
        try {
            const winningWords = await getWinningWords(userId);
            learnFact = await makeLearnFact(winningWords.aiWord, winningWords.userWord, category);
        } catch (error: unknown) {
            // The fact card is a bonus — never let it break finishing the game.
            console.error("Error generating learn fact:", error);
        }
    }

    return finishGame(userId, winner, summary, learnFact);
}
