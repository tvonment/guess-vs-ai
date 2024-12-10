import { Category } from "@/model/Categories";
import { Message } from "@/model/Message";
import { MessageRequestType } from "@/model/MessageRequestType";
import { startMessage } from "@/services/aiMessagesServcie";
import { addToHistory } from "@/services/cosmosService";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.body.userId as string;
    const messageRequestType = req.body.messageRequestType as MessageRequestType;
    const category = req.body.category as Category;

    switch (messageRequestType) {
        case MessageRequestType.START:
            const responseStart = await startMessage(category);
            await addToHistory(userId, responseStart);
            res.status(200).json({ messages: [responseStart as Message] });
            return;
    }
}