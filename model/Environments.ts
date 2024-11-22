export class Environment {
    type: EnvironmentType;
    name: string;
    color: string;

    constructor(type: EnvironmentType, name: string, color: string) {
        this.name = name;
        this.type = type;
        this.color = color;
    }
}

export enum EnvironmentType {
    PROD = "PROD",
    DEV = "DEV",
    TEST = "TEST",
    LOCAL = "LOCAL"
}

export const Environments: Environment[] = [
    {
        name: "BETA",
        type: EnvironmentType.TEST,
        color: "#7ec78f"
    },
    {
        name: "Development",
        type: EnvironmentType.DEV,
        color: "#4863A0"
    },
    {
        name: "Local",
        type: EnvironmentType.LOCAL,
        color: "#e69c99"
    }
];