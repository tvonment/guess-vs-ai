import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faShield, faJedi, faWandSparkles, faPaw, faBook, faFlag, faCloudBolt, faBasketball, faCalendar, faMonument } from "@fortawesome/free-solid-svg-icons";

export enum CategoryType {
    Featured = "Featured",
    Advanced = "Advanced",
    Theme = "Theme"
}

// Pop culture & icons — the "Nerd Zone" section.
export const NerdZoneCategories: Category[] = [
    {
        name: "Marvel Universe",
        description: "Select a character from any movie or series within the Marvel Universe.",
        type: CategoryType.Theme,
        icon: faShield as IconProp,
        image: "/images/shield.webp",
        subcategories: [
            {
                name: "Infinity Saga",
                description: "Characters from the Infinity Saga, including Iron Man, Captain America, Thanos and more.",
                type: CategoryType.Theme,
                icon: faShield as IconProp,
                image: "/images/shield.webp"
            }
        ]
    },
    {
        name: "Star Wars",
        description: "Choose a character from the Star Wars saga, including films, series, and expanded universe.",
        type: CategoryType.Theme,
        icon: faJedi as IconProp,
        image: "/images/stormtrooper.png",
        subcategories: [
            {
                name: "Original Trilogy",
                description: "Characters from the original Star Wars trilogy, including A New Hope, The Empire Strikes Back, and Return of the Jedi.",
                type: CategoryType.Theme,
                icon: faJedi as IconProp,
                image: "/images/stormtrooper.png",
            },
            {
                name: "Prequel Trilogy",
                description: "Characters from the prequel Star Wars trilogy, including The Phantom Menace, Attack of the Clones, and Revenge of the Sith.",
                type: CategoryType.Theme,
                icon: faJedi as IconProp,
                image: "/images/stormtrooper.png",
            },
            {
                name: "Sequel Trilogy",
                description: "Characters from the sequel Star Wars trilogy, including The Force Awakens, The Last Jedi, and The Rise of Skywalker.",
                type: CategoryType.Theme,
                icon: faJedi as IconProp,
                image: "/images/stormtrooper.png",
            },
            {
                name: "Skywalker Saga",
                description: "Characters from the entire Skywalker saga, including all three trilogies.",
                type: CategoryType.Theme,
                icon: faJedi as IconProp,
                image: "/images/stormtrooper.png",
            },
            {
                name: "The Mandalorian",
                description: "Characters from the Disney+ series The Mandalorian, including Din Djarin, Grogu, and Moff Gideon.",
                type: CategoryType.Theme,
                icon: faJedi as IconProp,
                image: "/images/stormtrooper.png",
            }
        ]
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
        name: "Iconic Sports Athletes",
        description: "Choose an iconic sports athlete from any sport, such as Michael Jordan, Serena Williams, or Usain Bolt.",
        type: CategoryType.Featured,
        icon: faBasketball as IconProp,
        image: "/images/Guess vs AI logo.png"
    },
    {
        name: "Ancient Gods",
        description: "Choose a god or goddess from an ancient mythology, such as Greek, Roman, or Norse.",
        type: CategoryType.Featured,
        icon: faCloudBolt as IconProp,
        image: "/images/gods.png",
    }
];

// Learning-oriented topics — the "Classroom" section.
export const ClassroomCategories: Category[] = [
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
        name: "Countries",
        description: "Select a country from around the world.",
        type: CategoryType.Featured,
        icon: faFlag as IconProp,
        image: "/images/earth.png"
    },
    {
        name: "World War II",
        description: "Pick an event or person from World War II, from D-Day to Winston Churchill.",
        type: CategoryType.Featured,
        icon: faMonument as IconProp,
        image: "/images/timeline.png",
        subcategories: [
            {
                name: "WW2 Events",
                description: "Significant events of World War II, such as D-Day, the Battle of Stalingrad, or the attack on Pearl Harbor.",
                type: CategoryType.Featured,
                icon: faMonument as IconProp,
                image: "/images/timeline.png",
            },
            {
                name: "WW2 People",
                description: "Key figures of World War II, such as Winston Churchill, Franklin D. Roosevelt, or Erwin Rommel.",
                type: CategoryType.Featured,
                icon: faMonument as IconProp,
                image: "/images/timeline.png",
            }
        ]
    }
];

// Flat list across all sections (category names are unique game-wide).
export const Categories: Category[] = [...NerdZoneCategories, ...ClassroomCategories];

export class Category {
    name: string;
    description: string;
    type: CategoryType;
    icon: IconProp;
    image: string;
    subcategories?: Category[] = [];

    constructor(name: string, description: string, type: CategoryType, icon: IconProp, image: string) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.icon = icon;
        this.image = image;
    }
}
