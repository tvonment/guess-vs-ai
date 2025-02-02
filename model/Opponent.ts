export enum OpponentName {
    OpenAIGPT4o = "OpenAI GPT-4o",
    OpenAIGPTo1Mini = "OpenAI o1-mini",
    DeepSeekR1 = "DeepSeek R1"
}

export const Opponents: Opponent[] = [
    {
        name: OpponentName.OpenAIGPT4o,
        description: "Fast multimodal LLM, not reasoning.",
        image: "/images/openai.png"
    },
    {
        name: OpponentName.OpenAIGPTo1Mini,
        description: "Reasoning LLM, slower but deeper.",
        image: "/images/openai.png"
    },
    {
        name: OpponentName.DeepSeekR1,
        description: "New reasoning LLM, very slow but thoughtful.",
        image: "/images/deepseek.png"
    }
];


export class Opponent {
    name: OpponentName;
    description: string;
    image: string;
    constructor(name: OpponentName, image: string, description: string) {
        this.name = name;
        this.description = description;
        this.image = image;
    }
}