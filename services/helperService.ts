import { generateText, stepCountIs } from "ai";
import { createAzure } from "@ai-sdk/azure";
import { createMCPClient } from "@ai-sdk/mcp";
import { CategoryRef } from "@/model/Game";
import { helperSourceFor } from "@/model/HelperSources";

// The Study Buddy is the app's one agentic path (tool loop against MCP
// knowledge sources) and runs on the Vercel AI SDK; the deterministic game
// core stays on the hand-rolled llmService.

const ENDPOINT = process.env.AZURE_AI_FOUNDRY_ENDPOINT || "";
const API_KEY = process.env.AZURE_AI_FOUNDRY_API_KEY || "";
const GAME_MODEL = process.env.AI_GAME_MODEL || "";

// Gateway-mode baseURL (non-*.openai.azure.com host): the provider appends
// the path directly, producing the same Foundry v1 URL the game core uses.
const azure = createAzure({
    baseURL: `${ENDPOINT.replace(/\/+$/, "")}/openai/v1`,
    apiKey: API_KEY,
});

const MAX_HISTORY = 10;
const MAX_MESSAGE_CHARS = 1000;
const MAX_TOOL_RESULT_CHARS = 6000;
const MAX_STEPS = 4;
const ANSWER_MAX_TOKENS = 1500;
const OVERALL_TIMEOUT_MS = 25_000;

// Only these MS Learn tools may reach the model, even if the server adds more.
const HELPER_TOOL_ALLOWLIST = ["microsoft_docs_search", "microsoft_docs_fetch", "microsoft_code_sample_search"];

export type HelperMessage = { role: "user" | "assistant"; content: string };
export type HelperReply = { answer: string; usedTools: boolean };

// Takes only scalars/category — never the game document — so the opponent's
// word structurally cannot reach the prompt.
function buildSystemPrompt(userWord: string, category: CategoryRef, hasTools: boolean): string {
    let prompt = `You are the Study Buddy for 'Guess vs AI', a word-guessing game. The player's own secret word is "${userWord}", from the category '${category.name}' (${category.description}).

Your job is to answer the player's factual questions about their OWN word and its general domain, so they can answer the AI's yes/no questions truthfully and learn along the way.

Strict rules:
1. Only discuss facts about "${userWord}" and general knowledge of the category '${category.name}'.
2. NEVER formulate or suggest questions for the player to ask the AI, and never advise on guessing strategy or what to guess.
3. You know nothing about the AI's secret word. NEVER speculate about it, hint at it, or help narrow it down.
4. If a request breaks these rules or is off-topic, refuse in one short sentence and invite a factual question about "${userWord}" instead.
5. Be concise: 1-3 short sentences, or a short bulleted list. Plain text, no headings.`;
    if (hasTools) {
        prompt += `

You have Microsoft Learn documentation tools. Use them when official, current documentation would improve accuracy; answer simple questions directly from knowledge. Prefer one quick search over many.`;
    }
    return prompt;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Docs pages can be huge (a single MS Learn search returns 50k+ chars) — cap
// what a tool result feeds back into the prompt. structuredContent duplicates
// the text blocks in full, so it is dropped outright.
function truncateToolResult(result: any): any {
    if (result && typeof result === "object" && Array.isArray(result.content)) {
        let budget = MAX_TOOL_RESULT_CHARS;
        const content = result.content.map((block: any) => {
            if (block?.type === "text" && typeof block.text === "string") {
                const text = block.text.slice(0, Math.max(0, budget));
                budget -= text.length;
                return text.length < block.text.length ? { ...block, text: `${text}\n…[truncated]` } : block;
            }
            return block;
        });
        const truncated = { ...result, content };
        delete truncated.structuredContent;
        return truncated;
    }
    return result;
}

function wrapWithTruncation(tool: any): any {
    if (typeof tool?.execute !== "function") {
        return tool;
    }
    return {
        ...tool,
        execute: async (...args: any[]) => truncateToolResult(await tool.execute(...args)),
    };
}

export async function askHelper(userWord: string, category: CategoryRef, history: HelperMessage[], question: string): Promise<HelperReply> {
    const source = helperSourceFor(category);
    let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | null = null;
    let tools: Record<string, any> | undefined;

    if (source) {
        try {
            mcpClient = await createMCPClient({ transport: { type: "http", url: source.mcpUrl } });
            const allTools: Record<string, any> = await mcpClient.tools();
            tools = Object.fromEntries(
                Object.entries(allTools)
                    .filter(([name]) => HELPER_TOOL_ALLOWLIST.includes(name))
                    .map(([name, tool]) => [name, wrapWithTruncation(tool)])
            );
            if (Object.keys(tools).length === 0) {
                tools = undefined;
            }
        } catch (error: unknown) {
            // The helper must keep working when the docs source is down.
            console.warn("Study Buddy: knowledge source unavailable, answering without tools:", error instanceof Error ? error.message : error);
            tools = undefined;
        }
    }

    const messages = [
        ...history.slice(-MAX_HISTORY).map((message) => ({
            role: message.role,
            content: message.content.slice(0, MAX_MESSAGE_CHARS),
        })),
        { role: "user" as const, content: question },
    ];

    try {
        const result = await generateText({
            model: azure(GAME_MODEL),
            system: buildSystemPrompt(userWord, category, !!tools),
            messages,
            tools,
            stopWhen: stepCountIs(MAX_STEPS),
            maxOutputTokens: ANSWER_MAX_TOKENS,
            abortSignal: AbortSignal.timeout(OVERALL_TIMEOUT_MS),
            providerOptions: { openai: { reasoningEffort: "low" } },
        });

        const answer = result.text.trim();
        return {
            answer: answer || "Sorry, I could not come up with an answer — try rephrasing your question.",
            usedTools: (result.steps?.length ?? 1) > 1,
        };
    } finally {
        await mcpClient?.close().catch(() => undefined);
    }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
