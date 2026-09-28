import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../../utils/logger.js";

export const imageGeneratorTool = tool(
    async (args) => {
        try {
            logger.info(`🖼️ Generating Image: ${args.prompt}`);

            // Pollinations.ai provides a completely free, GET-based image generation API
            // We just need to URL encode the prompt
            const encodedPrompt = encodeURIComponent(args.prompt);
            
            // Add a seed if provided to make it deterministic, or a random string to avoid caching
            const seed = args.seed || Math.floor(Math.random() * 1000000);
            
            // Construct the final URL
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;

            // Return as a markdown image so it renders in the chat UI
            return `Here is your generated image:\n\n![${args.prompt}](${imageUrl})`;

        } catch (error) {
            logger.error(`❌ Image Generator Error: ${error.message}`);
            return `Failed to generate image: ${error.message}`;
        }
    },
    {
        name: "image_generator_tool",
        description: "Generates high-quality AI images based on a descriptive text prompt. It returns a Markdown image link that will natively render in the chat UI.",
        schema: z.object({
            prompt: z.string().describe("A highly detailed visual description of the image to generate. Include style, lighting, and subjects (e.g., 'A cyberpunk city at night, neon lights, 4k resolution, photorealistic')."),
            seed: z.number().optional().describe("An optional random number seed. Use this if the user wants to recreate the exact same image style.")
        })
    }
);
