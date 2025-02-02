import { Message } from "@/model/Message";
import { gptCall } from "./oaiService";
import { Category } from "@/model/Categories";
import { getCategory, getFilteredAiChatHistory, getGameStatus, getOpponent } from "./cosmosService";
import { Answer } from "@/model/Answer";
import { WinnerState } from "@/model/WinnerState";
import { Opponent } from "@/model/Opponent";

export async function makeGuess(userId: string): Promise<Message> {
    const category = await getCategory(userId) as Category;
    const opponent = await getOpponent(userId) as Opponent;
    const possibleAnswers = Object.values(Answer).join(", ");

    const instructionSystemMessage = `
    You are playing a game social deduction game in the category '${category.name}' where you need to narrow down the others character. 
    You play against a human and you are eager to win. Ask a question to narrow down the searched word from the category '${category.name}' or make a good guess!
    The Answers you get are either '${possibleAnswers}'. If you get a '${Answer.YES}' or '${Answer.PROBABLY_YES}' you can continue asking questions or make a guess. If you get a 'no' the human will get the turn, so be careful and try to get answers where you most likely get a '${Answer.YES}.'!`;
    const guessSystemMessage = `
    Create a good question to get to your word from the category '${category.name} - ${category.description}' or make a guess.`

    const startSystemMessage = {
        role: "system",
        content: instructionSystemMessage
    };

    const endSystemMessage = {
        role: "system",
        content: guessSystemMessage
    };

    try {
        const filteredChatHistory = await getFilteredAiChatHistory(userId);
        return await gptCall([startSystemMessage, ...filteredChatHistory, endSystemMessage], opponent);
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}

export async function makeHumiliation(userId: string): Promise<Message> {
    const game = await getGameStatus(userId);

    let instructionSystemMessage = `
    You are playing a game of 'Guess vs AI' a word guessing game. You play against a human and you are eager to win. You play in the category: '${game.category.name}'!
    The game so far:`;

    for (const message of game.messages) {
        instructionSystemMessage += `
        - ${message.role}: ${message.content}`;
    }
    const instructionMessage = `Create a short comment to humiliate the human. You can be as creative as you want but a reference to the category '${game.category.name}' would be nice!`;

    const systemMessage = {
        role: "system",
        content: instructionSystemMessage
    };

    const userMessage = {
        role: "user",
        content: instructionMessage
    };

    try {
        return await gptCall([systemMessage, userMessage], game.opponent);
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}

export async function startMessage(category: Category, opponent: Opponent): Promise<Message> {
    const instructionSystemMessage = `You are playing a game of guess what. You play against a human and you are eager to win You play in the category: '${category.name}'!`;

    const instructionMessage = `Create an opening line that statet, that you are ready to start the game. You can be as creative as you want but a reference to the category '${category.name}' would be nice! Do NOT ask a question! Give the turn to the human!`;

    const systemMessage = {
        role: "system",
        content: instructionSystemMessage
    };

    const userMessage = {
        role: "user",
        content: instructionMessage
    };

    try {
        return await gptCall([systemMessage, userMessage], opponent);
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}

export async function makeSummary(userId: string, winner: WinnerState): Promise<Message> {
    const game = await getGameStatus(userId);

    let instructionSystemMessage = `
    You were playing a game of 'Guess vs AI' a social deduction word guessing game. You played against a human and you were eager to win. The game is over now!
    The game was played in the category: '${game.category.name}'! 
    
    The human aked ${game.counter.human} questions and the AI asked ${game.counter.ai} questions.
    
    The game went like this:
    `;

    for (const message of game.messages) {
        instructionSystemMessage += `
        - ${message.role}: ${message.content}`;
    }

    switch (winner) {
        case WinnerState.AI:
            instructionSystemMessage += `
            The AI (YOU) won the game! Be a bit humiliating!`;
            break;
        case WinnerState.HUMAN:
            instructionSystemMessage += `
            The human won the game! Be humble!`;
            break;
        case WinnerState.GIVENUP:
            instructionSystemMessage += `
            It was probably a hard game for both of you. No one won!`;
            break;
        default:
            instructionSystemMessage += `
            The winner is uncertain...`;
            break;
    }

    const instructionMessage = `Create a short summary of the game. You can be as creative as you want but a reference to the category '${game.category.name}' - '${game.category.description}' would be nice!`;

    const systemMessage = {
        role: "system",
        content: instructionSystemMessage
    };

    const userMessage = {
        role: "user",
        content: instructionMessage
    };

    try {
        const response = await gptCall([systemMessage, userMessage], game.opponent, 0.5, 1000, 1);
        response.role = "system";
        return response;
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}
