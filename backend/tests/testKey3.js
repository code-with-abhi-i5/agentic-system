import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { env } from "../src/config/env.js";

async function testKey() {
    const key = env.GROQ_API_KEYS[2];
    if (!key) {
        console.error("❌ Key 3 not found in environment variables.");
        return;
    }

    console.log("Testing Key 3 (Index 2)...");
    
    try {
        const model = new ChatGroq({
            apiKey: key,
            model: "openai/gpt-oss-20b",
            temperature: 0,
            maxRetries: 0
        });

        const response = await model.invoke("Say 'Key 3 works!'");
        console.log("✅ Success! Response:", response.content);
    } catch (error) {
        console.error("❌ Failed to use Key 3:", error.message);
    }
}

testKey();
