import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faShield, faJedi, faWandSparkles, faPaw, faBasketball, faMusic } from "@fortawesome/free-solid-svg-icons";

export enum CategoryType {
    Advanced = "Advanced",
    Theme = "Theme"
}

export const Categories: Category[] = [
    {
        name: "Marvel",
        description: "Select a character from any movie or series within the Marvel Universe.",
        type: CategoryType.Theme,
        icon: faShield as IconProp,
        image: "/images/shield.webp"
    },
    {
        name: "Star Wars",
        description: "Choose a character from the Star Wars saga, including films, series, and expanded universe.",
        type: CategoryType.Theme,
        icon: faJedi as IconProp,
        image: "/images/stormtrooper.png"
    },
    {
        name: "Harry Potter",
        description: "Pick a character from the Harry Potter universe, encompassing books and films.",
        type: CategoryType.Theme,
        icon: faWandSparkles as IconProp,
        image: "/images/harrypotter.PNG"
    },
    {
        name: "Disney Animal",
        description: "An animal character featured in any Disney animated or live-action movie.",
        type: CategoryType.Theme,
        icon: faPaw as IconProp,
        image: "/images/Guess vs AI logo.png"
    },
    {
        name: "NBA Player",
        description: "An NBA player.",
        type: CategoryType.Theme,
        icon: faBasketball as IconProp,
        image: "/images/LeBron.PNG"
    },
    {
        name: "Music Artist",
        description: "A famous music artist or band.",
        type: CategoryType.Theme,
        icon: faMusic as IconProp,
        image: "/images/queen.PNG"
    }
];

export class Category {
    name: string;
    description: string;
    type: CategoryType;
    icon: IconProp;
    image: string;

    constructor(name: string, description: string, type: CategoryType, icon: IconProp, image: string) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.icon = icon;
        this.image = image;
    }
}