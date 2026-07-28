import { Message } from "@/model/Message";

const API_KEY = process.env.AZURE_AI_FOUNDRY_API_KEY || "";
const ENDPOINT = process.env.AZURE_AI_FOUNDRY_ENDPOINT || "";

// Deployment names on the Foundry resource (e.g. "gpt-5.6-terra").
const MODEL_DEPLOYMENTS = {
    game: process.env.AI_GAME_MODEL || "",
    validation: process.env.AI_VALIDATION_MODEL || "",
} as const;

// Foundry v1 API: deployment name goes in the body's `model` field, no api-version.
const CHAT_COMPLETIONS_URL = `${ENDPOINT.replace(/\/+$/, "")}/openai/v1/chat/completions`;

export type LlmTier = keyof typeof MODEL_DEPLOYMENTS;

export type LlmUsage = {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
};

export type LlmResult = {
    message: Message;
    usage?: LlmUsage;
};

type LlmOptions = {
    maxTokens?: number;
    reasoningEffort?: "none" | "low" | "medium" | "high";
    responseFormat?: object;
};

const DEFAULT_MAX_TOKENS = 400;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

export function modelIdOf(tier: LlmTier): string {
    return MODEL_DEPLOYMENTS[tier];
}

export async function chatCompletion(tier: LlmTier, messages: Message[], options: LlmOptions = {}): Promise<LlmResult> {
    // GPT-5.x deployments reject temperature/top_p and require max_completion_tokens,
    // so only universally supported parameters are sent.
    const body: Record<string, unknown> = {
        model: MODEL_DEPLOYMENTS[tier],
        messages: messages,
        max_completion_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    };
    if (options.reasoningEffort) {
        body.reasoning_effort = options.reasoningEffort;
    }
    if (options.responseFormat) {
        body.response_format = options.responseFormat;
    }

    let data = await requestChatCompletion(body);
    let choice = data.choices?.[0];

    // With reasoning enabled, max_completion_tokens is a combined budget that
    // reasoning tokens draw from first — if it is exhausted mid-reasoning the
    // API returns 200 with empty content. Retry once without reasoning.
    if (!hasContent(choice) && choice?.finish_reason === "length" && body.reasoning_effort && body.reasoning_effort !== "none") {
        console.warn(`[llm] ${tier} reasoning exhausted the token budget, retrying without reasoning`);
        data = await requestChatCompletion({ ...body, reasoning_effort: "none" });
        choice = data.choices?.[0];
    }

    if (!hasContent(choice)) {
        throw new Error(`LLM response for '${tier}' had no message content (finish_reason: ${choice?.finish_reason})`);
    }

    const usage: LlmUsage | undefined = data.usage
        ? {
            promptTokens: data.usage.prompt_tokens ?? 0,
            completionTokens: data.usage.completion_tokens ?? 0,
            totalTokens: data.usage.total_tokens ?? 0,
        }
        : undefined;
    if (usage) {
        console.log(`[llm] ${tier} tokens: prompt=${usage.promptTokens} completion=${usage.completionTokens}`);
    }

    return { message: new Message(choice.message.role || "assistant", choice.message.content), usage };
}

export function jsonSchemaFormat(name: string, schema: object): object {
    return { type: "json_schema", json_schema: { name, strict: true, schema } };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function hasContent(choice: any): boolean {
    return typeof choice?.message?.content === "string" && choice.message.content !== "";
}

async function requestChatCompletion(body: Record<string, unknown>): Promise<any> {
    const response = await fetchWithRetry(CHAT_COMPLETIONS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
        },
        body: JSON.stringify(body),
    });
    return response.json();
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function retryDelayMs(attempt: number, response?: Response): number {
    const retryAfter = response?.headers.get("retry-after");
    if (retryAfter) {
        const seconds = Number(retryAfter);
        if (!Number.isNaN(seconds) && seconds > 0) {
            // Capped so a generous Retry-After can't stall an API route past
            // the platform's execution window.
            return Math.min(seconds * 1000, 8_000);
        }
    }
    return 500 * 2 ** attempt + Math.random() * 250;
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let response: Response | undefined;
        try {
            response = await fetch(url, { ...init, signal: controller.signal });
        } catch (error) {
            lastError = error;
        } finally {
            clearTimeout(timeout);
        }

        if (response) {
            if (response.ok) {
                return response;
            }
            const detail = await response.text().catch(() => "");
            const error = new Error(`LLM request failed with status ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
            const retryable = response.status === 429 || response.status >= 500;
            if (!retryable) {
                throw error;
            }
            lastError = error;
        }

        if (attempt < MAX_ATTEMPTS - 1) {
            console.warn(`LLM request attempt ${attempt + 1}/${MAX_ATTEMPTS} failed, retrying`);
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs(attempt, response)));
        }
    }
    throw lastError instanceof Error ? lastError : new Error("LLM request failed after retries");
}
