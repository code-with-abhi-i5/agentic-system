import { Annotation } from "@langchain/langgraph";

export const IntentState = Annotation.Root({
    userQuery: Annotation({
        reducer: (_, value) => value,
        default: () => ""
    }),

    intent: Annotation({
        reducer: (_, value) => value,
        default: () => null
    })
});