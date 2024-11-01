import { Message } from "@/model/Message";

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_GPT4O_API_URL;
const OPENAI_API_MINI_URL = process.env.OPENAI_GPT4OMINI_API_URL;

export async function gptCall(messages: Message[], temperature?: number, max_tokens?: number, top_p?: number): Promise<Message> {
    if (!temperature) {
        temperature = 0.5;
    }
    if (!max_tokens) {
        max_tokens = 100;
    }
    if (!top_p) {
        top_p = 1;
    }

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