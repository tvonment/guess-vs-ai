import { CosmosClient } from "@azure/cosmos";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING || "";

const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);
const database = client.database("gvaDB");
const container = database.container("chatContainer");


export async function getUsedCharacters(category: string): Promise<string[]> {
    console.log("Get Used Characters Request received");

    try {
        // Retrieve chat history from Cosmos DB
        const query = `SELECT c.aiWord FROM c WHERE c.category = @category`;
        const db = await container.items.query({
            query: query,
            parameters: [{ name: "@category", value: category }]
        }).fetchAll();
        const usedCharacters: { aiWord: string }[] = db.resources;
        const usedCharactersArray: string[] = usedCharacters.map((item) => item.aiWord);
        return usedCharactersArray as string[] || [];
    } catch (error: unknown) {
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An error occurred");
        }
        return [];
    }
}