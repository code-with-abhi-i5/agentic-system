import { ChatGroq } from "@langchain/groq"
import { env } from "../../config/env.js"

export const allam = new ChatGroq({
    model: "allam-2-7b",
    temperature: 0,
    apiKey: env.GROQ_API_KEY
})