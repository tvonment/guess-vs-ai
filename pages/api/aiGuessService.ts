import { Message } from "./Message";
import { getFilteredAiChatHistory, getCategory } from "./cosmosService";

const temperature = 0.5;
const max_tokens = 100;
const top_p = 1;

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_GPT4O_API_URL;

export async function makeGuess(userId: string): Promise<Message> {
    console.log("Make Guess Request received");

    const category = await getCategory(userId);

    const instructionSystemMessage = `You are playing a game of guess what. You play against a human and you are eager to win. Ask a question to narrow down the searched word from the category ${category} or make a good guess!`;
    const guessSystemMessage = `Create a good question to get to your word from the category '${category}' or make a guess.`

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

        const response = await fetch(`${OPENAI_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${API_KEY}`,
            },
            body: JSON.stringify({
                messages: [startSystemMessage, ...filteredChatHistory, endSystemMessage],
                temperature: temperature,
                max_tokens: max_tokens,
                top_p: top_p
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiGuess = data.choices[0].message;
        return aiGuess
    } catch (error: unknown) {
        console.error("Error:", error);
        throw new Error("An error occurred");
    }
}