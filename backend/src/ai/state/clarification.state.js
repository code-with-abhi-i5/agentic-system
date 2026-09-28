import { Annotation } from "@langchain/langgraph";

export const ClarificationState =
    Annotation.Root({

        intent: Annotation(),

        clarification: Annotation({

            reducer: (_, value) => value,

            default: () => null

        })

    });