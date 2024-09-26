import { Answer } from "@/enum/Answer";
import { getAiWord } from "./cosmosService";

const temperature = 0.5;
const max_tokens = 100;
const top_p = 1;

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_GPT4O_API_URL;

const possibleAnswers = Object.entries(Answer).map(([, value]) => value);
const possibleAnswersString = possibleAnswers.join(", ");

export async function verifyHumanQuestion(userId: string, userQuestion: string) {
    const aiWord = await getAiWord(userId);
    const verifySystemMessage = `Verify if the question is correct. The Word in question is ${aiWord}. Only answer with ${possibleAnswersString}.`

    console.log(possibleAnswersString);

    const userMessage = {
        role: "user",
        content: userQuestion
    };

    const systemMessage = {
        role: "system",
        content: verifySystemMessage
    };

    try {
        const response = await fetch(`${OPENAI_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${API_KEY}`,
            },
            body: JSON.stringify({
                messages: [systemMessage, userMessage],
                temperature: temperature,
                max_tokens: max_tokens,
                top_p: top_p
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message;
        return aiMessage;
    }
    catch (error: unknown) {
        console.error("Error:", error);
        return "An error occurred";
    }
}
