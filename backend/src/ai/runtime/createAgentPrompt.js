export const createAgentPrompt = ({
    task,
    specification,
    inputs
}) => {

    if (!task) {
        throw new Error("Task is required.");
    }

    if (!specification) {
        throw new Error("Agent specification is required.");
    }

    if (!inputs) {
        throw new Error("Resolved inputs are required.");
    }

    return [
        {
            role: "system",
            content: `${specification.systemPrompt}\n\nCRITICAL TOKEN LIMIT WARNING: You are running in an environment with a strict output token limit. If you are asked to generate a large list, dataset, or itinerary (e.g., more than 10 items or days), YOU MUST group items together (e.g., "Days 5-15") or condense the information to prevent abrupt JSON truncation. NEVER generate massive arrays that will exceed your token limits, as this will crash the system with invalid JSON.`
        },
        {
            role: "user",
            content: JSON.stringify(
                {
                    task: {
                        id: task.id,
                        name: task.name,
                        objective: task.objective
                    },
                    inputs,
                    expectedOutput: task.expectedOutput
                },
                null,
                2
            )
        }
    ];

};