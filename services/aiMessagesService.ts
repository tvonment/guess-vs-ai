import { Message } from "@/model/Message";
import { chatCompletion } from "./llmService";
import { getCategory, getFilteredAiChatHistory, getGameStatus } from "./cosmosService";
import { Answer } from "@/model/Answer";
import { WinnerState } from "@/model/WinnerState";

function flattenHistory(messages: Message[]): string {
    return messages.map((message) => `- ${message.role}: ${message.content}`).join("\n");
}

export async function makeGuess(userId: string): Promise<Message> {
    const category = await getCategory(userId);

    const instructions = new Message("system",
        `You are playing 'Guess vs AI', a word-guessing game in the category '${category.name}'. The human is thinking of a secret word from this category and you win by naming it.
Ask ONE short yes/no question to narrow the word down, or — once you are confident — guess it directly (e.g. "Is your word X?").
The human answers only with '${Answer.YES}', '${Answer.NO}' or '${Answer.I_DONT_KNOW}'. A '${Answer.YES}' lets you keep your turn; anything else passes the turn to the human, so favor questions likely to get a '${Answer.YES}'.`);
    const task = new Message("system",
        `Category: '${category.name} — ${category.description}'. Output only your next yes/no question or your guess, nothing else.`);

    const history = await getFilteredAiChatHistory(userId);
    // Generous combined budget: reasoning tokens draw from max_completion_tokens
    // before the short visible question.
    const result = await chatCompletion("game", [instructions, ...history, task], { maxTokens: 1200, reasoningEffort: "low" });
    return result.message;
}

export async function makePlayfulComment(userId: string): Promise<Message> {
    const game = await getGameStatus(userId);

    const systemMessage = new Message("system",
        `You are playing 'Guess vs AI', a word-guessing game, against a human in the category '${game.category.name}' — and you are eager to win.
The game so far:
${flattenHistory(game.messages)}`);
    const userMessage = new Message("user",
        `Create a short, playful and competitive comment to spur the human on. Keep it lighthearted and fun — a friendly joke or witty remark, ideally with a nod to the category '${game.category.name}'.`);

    const result = await chatCompletion("game", [systemMessage, userMessage], { maxTokens: 150, reasoningEffort: "none" });
    return result.message;
}

export async function startMessage(category: { name: string; description: string }): Promise<Message> {
    const systemMessage = new Message("system",
        `You are playing 'Guess vs AI', a word-guessing game, against a human in the category '${category.name}' — and you are eager to win.`);
    const userMessage = new Message("user",
        `Create a short opening line stating that you are ready to start the game. Be creative — a reference to the category '${category.name}' would be nice. Do NOT ask a question. Give the turn to the human.`);

    const result = await chatCompletion("game", [systemMessage, userMessage], { maxTokens: 150, reasoningEffort: "none" });
    return result.message;
}

// Post-game educational blurb for Classroom games, stored on the game document
// and shown on the game-over screen.
export async function makeLearnFact(aiWord: string, userWord: string, category: { name: string; description: string }): Promise<string> {
    const systemMessage = new Message("system",
        `You write short educational blurbs for a learning game. The round was played in the category '${category.name}' — ${category.description}`);
    const userMessage = new Message("user",
        `The round featured "${aiWord}" and "${userWord}". Write 2-3 interesting, accurate sentences about each — one short paragraph per word, separated by a blank line. Plain text only, no headings.`);

    const result = await chatCompletion("validation", [systemMessage, userMessage], { maxTokens: 400, reasoningEffort: "none" });
    return result.message.content.trim();
}

export async function makeSummary(userId: string, winner: WinnerState): Promise<Message> {
    const game = await getGameStatus(userId);

    let systemText = `You were playing 'Guess vs AI', a word-guessing game, against a human in the category '${game.category.name}'. The game is over now.
The human asked ${game.counter.human} questions and the AI asked ${game.counter.ai} questions.
The game went like this:
${flattenHistory(game.messages)}
`;

    switch (winner) {
        case WinnerState.AI:
            systemText += `\nThe AI (YOU) won the game! Be playful and celebratory, but keep it lighthearted!`;
            break;
        case WinnerState.HUMAN:
            systemText += `\nThe human won the game! Be gracious and congratulatory!`;
            break;
        case WinnerState.GIVENUP:
            systemText += `\nIt was probably a challenging game for both of you. No one won!`;
            break;
        default:
            systemText += `\nThe winner is uncertain...`;
            break;
    }

    const systemMessage = new Message("system", systemText);
    const userMessage = new Message("user",
        `Create a short, fun summary of the game. Keep it positive and entertaining, with a reference to the category '${game.category.name}' — '${game.category.description}' if possible.`);

    const result = await chatCompletion("game", [systemMessage, userMessage], { maxTokens: 800, reasoningEffort: "none" });
    // Summaries render through the "system" message style in the game window.
    result.message.role = "system";
    return result.message;
}
