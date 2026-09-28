import { Annotation } from "@langchain/langgraph";

export const BlueprintState = Annotation.Root({

    blueprint: Annotation({

        reducer: (_, value) => value,

        default: () => null

    })

});