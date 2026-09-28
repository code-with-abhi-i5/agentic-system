import { allam } from "../../ai/models/allam-2-7b.js";
import Conversation from "./conversation.model.js";
import { retryWithRateLimit } from "../../utils/retryWithRateLimit.js";

export const generateConversationTitle =
    async ({
        conversationId,
        userMessage
    }) => {
        const conversation =
            await Conversation.findById(
                conversationId
            );
        if (
            !conversation ||
            conversation.title !== "New Chat"
        ) {
            return;
        }

        const prompt = `
                Generate a short conversation title.
                Rules:
                - Maximum 5 words
                - No quotation marks
                - No punctuation
                - Return only the title

                User message:
                ${userMessage}
                `;

        const response =
            await retryWithRateLimit(() => allam.invoke(prompt));

        const title =
            response.content
                .trim()
                .replace(/^["']|["']$/g, "")
                .replace(/\.$/, "")
                .slice(0, 60);

        conversation.title = title;

        await conversation.save();
        return title;
    };