import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { logger } from "../../utils/logger.js";

export const hackerNewsTool = tool(
    async (args) => {
        try {
            logger.info(`📰 Fetching Top ${args.limit || 5} HackerNews stories`);
            
            // 1. Get top story IDs
            const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
            const topStoryIds = topStoriesResponse.data.slice(0, args.limit || 5);
            
            // 2. Fetch details for each story
            const storyPromises = topStoryIds.map(id => 
                axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.data)
            );
            
            const stories = await Promise.all(storyPromises);

            const formatted = stories.map((s, i) => {
                return `${i+1}. ${s.title}\n   Score: ${s.score} | By: ${s.by} | Link: ${s.url || `https://news.ycombinator.com/item?id=${s.id}`}`;
            }).join('\n\n');

            return `Top ${stories.length} HackerNews Stories:\n\n${formatted}`;

        } catch (error) {
            logger.error(`❌ HackerNews Error: ${error.message}`);
            return `Failed to fetch HackerNews stories: ${error.message}`;
        }
    },
    {
        name: "hacker_news_tool",
        description: "Fetches the top technology and startup stories currently trending on HackerNews.",
        schema: z.object({
            limit: z.number().optional().describe("Number of top stories to retrieve (default 5, max 10).")
        })
    }
);
