import { tool } from "@langchain/core/tools";
import { z } from "zod";
import * as math from "mathjs";
import { logger } from "../../utils/logger.js";

export const calculatorTool = tool(
    async (args) => {
        try {
            logger.info(`🧮 Calculating: ${args.expression}`);
            const result = math.evaluate(args.expression);
            return `Result: ${result}`;
        } catch (error) {
            logger.error(`❌ Calculator Error: ${error.message}`);
            return `Error evaluating expression: ${error.message}. Please provide a valid mathematical expression (e.g., "45 * 3", "sqrt(16)").`;
        }
    },
    {
        name: "calculator_tool",
        description: "Evaluates mathematical expressions deterministically. Use this tool whenever you need to perform math, as LLMs can hallucinate arithmetic.",
        schema: z.object({
            expression: z.string().describe("The mathematical expression to evaluate (e.g., '14 * 3.5' or '100 / 3').")
        })
    }
);
