import { compileRuntimeGraph } from "../compiler/compileRuntimeGraph.js";
import { logger } from "../../utils/logger.js";

export const runtimeExecutor = async ({
    blueprint,
    specifications,
    initialState,
    config
}) => {

    if (!blueprint) {
        throw new Error("Blueprint is required.");
    }

    if (!specifications) {
        throw new Error("Agent specifications are required.");
    }

    logger.info("========================================");
    logger.info("🚀 Runtime Graph Compilation");
    logger.info("========================================");

    const runtimeGraph =
        compileRuntimeGraph({
            blueprint,
            specifications
        });

    logger.info("✅ Runtime graph compiled.");

    logger.info("========================================");
    logger.info("🚀 Runtime Graph Execution");
    logger.info("========================================");

    const finalState =
        await runtimeGraph.invoke(initialState, config);

    logger.info("========================================");
    logger.info("✅ Runtime Execution Finished");

    return finalState;

};