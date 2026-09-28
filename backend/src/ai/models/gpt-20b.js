import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const gpt20b = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
    maxTokens: 8192,
    apiKey: env.GROQ_API_KEY
})