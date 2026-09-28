import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const llama22m = new ChatGroq({
    model: "meta-llama/llama-prompt-guard-2-22m",
    temperature: 0,
    apiKey: env.GROQ_API_KEY
})