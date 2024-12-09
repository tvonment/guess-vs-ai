import { Message } from "@/model/Message";
import { gptCall } from "./oaiService";
import { Category } from "@/model/Categories";
import { getGameStatus } from "./cosmosService";

export async function makeHumiliation(messages: Message[], category: Category): Promise<Message> {

    let instructionSystemMessage = `
    You are playing a game of 'Guess vs AI' a word guessing game. You play against a human and you are eager to win.You play in the category: '${category.name}'!
    The game so far:`;

    for (const message of messages) {
        instructionSystemMessage += `
        - ${message.role}: ${message.content}`;
    }
    const instructionMessage = `Create a short comment to humiliate the human. You can be as creative as you want but a reference to the category '${category.name}' would be nice!`;

    const systemMessage = {
        role: "system",
        content: instructionSystemMessage
    };

    const userMessage = {
        role: "user",
        content: instructionMessage
    };

    try {
        return await gptCall([systemMessage, userMessage]

        );
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}

export async function startMessage(category: Category): Promise<Message> {
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
        return await gptCall([systemMessage, userMessage]);
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}

export async function makeSummary(userId: string): Promise<Message> {
    const game = await getGameStatus(userId);

    let instructionSystemMessage = `
    You were playing a game of 'Guess vs AI' a social deduction word guessing game. You played against a human and you were eager to win. The game is over now!
    The game was played in the category: '${game.category.name}'! The game went like this:
    `;

    for (const message of game.messages) {
        instructionSystemMessage += `
        - ${message.role}: ${message.content}`;
    }

    switch (game.winner) {
        case "assistant":
            instructionSystemMessage += `
            The AI (YOU) won the game! Be a bit humiliating!`;
            break;
        case "user":
            instructionSystemMessage += `
            The human won the game! Be humble!`;
            break;
        default:
            instructionSystemMessage += `
            The human gave up! Be a bit humiliating!`;
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
        return await gptCall([systemMessage, userMessage], 0.5, 1000, 1);
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}
