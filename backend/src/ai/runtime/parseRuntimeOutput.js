export const parseRuntimeOutput = ({
    task,
    response
}) => {

    if (!task) {
        throw new Error("Task is required.");
    }

    if (!response) {
        throw new Error(
            `Task "${task.id}" returned an empty response.`
        );
    }

    // --------------------------------------------------
    // Extract content from LangChain AIMessage or string
    // --------------------------------------------------

    let content;

    if (typeof response === "string") {

        content = response;

    } else if (typeof response.content === "string") {

        content = response.content;

    } else {

        throw new Error(
            `Task "${task.id}" returned an unsupported response type.`
        );

    }

    // --------------------------------------------------
    // Remove markdown if the model ignored instructions
    // --------------------------------------------------

    content = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // --------------------------------------------------
    // Extract JSON object
    // --------------------------------------------------

    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {

        // Fallback: if there is exactly ONE expected output, we can safely assume 
        // the LLM just returned the raw content instead of wrapping it in JSON.
        if (task.expectedOutput && task.expectedOutput.length === 1) {
            const key = task.expectedOutput[0];
            return {
                [key]: content
            };
        }

        throw new Error(
            `Task "${task.id}" did not return valid JSON.`
        );

    }

    let parsed;

    try {

        parsed = JSON.parse(match[0]);

    } catch (error) {

        throw new Error(
            `Task "${task.id}" returned malformed JSON.\n${error.message}`
        );

    }

    // --------------------------------------------------
    // Validate required outputs
    // --------------------------------------------------

    for (const key of task.expectedOutput) {

        if (!(key in parsed)) {

            throw new Error(
                `Task "${task.id}" is missing expected output "${key}".`
            );

        }

    }

    return parsed;

};