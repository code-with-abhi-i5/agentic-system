import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const llama86m = new ChatGroq({
    model: "meta-llama/llama-prompt-guard-2-86m",
    temperature: 0,
    apiKey: env.GROQ_API_KEY
})