import "dotenv/config";
import { env } from "../src/config/env.js";

async function listModels() {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": "Bearer " + env.GROQ_API_KEYS[0] }
    });
    const data = await res.json();
    console.log(data);
}
listModels();
