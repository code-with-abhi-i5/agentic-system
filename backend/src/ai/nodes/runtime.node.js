import e from "express";
import { runtimeExecutor } from "../runtime/runtimeExecutor.js";
import { logger } from "../../utils/logger.js";

export const runtimeNode = async (state, config) => {
    logger.info("[Runtime Node] Initiating dynamic graph execution...");

    // 1. Extract the generated artifacts from your parent graph's state
    const { blueprint, specifications, intent, userQuery } = state;

    // 2. Define the initial state that your generated graph expects.
    // Usually, this is the original intent so the dynamic agents know what to do.
    const initialRuntimeState = {
        variables: {
            intent: intent,
            constraints: state.constraints,
            raw_query: userQuery // Passing the raw string is highly recommended
        }
    };

    // 3. Fire the executor
    const finalRuntimeState = await runtimeExecutor({
        blueprint,
        specifications,
        initialState: initialRuntimeState,
        config
    });

    // 4. Return the results to append to the parent globalState
    return {
        // Ensure your globalState definition has a key for this (e.g., 'finalOutput' or 'dynamicState')
        finalOutput: finalRuntimeState
    };
};