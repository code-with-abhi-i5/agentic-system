import { Annotation } from "@langchain/langgraph";

export const RuntimeState = Annotation.Root({
    // --------------------------------------------------
    // Runtime Working Memory
    // --------------------------------------------------

    variables: Annotation({
        reducer: (current, update) => ({
            ...current,
            ...update
        }),
        default: () => ({})
    }),

    // --------------------------------------------------
    // Execution Tracking
    // --------------------------------------------------

    completedTasks: Annotation({
        reducer: (_, value) => value,
        default: () => []
    }),

    failedTasks: Annotation({
        reducer: (_, value) => value,
        default: () => []
    }),

    currentTask: Annotation({
        reducer: (_, value) => value,
        default: () => null
    }),

    // --------------------------------------------------
    // Tool Communication
    // --------------------------------------------------

    toolCalls: Annotation({
        reducer: (_, value) => value,
        default: () => []
    }),

    toolResults: Annotation({
        reducer: (_, value) => value,
        default: () => []
    })
    
});