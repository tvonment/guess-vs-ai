import { Message } from "@/model/Message";
import { getFilteredAiChatHistory, getCategory } from "./cosmosService";
import { Category } from "@/model/Categories";
import { gptCall } from "./oaiService";

export async function makeGuess(userId: string): Promise<Message> {
    const category = await getCategory(userId) as Category;

    const instructionSystemMessage = `You are playing a game of guess what. You play against a human and you are eager to win. Ask a question to narrow down the searched word from the category '${category.name}' or make a good guess!`;
    const guessSystemMessage = `Create a good question to get to your word from the category '${category.name} - ${category.description}' or make a guess.`

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
        return await gptCall([startSystemMessage, ...filteredChatHistory, endSystemMessage]);
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}