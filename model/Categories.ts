import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faShield, faJedi, faWandSparkles, faPaw, faBook, faFlag, faCloudBolt, faBasketball, faCalendar } from "@fortawesome/free-solid-svg-icons";

export enum CategoryType {
    Featured = "Featured",
    Advanced = "Advanced",
    Theme = "Theme"
}

export const Categories: Category[] = [
    {
        name: "Marvel Universe",
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
        name: "Historical Figures",
        description: "Pick a famous historical figure from any era, such as Cleopatra, Einstein, or Mandela.",
        type: CategoryType.Theme,
        icon: faBook as IconProp,
        image: "/images/sokrates.PNG"
    },
    {
        name: "Historical Events",
        description: "Select a significant historical event, such as the moon landing, the fall of the Berlin Wall, or the French Revolution.",
        type: CategoryType.Featured,
        icon: faCalendar as IconProp,
        image: "/images/timeline.png"
    },
    {
        name: "Iconic Sports Athletes",
        description: "Choose an iconic sports athlete from any sport, such as Michael Jordan, Serena Williams, or Usain Bolt.",
        type: CategoryType.Featured,
        icon: faBasketball as IconProp,
        image: "/images/Guess vs AI logo.png"
    },
    {
        name: "Countries",
        description: "Select a country from around the world.",
        type: CategoryType.Featured,
        icon: faFlag as IconProp,
        image: "/images/earth.png"
    },
    {
        name: "Ancient Gods",
        description: "Choose a god or goddess from an ancient mythology, such as Greek, Roman, or Norse.",
        type: CategoryType.Featured,
        icon: faCloudBolt as IconProp,
        image: "/images/gods.png",
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