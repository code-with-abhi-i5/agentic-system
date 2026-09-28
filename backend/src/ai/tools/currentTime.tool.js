import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../../utils/logger.js";

export const currentTimeTool = tool(
    async (args) => {
        try {
            logger.info(`⏰ Fetching current time for timezone: ${args.timezone || 'UTC'}`);
            const date = new Date();
            
            // If timezone provided, format it. Otherwise UTC
            if (args.timezone) {
                return date.toLocaleString('en-US', { timeZone: args.timezone });
            }
            
            return `Current UTC Time: ${date.toISOString()}`;
        } catch (error) {
            logger.error(`❌ Current Time Error: ${error.message}`);
            return `Failed to fetch time: ${error.message}`;
        }
    },
    {
        name: "current_time_tool",
        description: "Returns the current exact time and date. Useful when asked about 'today', 'now', or temporal queries.",
        schema: z.object({
            timezone: z.string().optional().describe("Optional IANA timezone string, e.g., 'America/New_York' or 'Europe/London'. Defaults to UTC.")
        })
    }
);
