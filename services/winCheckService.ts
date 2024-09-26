const temperature = 0;
const max_tokens = 20;
const top_p = 1;

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_GPT4OMINI_API_URL;

const winCheckSystemMessage = "You are to verify if the guess is a winning guess. Only answer with 'win' or 'no'. A correct question is not yet a win. The user has to guess the word correctly to win the game. Spelling issues are ok!";


export async function winCheck(guess: string, word: string): Promise<boolean> {
    console.log("Win Check Request received", "Guess:", guess, "Word:", word);
    try {
        const response = await fetch(`${OPENAI_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: winCheckSystemMessage,
                    },
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
                        content: guess + " Correct Word" + word
                    }
                ],
                temperature: temperature,
                max_tokens: max_tokens,
                top_p: top_p
            }),
        });
        if (!response.ok) {
            console.log("WIN CHECK RESPONSE: ", response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("WIN CHECK: ", guess, word, data.choices[0].message.content);
        if (data.choices[0].message.content === "win") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error selecting word:", error);
        throw error;
    }
}