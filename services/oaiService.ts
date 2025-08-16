import { Message } from "@/model/Message";
import { Opponent } from "@/model/Opponent";

const API_KEY = process.env.AZURE_AI_FOUNDRY_API_KEY;
const AZURE_AI_FOUNDRY_ENDPOINT = process.env.AZURE_AI_FOUNDRY_ENDPOINT;
const VERIFICATION_MODEL = (process.env.AZURE_AI_FOUNDRY_ENDPOINT || "") + (process.env.AZURE_AI_FOUNDRY_VERIFICATION_MODEL || "");

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

    // Check if the inference_model starts with "model" to use Azure OpenAI endpoint
    if (opponent.inference_model.startsWith("model")) {
        return gptGrokCall(messages, opponent.inference_model, temperature, max_tokens, top_p);
    } else {
        return gptOpenaiCall(messages, opponent.inference_model, temperature, max_tokens, top_p);
    }
}

async function gptOpenaiCall(messages: Message[], inference_model: string, temperature: number, max_tokens: number, top_p: number): Promise<Message> {
    const requestBody = {
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens,
        top_p: top_p
    };

    console.log('Making request to:', `${AZURE_AI_FOUNDRY_ENDPOINT}${inference_model}`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetchWithRetry(`${AZURE_AI_FOUNDRY_ENDPOINT}${inference_model}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": `${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.text();
            errorDetails += `, response: ${errorBody}`;
            console.error('Error response body:', errorBody);
        } catch (e) {
            console.error('Could not read error response body:', e);
        }
        throw new Error(errorDetails);
    }

    const data = await response.json();
    const message = data.choices[0].message;
    return message as Message;
}

async function gptGrokCall(messages: Message[], inference_model: string, temperature: number, max_tokens: number, top_p: number): Promise<Message> {
    const requestBody = {
        messages: messages,
        max_completion_tokens: max_tokens,
        temperature: temperature,
        top_p: top_p,
        frequency_penalty: 0,
        presence_penalty: 0,
        model: "grok-3"
    };

    const fullUrl = `${AZURE_AI_FOUNDRY_ENDPOINT}${inference_model}`;
    console.log('Making Azure API request to:', fullUrl);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetchWithRetry(fullUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.text();
            errorDetails += `, response: ${errorBody}`;
            console.error('Error response body:', errorBody);
        } catch (e) {
            console.error('Could not read error response body:', e);
        }
        throw new Error(errorDetails);
    }

    const data = await response.json();
    const message = data.choices[0].message;
    return message as Message;
}

export async function gptSmallCall(messages: Message[], temperature?: number, max_tokens?: number, top_p?: number): Promise<Message> {
    if (!temperature) {
        temperature = 0;
    }
    if (!max_tokens) {
        max_tokens = 20;
    }
    if (!top_p) {
        top_p = 1;
    }

    const requestBody = {
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens,
        top_p: top_p
    };

    console.log('Making small call request to:', VERIFICATION_MODEL);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetchWithRetry(`${VERIFICATION_MODEL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": `${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.text();
            errorDetails += `, response: ${errorBody}`;
            console.error('Error response body:', errorBody);
        } catch (e) {
            console.error('Could not read error response body:', e);
        }
        throw new Error(errorDetails);
    }

    const data = await response.json();
    const message = data.choices[0].message;
    return message as Message;
}

async function fetchWithRetry(url: string, options: RequestInit, retries: number = 3, delay: number = 1000): Promise<Response> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            console.log(`Attempt ${attempt + 1}/${retries} for URL: ${url}`);
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            } else {
                let errorDetails = `HTTP error! status: ${response.status}`;
                try {
                    const errorBody = await response.text();
                    errorDetails += `, response: ${errorBody}`;
                    console.error(`Attempt ${attempt + 1} failed with error response body:`, errorBody);
                } catch (e) {
                    console.error(`Attempt ${attempt + 1} failed and could not read error response body:`, e);
                }
                throw new Error(errorDetails);
            }
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt < retries - 1) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Failed to fetch after multiple retries');
}