export const calculateMetrics = (
    blueprint
) => {

    const {
        tasks,
        edges
    } = blueprint;

    /* -------------------------------- */
    /* Graph Construction               */
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
    /* Root / Leaf Tasks                */
    /* -------------------------------- */

    const incoming = {};
    const outgoing = {};

    for (const task of tasks) {

        incoming[task.id] = 0;
        outgoing[task.id] = 0;

    }

    for (const edge of edges) {

        if (edge.from !== "START")
            outgoing[edge.from]++;

        if (edge.to !== "END")
            incoming[edge.to]++;

    }

    const rootTasks =
        Object.keys(incoming)
            .filter(task => incoming[task] === 0);

    const leafTasks =
        Object.keys(outgoing)
            .filter(task => outgoing[task] === 0);

    /* -------------------------------- */
    /* Maximum Parallel Branches        */
    /* -------------------------------- */

    let parallelBranches = 0;

    for (const task in outgoing) {

        parallelBranches =
            Math.max(
                parallelBranches,
                outgoing[task]
            );

    }

    /* -------------------------------- */
    /* Graph Depth                      */
    /* -------------------------------- */

    let maxDepth = 0;

    const dfsDepth = (
        node,
        depth
    ) => {

        maxDepth =
            Math.max(
                maxDepth,
                depth
            );

        for (
            const neighbour of
            graph.get(node) || []
        ) {

            dfsDepth(
                neighbour,
                depth + 1
            );

        }

    };

    dfsDepth(
        "START",
        0
    );

    /* -------------------------------- */
    /* Longest Path                     */
    /* -------------------------------- */

    let longestPath = 0;

    const dfsLongest = (
        node,
        length,
        visited = new Set()
    ) => {

        if (
            visited.has(node)
        ) return;

        visited.add(node);

        longestPath =
            Math.max(
                longestPath,
                length
            );

        for (
            const neighbour of
            graph.get(node) || []
        ) {

            dfsLongest(
                neighbour,
                length + 1,
                new Set(visited)
            );

        }

    };

    dfsLongest(
        "START",
        0
    );

    /* -------------------------------- */
    /* Execution Width                  */
    /* -------------------------------- */

    const levels = {};

    const bfs = () => {

        const queue = [
            {
                node: "START",
                level: 0
            }
        ];

        const visited =
            new Set();

        while (
            queue.length
        ) {

            const {
                node,
                level
            } =
                queue.shift();

            if (
                visited.has(node)
            ) continue;

            visited.add(node);

            levels[level] ??= 0;
            levels[level]++;

            for (
                const neighbour of
                graph.get(node) || []
            ) {

                queue.push({
                    node: neighbour,
                    level: level + 1
                });

            }

        }

    };

    bfs();

    const width =
        Math.max(
            ...Object.values(levels)
        );

    /* -------------------------------- */
    /* Return                           */
    /* -------------------------------- */

    return {

        totalTasks:
            tasks.length,

        totalEdges:
            edges.length,

        rootTasks,

        leafTasks,

        graphDepth:
            maxDepth,

        executionWidth:
            width,

        longestPath,

        parallelBranches

    };

};