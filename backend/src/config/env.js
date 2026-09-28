import dotenv from "dotenv";

dotenv.config();

const extractGroqKeys = () => {
    const keys = [];
    for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith("GROQ_API_KEY") && value) {
            keys.push(value);
        }
    }
    return keys;
};

export const env = {
    PORT: process.env.PORT || 5000,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_API_KEYS: extractGroqKeys(),
    MONGO_URI: process.env.MONGO_URI,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
};
