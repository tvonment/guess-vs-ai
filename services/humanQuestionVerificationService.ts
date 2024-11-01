import { Answer } from "@/model/Answer";
import { getAiWord } from "./cosmosService";
import { gptCall } from "./oaiService";

const possibleAnswers = Object.entries(Answer).map(([, value]) => value);
const possibleAnswersString = possibleAnswers.join(", ");

export async function verifyHumanQuestion(userId: string, userQuestion: string) {
    const aiWord = await getAiWord(userId);
    const verifySystemMessage = `Verify if the question is correct. The Word in question is ${aiWord}. Only answer with ${possibleAnswersString}.`

    console.log(possibleAnswersString);

    const systemMessage = {
        role: "system",
        content: verifySystemMessage
    };

    const userMessage = {
        role: "user",
        content: userQuestion
    };

    try {
        return gptCall([systemMessage, userMessage]);
    }
    catch (error: unknown) {
        console.error("Error:", error);
        return "An error occurred";
    }
}
