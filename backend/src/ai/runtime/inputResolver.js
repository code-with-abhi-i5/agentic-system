export const resolveInputs = ({
    task,
    state
}) => {

    if (!task) {
        throw new Error("Task is required.");
    }

    if (!state) {
        throw new Error("Runtime state is required.");
    }

    const resolvedInputs = {};

    for (const input of task.expectedInput) {

        // Variables produced by previous runtime agents or global state
        if (input in state.variables) {
            resolvedInputs[input] = state.variables[input];
            continue;
        }

        // Instead of fatally crashing the graph, provide a fallback and warn
        console.warn(`[InputResolver] Warning: Missing required runtime input "${input}" for task "${task.id}". Proceeding with fallback.`);
        resolvedInputs[input] = `[SYSTEM NOTE: The expected input "${input}" was not provided by previous tasks or the user.]`;
    }

    return resolvedInputs;

};