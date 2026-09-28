const createError = (
    code,
    message,
    task
) => ({
    code,
    severity: "ERROR",
    message,
    source: "dependency.validator",
    location: {
        task
    }
});

export const validateDependencies = (tasks) => {

    const errors = [];
    const warnings = [];

    const taskIds = new Set(
        tasks.map(task => task.id)
    );

    for (const task of tasks) {

        const dependencies =
            task.dependencies || [];

        const seenDependencies =
            new Set();

        for (const dependency of dependencies) {

            // Ignore empty dependency arrays
            if (
                dependency === null ||
                dependency === undefined ||
                dependency === ""
            ) {
                continue;
            }

            // Self dependency
            if (
                dependency === task.id
            ) {

                errors.push(
                    createError(
                        "SELF_DEPENDENCY",
                        `Task '${task.id}' cannot depend on itself.`,
                        task.id
                    )
                );

                continue;
            }

            // Duplicate dependency
            if (
                seenDependencies.has(
                    dependency
                )
            ) {

                warnings.push({
                    code: "DUPLICATE_DEPENDENCY",
                    severity: "WARNING",
                    message:
                        `Task '${task.id}' contains duplicate dependency '${dependency}'.`,
                    source:
                        "dependency.validator",
                    location: {
                        task: task.id
                    }
                });

                continue;
            }

            seenDependencies.add(
                dependency
            );

            // Unknown dependency
            if (
                !taskIds.has(
                    dependency
                )
            ) {

                errors.push(
                    createError(
                        "UNKNOWN_DEPENDENCY",
                        `Task '${task.id}' depends on unknown task '${dependency}'.`,
                        task.id
                    )
                );

            }

        }

    }

    return {
        errors,
        warnings
    };

};