import {
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";

import {
    MemorySaver,
} from "@langchain/langgraph";

import { ChatState }
    from "../state/state.js";

import { chatNode }
    from "../nodes/chat.node.js";

const workflow =
    new StateGraph(ChatState);

workflow.addNode(
    "chatNode",
    chatNode
);

workflow.addEdge(
    START,
    "chatNode"
);

workflow.addEdge(
    "chatNode",
    END
);

const checkpointer =
    new MemorySaver();

export const chatGraph =
    workflow.compile({
        checkpointer,
    });
