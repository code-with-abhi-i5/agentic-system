import { Router } from "express";

import {
    getUserConversationsController,
    getConversationMessagesController,
    renameConversationController,
    deleteConversationController,
} from "./conversation.controller.js";
import { authMiddleware } from "../../middleware/auth.js";


const router = Router();

router.get(
    "/",
    authMiddleware,
    getUserConversationsController
);

router.get(
    "/:id",
    authMiddleware,
    getConversationMessagesController
);

router.patch(
    "/:id",
    authMiddleware,
    renameConversationController
);

router.delete(
    "/:id",
    authMiddleware,
    deleteConversationController
);

export default router;