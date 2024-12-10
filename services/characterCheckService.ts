import { Category } from "@/model/Categories";
import { gptMiniCall } from "./oaiService";
import { Message } from "@/model/Message";

export async function characterCheck(word: string, category: Category): Promise<boolean> {
    const systemMessageText = { role: "system", content: `You need to check if the selected word fits in the Category of "${category.name}" with the following description: ${category.description}. Only answer with 'yes' or 'no'` } as Message;
    const fewShotMessages: Message[] = [
        {
            role: "user",
            content: "Word: elephant - Category: Any Animal - Description: Any species of animal that you find in the real world."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: dragon - Category: Any Animal - Description: Any species of animal that you find in the real world."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: Iron Man - Category: Marvel Cinematic Universe - Description: Select a character from any movie or series within the Marvel Cinematic Universe."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: Batman - Category: Marvel Cinematic Universe - Description: Select a character from any movie or series within the Marvel Cinematic Universe."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: Hermione Granger - Category: Harry Potter - Description: Pick a character from the Harry Potter universe, encompassing books and films."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: Luke Skywalker - Category: Harry Potter - Description: Pick a character from the Harry Potter universe, encompassing books and films."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: Chewbacca - Category: Star Wars - Description: Choose a character from the Star Wars saga, including films, series, and expanded universe."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: Gandalf - Category: Star Wars - Description: Choose a character from the Star Wars saga, including films, series, and expanded universe."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: Simba - Category: Disney Animal - Description: An animal character featured in any Disney animated or live-action movie."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: Mickey Mouse - Category: Disney Animal - Description: An animal character featured in any Disney animated or live-action movie."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: frying pan - Category: Kitchen Object - Description: An item commonly found in a kitchen setting."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: microscope - Category: Kitchen Object - Description: An item commonly found in a kitchen setting."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: blackboard - Category: University Object - Description: An object typically found within a university environment, such as classrooms or laboratories."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: sofa - Category: University Object - Description: An object typically found within a university environment, such as classrooms or laboratories."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: Albert Einstein - Category: Any Character - Description: Any real or fictional person from history, literature, media, or imagination."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: Mount Everest - Category: Any Character - Description: Any real or fictional person from history, literature, media, or imagination."
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Word: pencil - Category: Any Object - Description: Any inanimate item or artifact, regardless of its nature or use."
        },
        {
            role: "assistant",
            content: "yes"
        },
        {
            role: "user",
            content: "Word: happiness - Category: Any Object - Description: Any inanimate item or artifact, regardless of its nature or use."
        },
        {
            role: "assistant",
            content: "no"
        },
    ];
    const userMessage =
        {
            role: "user",
            content: `Word: ${word} - Category: ${category.name} - Description: ${category.description}`
        } as Message;
    try {
        const gptResponse = await gptMiniCall([systemMessageText, ...fewShotMessages, userMessage], 0);
        const response = gptResponse.content;
        if (response === "yes") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking word:", error);
        throw error;
    }
}