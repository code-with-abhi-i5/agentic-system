import Message from "./message.model.js";

export const saveMessage = async ({
    conversationId,
    role,
    content,
}) => {

    return Message.create({
        conversationId,
        role,
        content,
    });

};