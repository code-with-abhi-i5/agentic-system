import { ChatGroq } from "@langchain/groq";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

let currentKeyIndex = 0;

export const getActiveGroqKey = () => {
    if (!env.GROQ_API_KEYS || env.GROQ_API_KEYS.length === 0) {
        return env.GROQ_API_KEY; // fallback
    }
    return env.GROQ_API_KEYS[currentKeyIndex];
};

export const rotateGroqKey = () => {
    if (!env.GROQ_API_KEYS || env.GROQ_API_KEYS.length <= 1) {
        logger.warn("⚠️ Cannot rotate GROQ key: Not enough keys provided in environment.");
        return false;
    }
    currentKeyIndex = (currentKeyIndex + 1) % env.GROQ_API_KEYS.length;
    logger.info(`🔄 Rotated GROQ API key. Now using key index: ${currentKeyIndex}`);
    return true;
};

import { Groq } from "groq-sdk";

// Monkey-patch ChatGroq to inject the active API key just before invocation.
// This ensures that all models (even those cloned via bindings) will use the latest key.
const originalGenerate = ChatGroq.prototype._generate;
const originalStream = ChatGroq.prototype._streamResponseChunks;

function applyRotatedKey(instance) {
    const activeKey = getActiveGroqKey();
    if (activeKey) {
        instance.apiKey = activeKey;
        if (instance.client) {
            instance.client = new Groq({
                apiKey: activeKey,
                baseURL: instance.client.baseURL,
                maxRetries: instance.client.maxRetries,
                timeout: instance.client.timeout,
                fetch: instance.client.fetch
            });
        }
    }
}

ChatGroq.prototype._generate = async function (...args) {
    applyRotatedKey(this);
    return originalGenerate.apply(this, args);
};

ChatGroq.prototype._streamResponseChunks = async function* (...args) {
    applyRotatedKey(this);
    yield* originalStream.apply(this, args);
};
