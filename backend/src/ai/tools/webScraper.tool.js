import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { logger } from "../../utils/logger.js";

const turndownService = new TurndownService();

export const webScraperTool = tool(
    async (args) => {
        try {
            logger.info(`🌐 Scraping URL: ${args.url}`);
            const response = await axios.get(args.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });
            
            const html = response.data;
            const $ = cheerio.load(html);

            // Remove noisy elements
            $('script, style, noscript, iframe, img, svg, video, nav, footer, header').remove();

            const cleanHtml = $('body').html() || '';
            const markdown = turndownService.turndown(cleanHtml);

            // Truncate to avoid blowing up context window (roughly 15000 chars)
            const maxChars = 15000;
            if (markdown.length > maxChars) {
                return markdown.substring(0, maxChars) + "\n\n...[Content truncated due to length]...";
            }

            return markdown;
        } catch (error) {
            logger.error(`❌ Web Scraper Error: ${error.message}`);
            return `Failed to scrape URL: ${error.message}`;
        }
    },
    {
        name: "web_scraper_tool",
        description: "Fetches a webpage from a URL and returns its textual content as Markdown. Useful for deep reading of articles, documentation, or websites.",
        schema: z.object({
            url: z.string().url().describe("The full URL of the webpage to scrape.")
        })
    }
);
