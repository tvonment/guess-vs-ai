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
        name: "Kitchen Object",
        description: "An item commonly found in a kitchen setting.",
        type: CategoryType.Theme
    },
    {
        name: "University Object",
        description: "An object typically found within a university environment, such as classrooms or laboratories.",
        type: CategoryType.Theme
    },
    {
        name: "Any Character",
        description: "Any real or fictional person from history, literature, media, or imagination.",
        type: CategoryType.Advanced
    },
    {
        name: "Any Animal",
        description: "Any species of animal, whether real or mythical.",
        type: CategoryType.Advanced
    },
    {
        name: "Any Object",
        description: "Any inanimate item or artifact, regardless of its nature or use.",
        type: CategoryType.Advanced
    },
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