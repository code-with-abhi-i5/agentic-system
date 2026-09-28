export const extractHallucinatedJsonTool = (error) => {
    const failedGeneration =
        error?.error?.failed_generation || error?.failed_generation;

    if (!failedGeneration) {
        return null;
    }

    try {
        const parsed = JSON.parse(failedGeneration);

        if (
            parsed.name === "json" &&
            typeof parsed.arguments === "object"
        ) {
            return parsed.arguments;
        }

        return null;
    } catch {
        return null;
    }
};