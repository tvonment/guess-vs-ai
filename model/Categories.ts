export enum CategoryType {
    Advanced = "Advanced",
    Theme = "Theme"
}

export const Categories: Category[] = [
    {
        name: "Marvel Cinematic Universe",
        description: "Select a character from any movie or series within the Marvel Cinematic Universe.",
        type: CategoryType.Theme
    },
    {
        name: "Star Wars",
        description: "Choose a character from the Star Wars saga, including films, series, and expanded universe.",
        type: CategoryType.Theme
    },
    {
        name: "Harry Potter",
        description: "Pick a character from the Harry Potter universe, encompassing books and films.",
        type: CategoryType.Theme
    },
    {
        name: "Disney Animal",
        description: "An animal character featured in any Disney animated or live-action movie.",
        type: CategoryType.Theme
    },
    {
        name: "NBA Player",
        description: "An NBA player.",
        type: CategoryType.Theme
    },
    {
        name: "Music Artist",
        description: "A famous music artist or band.",
        type: CategoryType.Theme
    }
];

export class Category {
    name: string;
    description: string;
    type: CategoryType;

    constructor(name: string, description: string, type: CategoryType) {
        this.name = name;
        this.description = description;
        this.type = type;
    }
}