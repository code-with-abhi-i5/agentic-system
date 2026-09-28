import { Annotation } from "@langchain/langgraph";

export const AgentSpecificationState = Annotation.Root({

    specifications: Annotation({

        reducer: (_, value) => value,

        default: () => []

    })

});