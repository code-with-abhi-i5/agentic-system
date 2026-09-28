const createError = (
    code,
    message,
    location = null
) => ({
    code,
    severity: "ERROR",
    message,
    source: "graph.validator",
    location
});

export const validateGraph = (
    tasks,
    edges
) => {

    const errors = [];
    const warnings = [];

    const taskIds = new Set(
        tasks.map(task => task.id)
    );

    /* -------------------------------- */
    /* Build adjacency list             */
    /* -------------------------------- */

    const graph = new Map();

    graph.set("START", []);

    for (const task of tasks) {
        graph.set(task.id, []);
    }

    graph.set("END", []);

    for (const edge of edges) {

        if (!graph.has(edge.from))
            graph.set(edge.from, []);

        graph.get(edge.from).push(edge.to);

    }

    /* -------------------------------- */
    /* Reachability                     */
    /* -------------------------------- */

    const visited = new Set();

    const dfs = (node) => {

        if (visited.has(node))
            return;

        visited.add(node);

        for (const neighbour of graph.get(node) || []) {
            dfs(neighbour);
        }

    };

    dfs("START");

    for (const task of tasks) {

        if (!visited.has(task.id)) {

            warnings.push({
                code: "UNREACHABLE_TASK",
                severity: "WARNING",
                message:
                    `Task '${task.id}' cannot be reached from START.`,
                source: "graph.validator",
                location: {
                    task: task.id
                }
            });

        }

    }

    /* -------------------------------- */
    /* Cycle Detection                  */
    /* -------------------------------- */

    const recursionStack = new Set();
    const cycleVisited = new Set();

    const detectCycle = (node) => {

        if (recursionStack.has(node))
            return true;

        if (cycleVisited.has(node))
            return false;

        cycleVisited.add(node);
        recursionStack.add(node);

        for (const neighbour of graph.get(node) || []) {

            if (neighbour === "END")
                continue;

            if (detectCycle(neighbour))
                return true;

        }

        recursionStack.delete(node);

        return false;

    };

    if (detectCycle("START")) {

        errors.push(
            createError(
                "CIRCULAR_DEPENDENCY",
                "Graph contains a circular dependency."
            )
        );

    }

    /* -------------------------------- */
    /* Connectivity                     */
    /* -------------------------------- */

    for (const task of tasks) {

        const incoming = edges.some(
            edge => edge.to === task.id
        );

        const outgoing = edges.some(
            edge => edge.from === task.id
        );

        if (!incoming) {

            warnings.push({
                code: "NO_INCOMING_EDGE",
                severity: "WARNING",
                message:
                    `Task '${task.id}' has no incoming edge.`,
                source: "graph.validator",
                location: {
                    task: task.id
                }
            });

        }

        if (!outgoing) {

            warnings.push({
                code: "NO_OUTGOING_EDGE",
                severity: "WARNING",
                message:
                    `Task '${task.id}' has no outgoing edge.`,
                source: "graph.validator",
                location: {
                    task: task.id
                }
            });

        }

    }

    /* -------------------------------- */
    /* END Reachability                 */
    /* -------------------------------- */

    if (!visited.has("END")) {

        errors.push(
            createError(
                "END_UNREACHABLE",
                "END node cannot be reached from START."
            )
        );

    }

    /* -------------------------------- */
    /* Orphan Tasks                     */
    /* -------------------------------- */

    for (const task of tasks) {

        const referenced =
            edges.some(
                edge =>
                    edge.from === task.id ||
                    edge.to === task.id
            );

        if (!referenced) {

            warnings.push({
                code: "ORPHAN_TASK",
                severity: "WARNING",
                message:
                    `Task '${task.id}' is completely disconnected from the graph.`,
                source: "graph.validator",
                location: {
                    task: task.id
                }
            });

        }

    }

    return {
        errors,
        warnings
    };

};