import { Category } from "@/model/Categories";
import { getUsedCharacters } from "./cosmosService";

const temperature = 0.7;
const max_tokens = 100;
const top_p = 1;

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_GPT4O_API_URL;

export async function selectWord(category: Category) {
    console.log("Select Word Request received");

    const usedCharacters: string[] = await getUsedCharacters(category);

    const systemMessageText = `We are going to play a game of word selection. You will play against a human. The human already chose a word from the category '${category.name}' - ${category.description}. You have to choose a word of your own. Try your best to get a word that is difficult to guess. These are the words that have already been used: ${usedCharacters.join(", ")}. Good luck!`;

    try {
        const response = await fetch(`${OPENAI_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${API_KEY} `,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: systemMessageText,
                    },
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
                    },
                    {
                        role: "user",
                        content: "Choose a word from the category '" + category.name + "'."
                    }
                ],
                temperature: temperature,
                max_tokens: max_tokens,
                top_p: top_p
            }),
        });

        const data = await response.json();
        const word = data.choices[0].message.content;
        console.log("AI chose the word: " + word)
        return word;
    } catch (error) {
        console.error("Error selecting word:", error);
        throw error;
    }
}