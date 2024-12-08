import { Categories, Category } from "@/model/Categories";
import { Message } from "@/model/Message";
import { MessageRequestType } from "@/model/MessageRequestType";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Message Request received");
    const { categoryName } = req.body;
    const { messageRequestType } = req.body;
    const category = Categories.find((c) => c.name === categoryName) as Category;
    console.log(`Category: ${category.name}`);

    switch (messageRequestType) {
        case MessageRequestType.START:
            res.status(200).json({ messages: [{ role: "assistant", content: `Alright, I've locked in my word from the '${category.name}' category. Your move—ask away, and let's see what you've got!` } as Message] });
            return;
    }
}