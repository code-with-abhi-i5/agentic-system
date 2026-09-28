import { logger } from "./logger.js";
import { rotateGroqKey } from "../config/groqRotation.js";
import { env } from "../config/env.js";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const retryWithRateLimit = async (operation, config = null) => {
    let jsonRetries = 0;
    let consecutiveRateLimits = 0;
    const maxInstantRetries = env.GROQ_API_KEYS ? env.GROQ_API_KEYS.length : 1;

    while (true) {
        try {
            const result = await operation();
            consecutiveRateLimits = 0; // Reset on success
            return result;
        } catch (error) {
            const message = error?.message ?? "";
            const status = error?.status || error?.status_code || error?.error?.status_code || error?.error?.status;
            const errorCode = error?.error?.code || error?.code;
            
            // Handle Groq structured output / tool calling JSON parse failures
            if (
                status === 400 && 
                (
                    errorCode === "json_validate_failed" || 
                    message.includes("does not match the expected schema") || 
                    message.includes("Failed to parse tool call arguments") || 
                    message.includes("tool_use_failed")
                ) &&
                jsonRetries < 3
            ) {
                jsonRetries++;
                logger.warn(`⚠️ JSON Validation/Parse Failed from API. Retrying (${jsonRetries}/3)...`);
                
                if (config) {
                    await dispatchCustomEvent("agent_retry", { message: `Fixing JSON syntax (${jsonRetries}/3)...` }, config);
                }
                
                await sleep(1000); // Wait 1 second before retrying
                continue;
            }

            // Handle Groq 429 rate limits
            if (
                error?.status === 429 ||
                message.includes("Please try again in")
            ) {
                logger.warn(`⚠️ GROQ RATE LIMIT ENCOUNTERED.`);
                consecutiveRateLimits++;
                
                if (consecutiveRateLimits < maxInstantRetries) {
                    const rotated = rotateGroqKey();
                    if (rotated) {
                        logger.info("🔄 Retrying immediately with new API key...");
                        // No sleep needed, just retry on next iteration
                        continue;
                    }
                }

                // Fallback: If rotation failed or all keys are currently exhausted, we must wait
                const match = message.match(/try again in ([\d.]+)s/i);
                const seconds = match ? Number(match[1]) : 10;
                const waitTime = Math.ceil(seconds * 1000) + 1000;
                
                logger.warn(`⏳ All keys exhausted. Waiting ${seconds}s before retrying...`);
                
                if (config) {
                    await dispatchCustomEvent("agent_retry", { message: `Rate limit: Waiting ${seconds}s...` }, config);
                }
                
                await sleep(waitTime);
                
                // Reset counter after cooldown so we can cycle again if needed
                consecutiveRateLimits = 0; 
                logger.info("🔄 Retrying after rate limit wait...");
                continue;
            }

            throw error;
        }
    }
}