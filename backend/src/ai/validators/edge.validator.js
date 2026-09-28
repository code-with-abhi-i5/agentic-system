const VALID_CONDITIONS = new Set([
    "ALWAYS",
    "SUCCESS",
    "FAILURE"
]);

const createError = (
    code,
    message,
    edge
) => ({
    code,
    severity: "ERROR",
    message,
    source: "edge.validator",
    location: {
        edge
    }
});

export const validateEdges = (
    tasks,
    edges
) => {

    const errors = [];
    const warnings = [];

    if (
        !Array.isArray(edges) ||
        edges.length === 0
    ) {

        errors.push(
            createError(
                "EDGES_MISSING",
                "Blueprint must contain at least one edge.",
                null
            )
        );

        return {
            errors,
            warnings
        };

    }

    const taskIds = new Set(
        tasks.map(task => task.id)
    );

    const edgeSet = new Set();

    let startEdges = 0;
    let endEdges = 0;

    for (const edge of edges) {

        const {
            from,
            to,
            condition
        } = edge;

        /* ----------------------------- */
        /* Required Fields               */
        /* ----------------------------- */

        if (!from?.trim()) {

            errors.push(
                createError(
                    "EDGE_FROM_MISSING",
                    "Edge is missing 'from'.",
                    edge
                )
            );

            continue;

        }

        if (!to?.trim()) {

            errors.push(
                createError(
                    "EDGE_TO_MISSING",
                    "Edge is missing 'to'.",
                    edge
                )
            );

            continue;

        }

        /* ----------------------------- */
        /* Duplicate Edge                */
        /* ----------------------------- */

        const key =
            `${from}->${to}:${condition}`;

        if (
            edgeSet.has(key)
        ) {

            warnings.push({
                code: "DUPLICATE_EDGE",
                severity: "WARNING",
                message:
                    `Duplicate edge '${key}'.`,
                source: "edge.validator",
                location: {
                    edge
                }
            });

        } else {

            edgeSet.add(key);

        }

        /* ----------------------------- */
        /* Condition Validation          */
        /* ----------------------------- */

        if (
            !VALID_CONDITIONS.has(
                condition
            )
        ) {

            errors.push(
                createError(
                    "INVALID_EDGE_CONDITION",
                    `Invalid edge condition '${condition}'.`,
                    edge
                )
            );

        }

        /* ----------------------------- */
        /* START Validation              */
        /* ----------------------------- */

        if (
            from === "START"
        ) {

            startEdges++;

        } else if (
            !taskIds.has(from)
        ) {

            errors.push(
                createError(
                    "UNKNOWN_SOURCE_TASK",
                    `Unknown source task '${from}'.`,
                    edge
                )
            );

        }

        /* ----------------------------- */
        /* END Validation                */
        /* ----------------------------- */

        if (
            to === "END"
        ) {

            endEdges++;

        } else if (
            !taskIds.has(to)
        ) {

            errors.push(
                createError(
                    "UNKNOWN_DESTINATION_TASK",
                    `Unknown destination task '${to}'.`,
                    edge
                )
            );

        }

        /* ----------------------------- */
        /* Illegal START / END Usage     */
        /* ----------------------------- */

        if (
            to === "START"
        ) {

            errors.push(
                createError(
                    "INVALID_START_TARGET",
                    "START cannot be a destination node.",
                    edge
                )
            );

        }

        if (
            from === "END"
        ) {

            errors.push(
                createError(
                    "INVALID_END_SOURCE",
                    "END cannot be a source node.",
                    edge
                )
            );

        }

    }

    /* --------------------------------- */
    /* Global START / END Checks         */
    /* --------------------------------- */

    if (startEdges === 0) {

        errors.push(
            createError(
                "START_EDGE_MISSING",
                "No edge originates from START.",
                null
            )
        );

    }

    if (startEdges > 1) {

        warnings.push({
            code: "MULTIPLE_START_EDGES",
            severity: "WARNING",
            message:
                "Multiple START edges detected. Ensure the graph intentionally supports multiple entry branches.",
            source: "edge.validator",
            location: null
        });

    }

    if (endEdges === 0) {

        errors.push(
            createError(
                "END_EDGE_MISSING",
                "No edge terminates at END.",
                null
            )
        );

    }

    return {
        errors,
        warnings
    };

};