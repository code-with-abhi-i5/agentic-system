import { z } from "zod";
import {
    StateSchema,
    ReducedValue,
} from "@langchain/langgraph";

// Define the structure of your message objects
const MessageSchema = z.object({
    role: z.string(),
    content: z.string()
});

export const ChatState =
    new StateSchema({
        messages: new ReducedValue(
            z.array(MessageSchema).default(() => []),
            {
                inputSchema: z.array(MessageSchema),
                // The reducer works the same, concatenating the new array of objects 
                // to the existing array of objects
                reducer: (x, y) => x.concat(y),
            }
        ),
    });