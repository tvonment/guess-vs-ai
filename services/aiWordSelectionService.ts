import { getUsedCharacters } from "./cosmosService";
import { chatCompletion } from "./llmService";
import { Message } from "@/model/Message";

export async function selectWord(category: { name: string; description: string }): Promise<string> {
    const usedWords = await getUsedCharacters(category.name);

    const systemMessage = new Message("system",
        `We are playing 'Guess vs AI', a word-guessing game. Pick the secret word you will defend, from the category '${category.name}' — ${category.description}
Choose something recognizable that clearly fits the category, but not the most obvious pick, so it is challenging to guess.${usedWords.length > 0 ? `
Do not pick any of these already-used words: ${usedWords.join(", ")}.` : ""}
Respond with only the chosen word — no quotes, no punctuation, no explanation.`);
    const userMessage = new Message("user", `Choose your secret word from the category '${category.name}'.`);

    const result = await chatCompletion("game", [systemMessage, userMessage], { maxTokens: 200, reasoningEffort: "low" });
    const word = result.message.content.trim().replace(/^["']+|["'.]+$/g, "").trim();
    if (!word) {
        throw new Error("AI word selection returned an empty word");
    }
    return word;
}
