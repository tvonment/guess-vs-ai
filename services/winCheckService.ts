import { Message } from "@/model/Message";
import { gptMiniCall } from "./oaiService";

const winCheckSystemMessage = `
You are a game referee verifying if a user's guess is a perfect match for the correct answer. 
You will be given a guess and a correct word. 
Your instructions:

- Respond ONLY with the word "win" or "no".
- Respond "win" if and only if the guess clearly identifies the correct word or character, even if there are minor spelling mistakes. For example:
  - Guess: "Scherlok Holms" vs Correct Word: "Sherlock Holmes" → "win"
  - Guess: "Hary Poter" vs Correct Word: "Harry Potter" → "win"
- Respond "no" if the guess is incorrect, only partially correct, or merely describes attributes without naming the exact character or word. For example:
  - Guess: "Is your character male?" vs Correct Word: "Harry Potter" → "no"
  - Guess: "Is your character part of the Avengers?" vs Correct Word: "Iron Man" → "no"
- The user must guess the exact entity. Being close is not enough unless the guess names the intended entity clearly, despite minor spelling errors.
- No other explanations, no additional words. Only "win" or "no".
`;

export async function winCheck(guess: string, word: string): Promise<boolean> {
    const systemMessage: Message = {
        role: "system",
        content: winCheckSystemMessage,
    };
    const fewShotMessages: Message[] = [
        // Marvel
        {
            role: "user",
            content: "Is your character Iron Man? Correct Word: iron man",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Correct character, with alternate form (Tony Stark)
        {
            role: "user",
            content: "Is your character Tony Stark, also known as Iron man? Correct Word: iron man",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute-based, not a direct guess
        {
            role: "user",
            content: "Does your character wear a high-tech suit? Correct Word: Iron Man",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Team affiliation only
        {
            role: "user",
            content: "Is your character part of the avengers? Correct Word: Iron Man",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Slightly misspelled but clearly the same hero
        {
            role: "user",
            content: "Is your character Iroon Man? Correct Word: Iron Man",
        },
        {
            role: "assistant",
            content: "win"
        },

        // Star Wars
        {
            role: "user",
            content: "Is your character Luke Skywaker? Correct Word: Luke Skywalker",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute only
        {
            role: "user",
            content: "Is your character a Jedi? Correct Word: Luke Skywalker",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your character the son of Anakin Skywalker? Correct Word: Luke Skywalker",
        },
        {
            role: "assistant",
            content: "no"
        },
        // More misspelling allowed
        {
            role: "user",
            content: "Is your character Luuke Skywalker? Correct Word: Luke Skywalker",
        },
        {
            role: "assistant",
            content: "win"
        },

        // Harry Potter
        {
            role: "user",
            content: "Is your character Hary Poter? Correct Word: Harry Potter",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute only
        {
            role: "user",
            content: "Is your character a wizard who survived Voldemort's attack? Correct Word: Harry Potter",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your character a Gryffindor student who fights Voldemort? Correct Word: Harry Potter",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Slight variation in spelling
        {
            role: "user",
            content: "Is your character Herry Potter? Correct Word: Harry Potter",
        },
        {
            role: "assistant",
            content: "win"
        },

        // Disney Animal
        {
            role: "user",
            content: "Is your animal Simba? Correct Word: Simba",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute only
        {
            role: "user",
            content: "Is your character from The Lion King? Correct Word: Simba",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your animal a lion cub who becomes king? Correct Word: Simba",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Minor typos
        {
            role: "user",
            content: "Is your animal Simbaa? Correct Word: Simba",
        },
        {
            role: "assistant",
            content: "win"
        },

        // Historical Figures
        {
            role: "user",
            content: "Is your figure Cleopatra? Correct Word: Cleopatra",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Is your figure Cleopatra? Correct Word: Albert Einstein",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Attribute only
        {
            role: "user",
            content: "Is your figure a famous physicist who developed the theory of relativity? Correct Word: Albert Einstein",
        },
        {
            role: "assistant",
            content: "no"
        },
        {
            role: "user",
            content: "Is your figure a German-born scientist known for E=mc²? Correct Word: Albert Einstein",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Minor spelling errors but correct name
        {
            role: "user",
            content: "Is your figure Albrt Einstien? Correct Word: Albert Einstein",
        },
        {
            role: "assistant",
            content: "win"
        },

        // Additional examples to ensure clarity:
        // Marvel character, correct but slightly wrong spelling
        {
            role: "user",
            content: "Is your character Capten Amerca? Correct Word: Captain America",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Marvel attribute only
        {
            role: "user",
            content: "Is your character a super-soldier from WWII? Correct Word: Captain America",
        },
        {
            role: "assistant",
            content: "no"
        },

        // Star Wars, correct guess with minor misspelling
        {
            role: "user",
            content: "Is your character Obi-Wan Kenobie? Correct Word: Obi-Wan Kenobi",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Star Wars attribute only
        {
            role: "user",
            content: "Is your character a wise Jedi mentor? Correct Word: Obi-Wan Kenobi",
        },
        {
            role: "assistant",
            content: "no"
        },

        // Harry Potter additional example
        {
            role: "user",
            content: "Is your character Hermoine Granger? Correct Word: Hermione Granger",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute only
        {
            role: "user",
            content: "Is your character a smart witch who studied at Hogwarts? Correct Word: Hermione Granger",
        },
        {
            role: "assistant",
            content: "no"
        },

        // Disney Animal additional example
        {
            role: "user",
            content: "Is your animal Dumbo? Correct Word: Dumbo",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute only
        {
            role: "user",
            content: "Is your animal an elephant that can fly? Correct Word: Dumbo",
        },
        {
            role: "assistant",
            content: "no"
        },

        // Historical Figures additional example
        {
            role: "user",
            content: "Is your figure Nelzon Mandela? Correct Word: Nelson Mandela",
        },
        {
            role: "assistant",
            content: "win"
        },
        {
            role: "user",
            content: "Is your figure a South African anti-apartheid revolutionary? Correct Word: Nelson Mandela",
        },
        {
            role: "assistant",
            content: "no"
        },

        // Gurgi (from "The Black Cauldron")
        {
            role: "user",
            content: "Is your character Gurgi? Correct Word: Gurgi (from The Black Cauldron)",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Slight spelling variation
        {
            role: "user",
            content: "Is your character Gurghi? Correct Word: Gurgi (from The Black Cauldron)",
        },
        {
            role: "assistant",
            content: "win"
        },
        // Attribute-based, no direct name
        {
            role: "user",
            content: "Is your character that furry creature from The Black Cauldron? Correct Word: Gurgi (from The Black Cauldron)",
        },
        {
            role: "assistant",
            content: "no"
        },
        // Mentioning the movie without naming the character
        {
            role: "user",
            content: "Is your character someone from The Black Cauldron? Correct Word: Gurgi (from The Black Cauldron)",
        },
        {
            role: "assistant",
            content: "no"
        }
    ];

    const userMessage: Message = {
        role: "user",
        content: guess + " Correct Word" + word
    }

    try {
        const gptResponse = await gptMiniCall([systemMessage, ...fewShotMessages, userMessage]);
        console.log("Win Check:", guess, word, gptResponse.content);
        if (gptResponse.content === "win") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error selecting word:", error);
        throw error;
    }
}