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
    const result = await chatCompletion("game", [instructions, ...history, task], { maxTokens: 400, reasoningEffort: "low" });
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
