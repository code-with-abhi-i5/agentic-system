import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { env } from "../../config/env.js";

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
    apiKey: env.GOOGLE_API_KEY
    // other params...
})

export default gemini;