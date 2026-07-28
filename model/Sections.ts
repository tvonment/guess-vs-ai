import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGamepad, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { Category, ClassroomCategories, NerdZoneCategories } from "./Categories";

export type Section = {
    id: string;
    name: string;
    description: string;
    icon: IconProp;
    image: string;
    categories: Category[];
};

export const Sections: Section[] = [
    {
        id: "nerd-zone",
        name: "Nerd Zone",
        description: "Fictional universes, pop culture and icons — play for the fun of it.",
        icon: faGamepad as IconProp,
        image: "/images/Guess vs AI logo.png",
        categories: NerdZoneCategories,
    },
    {
        id: "classroom",
        name: "Classroom",
        description: "History, geography and more — learn while you play.",
        icon: faGraduationCap as IconProp,
        image: "/images/earth.png",
        categories: ClassroomCategories,
    }
];

// Resolves a category (top-level or subcategory) by its game-wide unique name,
// including where it sits in the section/parent hierarchy.
export function findCategory(name: string): { category: Category, parentName: string | null, sectionName: string } | undefined {
    for (const section of Sections) {
        for (const category of section.categories) {
            if (category.name === name) {
                return { category: category, parentName: null, sectionName: section.name };
            }
            const sub = category.subcategories?.find((s) => s.name === name);
            if (sub) {
                return { category: sub, parentName: category.name, sectionName: section.name };
            }
        }
    }
    return undefined;
}
