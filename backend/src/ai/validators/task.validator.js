const createError = (
    code,
    message,
    task
) => ({
    code,
    severity: "ERROR",
    message,
    source: "task.validator",
    location: {
        task
    }
});

export const validateTasks = (tasks) => {

    const errors = [];
    const warnings = [];

    if (!Array.isArray(tasks) || tasks.length === 0) {
        errors.push(
            createError(
                "TASKS_MISSING",
                "Blueprint must contain at least one task.",
                null
            )
        );

        return { errors, warnings };
    }

    const ids = new Set();
    const names = new Set();

    for (const task of tasks) {

        /* ---------- Required ---------- */

        if (!task.id?.trim()) {
            errors.push(
                createError(
                    "TASK_ID_MISSING",
                    "Task is missing an id.",
                    null
                )
            );
            continue;
        }

        if (!task.name?.trim()) {
            errors.push(
                createError(
                    "TASK_NAME_MISSING",
                    "Task is missing a name.",
                    task.id
                )
            );
        }

        if (!task.objective?.trim()) {
            errors.push(
                createError(
                    "TASK_OBJECTIVE_MISSING",
                    `Task '${task.id}' is missing an objective.`,
                    task.id
                )
            );
        }

        if (!task.rationale?.trim()) {
            errors.push(
                createError(
                    "TASK_RATIONALE_MISSING",
                    `Task '${task.id}' is missing a rationale.`,
                    task.id
                )
            );
        }

        /* ---------- Duplicate IDs ---------- */

        if (ids.has(task.id)) {
            errors.push(
                createError(
                    "DUPLICATE_TASK_ID",
                    `Duplicate task id '${task.id}'.`,
                    task.id
                )
            );
        } else {
            ids.add(task.id);
        }

        /* ---------- Duplicate Names ---------- */

        if (task.name) {
            if (names.has(task.name)) {
                errors.push(
                    createError(
                        "DUPLICATE_TASK_NAME",
                        `Duplicate task name '${task.name}'.`,
                        task.id
                    )
                );
            } else {
                names.add(task.name);
            }
        }

        /* ---------- Arrays ---------- */

        const arrayFields = [
            "requiredTools",
            "dependencies",
            "expectedInput",
            "expectedOutput",
            "successCriteria"
        ];

        for (const field of arrayFields) {

            if (!Array.isArray(task[field])) {

                errors.push(
                    createError(
                        "INVALID_FIELD",
                        `'${field}' must be an array.`,
                        task.id
                    )
                );

                continue;
            }

            if (
                field !== "dependencies" &&
                task[field].length === 0
            ) {

                warnings.push({
                    code: "EMPTY_ARRAY",
                    severity: "WARNING",
                    message: `'${field}' is empty for task '${task.id}'.`,
                    source: "task.validator",
                    location: {
                        task: task.id
                    }
                });

            }

        }

    }

    return {
        errors,
        warnings
    };

};