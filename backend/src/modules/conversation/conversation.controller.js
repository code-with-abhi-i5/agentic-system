import {
    getUserConversations,
    getConversationMessages,
    deleteConversation,
    renameConversation,
} from "./conversation.service.js";


export const getUserConversationsController =
    async (
        req,
        res
    ) => {

        try {

            const conversations =
                await getUserConversations(
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                data: conversations,
            });

        }
        catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    };

export const getConversationMessagesController =
    async (
        req,
        res
    ) => {

        try {

            const messages =
                await getConversationMessages(
                    req.params.id,
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                data: messages,
            });

        }
        catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    };
export const renameConversationController =
    async (req, res) => {

        try {

            const conversation =
                await renameConversation(
                    req.params.id,
                    req.user.userId,
                    req.body.title
                );

            res.json({
                success: true,
                data: conversation,
            });

        }
        catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    };
export const deleteConversationController =
    async (
        req,
        res
    ) => {

        try {

            await deleteConversation(
                req.params.id,
                req.user.userId
            );

            res.json({
                success: true,
            });

        }
        catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    };