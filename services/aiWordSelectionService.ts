import { Category } from "@/model/Categories";
import { getUsedCharacters } from "./cosmosService";
import { gptCall } from "./oaiService";
import { Message } from "@/model/Message";

export async function selectWord(category: Category) {
    const usedCharacters: string[] = await getUsedCharacters(category);
    console.log("Used Characters:", usedCharacters);

    const systemMessageText = { role: "system", content: `We are going to play a game of word selection. You will play against a human. The human already chose a word from the category '${category.name}' - ${category.description}. You have to choose a word of your own. Try your best to get a word that is difficult to guess. These are the words that have already been used: ${usedCharacters.join(", ")}. Good luck!` } as Message;
    const fewShotMessages: Message[] = [
        {
            role: "user",
            content: "Choose a word from the category 'Any Animal'."
        },
        {
            role: "assistant",
            content: "elephant"
        },
        {
            role: "user",
            content: "Choose a word from the category 'University Object'."
        },
        {
            role: "assistant",
            content: "chair"
        },
        {
            role: "user",
            content: "Choose a word from the category 'Food'."
        },
        {
            role: "assistant",
            content: "apple"
        },
        {
            role: "user",
            content: "Choose a word from the category 'Harry Potter'."
        },
        {
            role: "assistant",
            content: "harry potter"
        },
        {
            role: "user",
            content: "Choose a word from the category 'University Object'."
        },
        {
            role: "assistant",
            content: "pen"
        }
    ]
    const userMessage =
        {
            role: "user",
            content: `Choose a word from the category '${category.name}'.`
        } as Message;
    try {
        const gptResponse = await gptCall([systemMessageText, ...fewShotMessages, userMessage], 0.7);
        const word = gptResponse.content;
        return word;
    } catch (error) {
        console.error("Error selecting word:", error);
        throw error;
    }
}