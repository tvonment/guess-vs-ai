export enum OpponentName {
    OpenAIGPT4o = "OpenAI GPT-4o",
    OpenAIGPT5 = "OpenAI GPT-5 (Preview)",
    Grok = "Grok 3 (Preview)"
}

export const Opponents: Opponent[] = [
    {
        name: OpponentName.OpenAIGPT4o,
        description: "Original Research Opponent",
        image: "/images/openai.png",
        inference_model: "openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview"
    },
    {
        name: OpponentName.OpenAIGPT5,
        description: "Challange the new GPT 5 Model",
        image: "/images/openai.png",
        inference_model: "openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview"
    },
    {
        name: OpponentName.Grok,
        description: "Challange Elon's Grok Model",
        image: "/images/grok.png",
        inference_model: "models/chat/completions?api-version=2024-05-01-preview"
    }

];


export class Opponent {
    name: OpponentName;
    description: string;
    image: string;
    inference_model: string;
    constructor(name: OpponentName, image: string, description: string, inference_model: string) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.inference_model = inference_model;
    }
}