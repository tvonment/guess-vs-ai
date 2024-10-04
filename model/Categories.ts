export enum CategoryType {
    Advanced = "Advanced",
    Theme = "Theme"
}

export const Categories: Category[] = [
    { name: "Marvel Cinematic Universe", description: "A character from the MCU", type: CategoryType.Theme },
    { name: "Star Wars", description: "A character from the Star Wars Universe", type: CategoryType.Theme },
    { name: "Harry Potter", description: "A character from the Harry Potter Universe", type: CategoryType.Theme },
    { name: "Disney Animal", description: "An animal from a Disney movie", type: CategoryType.Theme },
    { name: "Kitchen Object", description: "An object you can find in a kitchen", type: CategoryType.Theme },
    { name: "University Object", description: "An object you can find at a University", type: CategoryType.Theme },
    { name: "Any Character", description: "Any person or fictional character", type: CategoryType.Advanced },
    { name: "Any Animal", description: "An Animal of any kind.", type: CategoryType.Advanced },
    { name: "Any Object", description: "An object of any kind.", type: CategoryType.Advanced },
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