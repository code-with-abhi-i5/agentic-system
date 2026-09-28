
import { gpt120b } from "./gpt-120b.js";
import { gpt20b } from "./gpt-20b.js";
import { gptSafeguard } from "./gpt-safeguard.js";
import { qwen27b } from "./qwen27b.js";

export const MODEL_REGISTRY = {

    gpt120b,
    gpt20b,
    gptSafeguard,
    qwen27b
};