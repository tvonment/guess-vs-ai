import { Answer } from "@/model/Answer";
import { Message } from "@/model/Message";
import { chatCompletion, jsonSchemaFormat } from "./llmService";

// All calls in this file run on the cheap/fast validation model with reasoning
// disabled and strict structured outputs, so every check costs ~1 output token
// of real content.

const BOOLEAN_SCHEMA = (name: string) => jsonSchemaFormat(name, {
    type: "object",
    properties: { result: { type: "boolean" } },
    required: ["result"],
    additionalProperties: false,
});

const ANSWER_SCHEMA = jsonSchemaFormat("question_answer", {
    type: "object",
    properties: { answer: { type: "string", enum: ["yes", "no", "i_dont_know"] } },
    required: ["answer"],
    additionalProperties: false,
});

function parseBooleanResult(content: string): boolean {
    try {
        const parsed = JSON.parse(content);
        if (typeof parsed.result === "boolean") {
            return parsed.result;
        }
    } catch {
        // fall through to the plain-text fallback
    }
    return content.trim().toLowerCase().startsWith("true");
}

// Did this message name the secret word? Fuzzy on spelling, strict on identity.
export async function checkWin(guess: string, word: string): Promise<boolean> {
    const system = new Message("system",
        `You are the referee of a word-guessing game. The secret word is "${word}".
Decide whether the player's message clearly names the secret word.
- result = true if the message names the secret word (or a well-known alias for it), even with minor spelling mistakes.
- result = false if the message only describes attributes, mentions only the franchise or context, names something else, or is a question that does not name the word itself.
Being close is not enough: the exact entity must be named.`);
    const user = new Message("user", guess);

    const result = await chatCompletion("validation", [system, user], {
        maxTokens: 100,
        reasoningEffort: "none",
        responseFormat: BOOLEAN_SCHEMA("win_check"),
    });
    return parseBooleanResult(result.message.content);
}

// Is the player's chosen word a real, fitting member of the category?
export async function checkWordInCategory(word: string, category: { name: string; description: string }): Promise<boolean> {
    const system = new Message("system",
        `You validate secret words for a guessing game. The category is "${category.name}": ${category.description}
- result = true only if the given word is a real, fitting member of this category.
- result = false for anything outside the category, misspelled beyond recognition, or nonsense.`);
    const user = new Message("user", word);

    const result = await chatCompletion("validation", [system, user], {
        maxTokens: 100,
        reasoningEffort: "none",
        responseFormat: BOOLEAN_SCHEMA("category_check"),
    });
    return parseBooleanResult(result.message.content);
}

// Answer the human's yes/no question about the AI's secret word.
// Returns the Answer enum so turn logic can branch on it exactly; the enum
// value doubles as the player-visible text.
export async function answerQuestion(question: string, aiWord: string): Promise<Answer> {
    const system = new Message("system",
        `You are playing a word-guessing game. Your secret word is "${aiWord}".
The human asks yes/no questions to figure it out. Answer truthfully about your secret word:
- "yes" if the question is true of the secret word
- "no" if it is false
- "i_dont_know" only if it genuinely cannot be answered with yes or no (ambiguous, subjective, or not a yes/no question)`);
    const user = new Message("user", question);

    const result = await chatCompletion("validation", [system, user], {
        maxTokens: 100,
        reasoningEffort: "none",
        responseFormat: ANSWER_SCHEMA,
    });

    try {
        const parsed = JSON.parse(result.message.content);
        switch (parsed.answer) {
            case "yes": return Answer.YES;
            case "no": return Answer.NO;
            case "i_dont_know": return Answer.I_DONT_KNOW;
        }
    } catch {
        // fall through to the safe default
    }
    console.warn("answerQuestion: unexpected model output, defaulting to I Don't Know");
    return Answer.I_DONT_KNOW;
}
