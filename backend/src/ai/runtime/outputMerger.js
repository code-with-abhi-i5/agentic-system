export const mergeOutputs = ({
    task,
    state,
    output
}) => {

    if (!task) {
        throw new Error("Task is required.");
    }

    if (!state) {
        throw new Error("Runtime state is required.");
    }

    if (!output || typeof output !== "object") {
        throw new Error(
            `Task "${task.id}" returned an invalid output object.`
        );
    }

    const mergedVariables = {
        ...state.variables
    };

    // --------------------------------------------------
    // Validate Expected Outputs
    // --------------------------------------------------

    for (const key of task.expectedOutput) {

        if (!(key in output)) {

            throw new Error(
                `Task "${task.id}" did not produce required output "${key}".`
            );

        }

        mergedVariables[key] =
            output[key];

    }

    return {

        ...state,

        variables: mergedVariables,

        completedTasks: [
            ...state.completedTasks,
            task.id
        ]

    };

};