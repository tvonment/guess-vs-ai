import { Category } from "@/model/Categories";
import { Message } from "@/model/Message";
import { MessageRequestType } from "@/model/MessageRequestType";
import { makeHumiliation, makeSummary, startMessage } from "@/services/aiMessagesServcie";
import { addToHistory } from "@/services/cosmosService";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.body.userId as string;
    const messageRequestType = req.body.messageRequestType as MessageRequestType;
    const category = req.body.category as Category;
    const messages = req.body.messages as Message[];

    switch (messageRequestType) {
        case MessageRequestType.START:
            const responseStart = await startMessage(category);
            await addToHistory(userId, responseStart);
            res.status(200).json({ messages: [responseStart as Message] });
            return;
        case MessageRequestType.HUMILIATE:
            const responseHumiliation = await makeHumiliation(messages, category);
            await addToHistory(userId, responseHumiliation);
            res.status(200).json({ messages: [responseHumiliation as Message] });
            return;
        case MessageRequestType.SUMMARY:
            console.log("Summary", userId);
            const responseSummary = await makeSummary(userId);
            responseSummary.role = "system";
            await addToHistory(userId, responseSummary);
            res.status(200).json({ message: responseSummary as Message });
            return;
    }
}