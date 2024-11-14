import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faShield, faJedi, faWandMagicSparkles, faPaw, faBasketball, faMusic } from "@fortawesome/free-solid-svg-icons";

export enum CategoryType {
    Advanced = "Advanced",
    Theme = "Theme"
}

export const Categories: Category[] = [
    {
        name: "Marvel Cinematic Universe",
        description: "Select a character from any movie or series within the Marvel Cinematic Universe.",
        type: CategoryType.Theme,
        icon: faShield as IconProp
    },
    {
        name: "Star Wars",
        description: "Choose a character from the Star Wars saga, including films, series, and expanded universe.",
        type: CategoryType.Theme,
        icon: faJedi as IconProp
    },
    {
        name: "Harry Potter",
        description: "Pick a character from the Harry Potter universe, encompassing books and films.",
        type: CategoryType.Theme,
        icon: faWandMagicSparkles as IconProp
    },
    {
        name: "Disney Animal",
        description: "An animal character featured in any Disney animated or live-action movie.",
        type: CategoryType.Theme,
        icon: faPaw as IconProp
    },
    {
        name: "NBA Player",
        description: "An NBA player.",
        type: CategoryType.Theme,
        icon: faBasketball as IconProp // Make sure to import this icon as well
    },
    {
        name: "Music Artist",
        description: "A famous music artist or band.",
        type: CategoryType.Theme,
        icon: faMusic as IconProp
    }
];

export class Category {
    name: string;
    description: string;
    type: CategoryType;
    icon: IconProp;

    constructor(name: string, description: string, type: CategoryType, icon: IconProp) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.icon = icon;
    }
}