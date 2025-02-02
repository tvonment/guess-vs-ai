import { Message } from "@/model/Message";
import { Opponent, OpponentName } from "@/model/Opponent";

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_GPT4O_API_URL;
const OPENAI_API_MINI_URL = process.env.OPENAI_GPT4OMINI_API_URL;
const OPENAI_GPTO1MINI_API_URL = process.env.OPENAI_GPTO1MINI_API_URL;
const OPENAI_GPTO1MINI_API_KEY = process.env.OPENAI_GPTO1MINI_API_KEY;
const DEEPSEEK_R1_API_URL = process.env.DEEPSEEK_R1_API_URL;
const DEEPSEEK_R1_API_KEY = process.env.DEEPSEEK_R1_API_KEY;

export async function gptCall(messages: Message[], opponent: Opponent, temperature?: number, max_tokens?: number, top_p?: number): Promise<Message> {
    if (!temperature) {
        temperature = 0.5;
    }
    if (!max_tokens) {
        max_tokens = 100;
    }
    if (!top_p) {
        top_p = 1;
    }

    switch (opponent.name) {
        case OpponentName.OpenAIGPT4o:
            return gptOpenAIGPT4oCall(messages, temperature, max_tokens, top_p);
        case OpponentName.OpenAIGPTo1Mini:
            return gptOpenAIGPTo1MiniCall(messages);
        case OpponentName.DeepSeekR1:
            return gptDeepSeekR1Call(messages);
        default:
            return gptOpenAIGPT4oCall(messages, temperature, max_tokens, top_p);
    }
}

async function gptOpenAIGPT4oCall(messages: Message[], temperature: number, max_tokens: number, top_p: number): Promise<Message> {
    const response = await fetchWithRetry(`${OPENAI_API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": `${API_KEY}`,
        },
        body: JSON.stringify({
            messages: messages,
            temperature: temperature,
            max_tokens: max_tokens,
            top_p: top_p
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const message = data.choices[0].message;
    return message as Message;
}

export async function gptOpenAIGPTo1MiniCall(messages: Message[]): Promise<Message> {
    // change system message to assistant message
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === "system") {
            messages[i].role = "user";
        }
    }
    const response = await fetchWithRetry(`${OPENAI_GPTO1MINI_API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": `${OPENAI_GPTO1MINI_API_KEY}`,
        },
        body: JSON.stringify({
            messages: messages,
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const message = data.choices[0].message;
    return message as Message;
}

export async function gptDeepSeekR1Call(messages: Message[]): Promise<Message> {
    const response = await fetchWithRetry(`${DEEPSEEK_R1_API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_R1_API_KEY}`,
        },
        body: JSON.stringify({
            messages: messages,
            max_tokens: 2000,
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    let message = data.choices[0].message as Message;
    // Remvoe Think part.
    message.content = message.content.replace(/<think>.*?<\/think>/gs, '').trim();
    return message;
}

export async function gptMiniCall(messages: Message[], temperature?: number, max_tokens?: number, top_p?: number): Promise<Message> {
    if (!temperature) {
        temperature = 0;
    }
    if (!max_tokens) {
        max_tokens = 20;
    }
    if (!top_p) {
        top_p = 1;
    }

    const response = await fetchWithRetry(`${OPENAI_API_MINI_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": `${API_KEY}`,
        },
        body: JSON.stringify({
            messages: messages,
            temperature: temperature,
            max_tokens: max_tokens,
            top_p: top_p
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const message = data.choices[0].message;
    return message as Message;
}

async function fetchWithRetry(url: string, options: RequestInit, retries: number = 3, delay: number = 1000): Promise<Response> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            if (attempt < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Failed to fetch after multiple retries');
}

function getModelCredentials(opponent: Opponent): { key: string, url: string } {
    switch (opponent.name) {
        case OpponentName.OpenAIGPT4o:
            return { url: OPENAI_API_URL as string, key: API_KEY as string };
        case OpponentName.OpenAIGPTo1Mini:
            return { url: OPENAI_GPTO1MINI_API_URL as string, key: OPENAI_GPTO1MINI_API_KEY as string };
        case OpponentName.DeepSeekR1:
            return { url: DEEPSEEK_R1_API_URL as string, key: DEEPSEEK_R1_API_KEY as string };
        default:
            return { url: OPENAI_API_URL as string, key: API_KEY as string };
    }
}