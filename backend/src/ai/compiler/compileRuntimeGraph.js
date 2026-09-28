import {
    StateGraph,
    START,
    END,
    Annotation
} from "@langchain/langgraph";

import { createRuntimeAgent } from "../runtime/createRuntimeAgent.js";
import { RuntimeState } from "../runtime/runtime.state.js";
import { TOOL_REGISTRY } from "../tools/registry.js";

export const compileRuntimeGraph = ({
    blueprint,
    specifications
}) => {

    if (!blueprint) {
        throw new Error("Blueprint is required.");
    }

    if (!specifications) {
        throw new Error("Agent specifications are required.");
    }

    const workflow =
        new StateGraph(RuntimeState);

    // ----------------------------------------------------
    // Fast Specification Lookup
    // ----------------------------------------------------

    const specificationMap =
        new Map(
            specifications.map(spec => [
                spec.taskId,
                spec
            ])
        );
    // ----------------------------------------------------
    // Create Runtime Nodes
    // ----------------------------------------------------

    for (const task of blueprint.tasks) {
        const specification = specificationMap.get(task.id);

        const tools = task.requiredTools.map(name => {
            const tool = TOOL_REGISTRY[name];
            if (!tool) {
                throw new Error(`Unknown runtime tool "${name}".`);
            }
            return tool;
        });

        if (!specification) {
            throw new Error(`Missing specification for task "${task.id}".`);
        }

        workflow.addNode(
            task.id,
            createRuntimeAgent({
                task,
                specification,
                tools
            })
        );
    }

    // ----------------------------------------------------
    // Topological Sort for Linear Execution
    // ----------------------------------------------------
    // We enforce a strictly linear DAG to completely avoid
    // LangGraph's fan-in multi-execution bugs and missing dependency errors.
    
    const sortedTasks = [];
    const visited = new Set();
    const visiting = new Set();
    
    function visit(taskId) {
        if (visited.has(taskId)) return;
        if (visiting.has(taskId)) {
            console.warn(`[Graph Compiler] Circular dependency detected at ${taskId}! Breaking cycle.`);
            return;
        }
        
        visiting.add(taskId);
        const task = blueprint.tasks.find(t => t.id === taskId);
        
        if (task && task.dependencies) {
            for (const dep of task.dependencies) {
                visit(dep);
            }
        }
        
        visiting.delete(taskId);
        visited.add(taskId);
        if (task) {
            sortedTasks.push(task);
        }
    }
    
    blueprint.tasks.forEach(t => visit(t.id));

    // ----------------------------------------------------
    // Create Runtime Edges (Strictly Linear)
    // ----------------------------------------------------

    if (sortedTasks.length > 0) {
        workflow.addEdge(START, sortedTasks[0].id);
        
        for (let i = 0; i < sortedTasks.length - 1; i++) {
            workflow.addEdge(sortedTasks[i].id, sortedTasks[i + 1].id);
        }
        
        workflow.addEdge(sortedTasks[sortedTasks.length - 1].id, END);
    } else {
        workflow.addEdge(START, END);
    }

    return workflow.compile();

};