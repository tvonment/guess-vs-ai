import { Message } from "@/model/Message";
import { gptMiniCall } from "./oaiService";

const winCheckSystemMessage = "You are to verify if the guess is a complete winning guess. Only answer with 'win' or 'no'. A correct question is not yet a win, even if it is close! The user has to guess the word correctly to win the game. Spelling issues are ok!";

export async function winCheck(guess: string, word: string): Promise<boolean> {
    console.log("Win Check Request received", "Guess:", guess, "Word:", word);
    const systemMessage: Message = {
        role: "system",
        content: winCheckSystemMessage,
    };
    const fewShotMessages: Message[] = [
        {
            role: "user",
            content: "Is my character Sherlock Holmes? Correct Answer: Sherlock Holmes",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Is your animal an elefant. Correct Answer: golden retriever",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your object a chair. Correct Answer: pen",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your character male? Correct Word: Harry Potter",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your food an apple. Correct Word: pizza",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your food an hary potter. Correct Word: Harry Potter",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Is your food an scherlok holms. Correct Word: Sherlock Holmes",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Is your food an foxx. Correct Word: fox",
        },
        {
            role: "assistant",
            content: "win"
        }, {
            role: "user",
            content: "Is your character Tony Stark, also known as Iron Man? Correct Word: iron man",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Is your animal an elefant? Correct Word: elephant",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Does the character wear a suit of armor? Correct Word: Iron Man"
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is the character you're thinking of a hero or ally who has appeared in a Guardians of the Galaxy film? Correct Word: Manits"
        },
        {
            role: "assistant",
            content: "no"
        },

    ]

    const userMessage: Message = {
        role: "user",
        content: guess + " Correct Word" + word
    }

    try {
        const gptResponse = await gptMiniCall([systemMessage, ...fewShotMessages, userMessage]);
        if (gptResponse.content === "win") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error selecting word:", error);
        throw error;
    }
}