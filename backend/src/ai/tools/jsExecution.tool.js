import { tool } from "@langchain/core/tools";
import { z } from "zod";
import vm from "vm";
import { logger } from "../../utils/logger.js";

export const jsExecutionTool = tool(
    async (args) => {
        try {
            logger.info(`⚡ Executing JS Code: \n${args.code}`);
            
            // Create a safe sandbox environment
            const sandbox = {
                console: {
                    log: (...logs) => { sandbox.output.push(logs.join(' ')); },
                    error: (...logs) => { sandbox.output.push('ERROR: ' + logs.join(' ')); }
                },
                output: []
            };

            const context = vm.createContext(sandbox);
            
            // Execute the code in the sandbox
            // We expect the code to return a value, or we use the console output
            const script = new vm.Script(`
                (function() {
                    ${args.code}
                })();
            `);
            
            const result = script.runInContext(context, { timeout: 3000 }); // 3 second timeout

            const logs = sandbox.output.join('\n');
            
            let finalOutput = "";
            if (logs) finalOutput += `Logs:\n${logs}\n\n`;
            if (result !== undefined) finalOutput += `Result:\n${JSON.stringify(result, null, 2)}`;
            
            if (!finalOutput) return "Code executed successfully but returned undefined and logged nothing.";
            
            return finalOutput.trim();

        } catch (error) {
            logger.error(`❌ JS Execution Error: ${error.message}`);
            return `Failed to execute JavaScript: ${error.message}`;
        }
    },
    {
        name: "js_execution_tool",
        description: "Executes isolated JavaScript code in a secure Node.js VM sandbox. Perfect for complex data filtering, sorting, or string manipulation that LLMs struggle with. MUST return a value or use console.log.",
        schema: z.object({
            code: z.string().describe("The JavaScript code to execute. Do not include markdown code blocks (```javascript). The code will be wrapped in an IIFE. Ensure you return a value or use console.log.")
        })
    }
);
