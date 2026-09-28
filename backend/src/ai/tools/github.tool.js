import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { logger } from "../../utils/logger.js";

export const githubTool = tool(
    async (args) => {
        try {
            logger.info(`🐙 Fetching GitHub data for: ${args.owner}/${args.repo} [${args.action}]`);
            
            const baseUrl = `https://api.github.com/repos/${args.owner}/${args.repo}`;
            const headers = { 'User-Agent': 'AntigravityAgent/1.0' };

            if (args.action === "info") {
                const response = await axios.get(baseUrl, { headers });
                const d = response.data;
                return `Repo: ${d.full_name}\nDescription: ${d.description}\nStars: ${d.stargazers_count}\nForks: ${d.forks_count}\nLanguage: ${d.language}\nOpen Issues: ${d.open_issues_count}`;
            } 
            else if (args.action === "readme") {
                const response = await axios.get(`${baseUrl}/readme`, { headers });
                // GitHub returns base64 encoded readme
                const decoded = Buffer.from(response.data.content, 'base64').toString('utf-8');
                return decoded.length > 10000 ? decoded.substring(0, 10000) + "\n...[Truncated]" : decoded;
            }
            else if (args.action === "commits") {
                const response = await axios.get(`${baseUrl}/commits?per_page=5`, { headers });
                return response.data.map((c, i) => `${i+1}. [${c.sha.substring(0, 7)}] ${c.commit.message.split('\n')[0]} - ${c.commit.author.name}`).join('\n');
            }
            
            return `Unknown action: ${args.action}. Supported actions are "info", "readme", "commits".`;

        } catch (error) {
            logger.error(`❌ GitHub Tool Error: ${error.message}`);
            return `Failed to fetch GitHub data. Make sure the repository is public and spelled correctly. Error: ${error.message}`;
        }
    },
    {
        name: "github_tool",
        description: "Fetches information, README files, or recent commits from public GitHub repositories.",
        schema: z.object({
            owner: z.string().describe("The owner or organization of the repository (e.g., 'facebook')."),
            repo: z.string().describe("The name of the repository (e.g., 'react')."),
            action: z.enum(["info", "readme", "commits"]).describe("What information to retrieve.")
        })
    }
);
