import { testGraph } from "../../ai/graphs/test.graph.js";

export const generateResponse = async (
    message,
    userId,
    conversationId
) => {
    // Note: The new testGraph accepts the initialState in the form of { userQuery: "..." }
    const formattedMessage = typeof message === "string" ? message : message.content;

    return testGraph.streamEvents(
        {
            userQuery: formattedMessage,
        },
        {
            configurable: {
                thread_id: `${userId}:${conversationId.toString()}`,
            },
            version: "v2"
        }
    );
};