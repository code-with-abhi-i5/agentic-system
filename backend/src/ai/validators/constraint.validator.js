const createError = (
    code,
    message
) => ({
    code,
    severity: "ERROR",
    message,
    source: "constraint.validator",
    location: null
});

export const validateConstraints = (
    blueprint
) => {

    const errors = [];
    const warnings = [];

    const {
        execution,
        tasks,
        edges,
        constraints
    } = blueprint;

    /* -------------------------------- */
    /* maxTasks                         */
    /* -------------------------------- */

    if (
        execution.maxTasks <
        tasks.length
    ) {

        errors.push(
            createError(
                "MAX_TASK_LIMIT_EXCEEDED",
                `Blueprint contains ${tasks.length} tasks but execution.maxTasks is ${execution.maxTasks}.`
            )
        );

    }

    /* -------------------------------- */
    /* maxRetries                       */
    /* -------------------------------- */

    if (
        execution.maxRetries < 0
    ) {

        errors.push(
            createError(
                "INVALID_MAX_RETRIES",
                "execution.maxRetries cannot be negative."
            )
        );

    }

    /* -------------------------------- */
    /* Entry Task Exists                */
    /* -------------------------------- */

    const taskIds = new Set(
        tasks.map(task => task.id)
    );

    if (
        !taskIds.has(
            execution.entryTask
        )
    ) {

        errors.push(
            createError(
                "INVALID_ENTRY_TASK",
                `Entry task '${execution.entryTask}' does not exist.`
            )
        );

    }

    /* -------------------------------- */
    /* allowParallel                    */
    /* -------------------------------- */

    if (
        constraints.allowParallel === false
    ) {

        const outgoing = {};

        for (const edge of blueprint.edges) {

            if (
                edge.from === "START" ||
                edge.to === "END"
            ) continue;

            outgoing[edge.from] ??= 0;
            outgoing[edge.from]++;

        }

        for (const node in outgoing) {

            if (
                outgoing[node] > 1
            ) {

                warnings.push({
                    code: "PARALLEL_BRANCH_DETECTED",
                    severity: "WARNING",
                    message:
                        `Task '${node}' creates ${outgoing[node]} parallel branches while allowParallel=false.`,
                    source: "constraint.validator",
                    location: {
                        task: node
                    }
                });

            }

        }

    }

    /* -------------------------------- */
    /* Human Approval                   */
    /* -------------------------------- */

    if (
        typeof constraints.requiresHumanApproval !==
        "boolean"
    ) {

        errors.push(
            createError(
                "INVALID_HUMAN_APPROVAL_FLAG",
                "requiresHumanApproval must be a boolean."
            )
        );

    }

    /* -------------------------------- */
    /* Verification                     */
    /* -------------------------------- */

    if (
        typeof constraints.requiresVerification !==
        "boolean"
    ) {

        errors.push(
            createError(
                "INVALID_VERIFICATION_FLAG",
                "requiresVerification must be a boolean."
            )
        );

    }

    return {
        errors,
        warnings
    };

};