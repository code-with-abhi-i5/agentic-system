import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { logger } from "../../utils/logger.js";

export const wikipediaTool = tool(
    async (args) => {
        try {
            logger.info(`📚 Searching Wikipedia for: ${args.query}`);
            const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(args.query)}`;
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'AntigravityAgent/1.0 (https://github.com)'
                }
            });
            
            const pages = response.data?.query?.pages;
            if (!pages || Object.keys(pages)[0] === "-1") {
                return `No Wikipedia article found for "${args.query}".`;
            }

            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId].extract;

            return `Wikipedia Extract for "${args.query}":\n\n${extract}`;
        } catch (error) {
            logger.error(`❌ Wikipedia Tool Error: ${error.message}`);
            return `Failed to fetch Wikipedia data: ${error.message}`;
        }
    },
    {
        name: "wikipedia_tool",
        description: "Searches Wikipedia for factual summaries of topics, people, or events. Extremely reliable for encyclopedic knowledge.",
        schema: z.object({
            query: z.string().describe("The topic to search for on Wikipedia (e.g., 'Alan Turing', 'Quantum computing').")
        })
    }
);
