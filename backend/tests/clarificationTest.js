import "dotenv/config"; // Or your dotenvx setup
import { clarificationNode } from "./src/ai/nodes/clarification.node.js";

async function testClarification() {
    console.log("⏳ Initializing Clarification Node...");

    // 1. Mock the state using the exact Intent output you provided
    const mockState = {
        intent: {
            goal: 'Analyze e-commerce sales data and produce insights, forecast, charts, and a business report',
            problemDomain: ['Business Analytics', 'Data Analysis'],
            technologies: ['CSV', 'Statistical methods', 'Charting'],
            features: [
                'trend analysis',
                'anomaly detection',
                'seasonality detection',
                'high-performing category identification',
                'forecasting',
                'chart generation',
                'business report'
            ],
            intentCategory: 'ANALYZE',
            taskType: 'DATA_ANALYSIS',
            constraints: [],
            inputs: ['CSV file containing five years of e-commerce sales'],
            expectedOutput: 'Business report with charts and forecast for next quarter',
            ambiguities: [
                'Specific statistical methods to use for forecasting',
                'Preferred chart types',
                'Format of the business report (e.g., PDF, Markdown)'
            ],
            requiresClarification: true,
            complexity: { reasoning: 'HIGH', execution: 'HIGH', overall: 'HIGH' },
            confidence: {
                goal: 0.95,
                technologies: 0.9,
                constraints: 0.8,
                expectedOutput: 0.9,
                taskType: 0.95,
                overall: 0.95
            }
        }
    };

    try {
        // 2. Execute the node
        const result = await clarificationNode(mockState);

        // 3. Output the beautifully structured JSON
        console.log("\n========== CLARIFICATION OUTPUT ==========\n");
        console.log(JSON.stringify(result.clarification, null, 2));
        console.log("\n==========================================\n");

    } catch (error) {
        console.error("❌ Clarification Node Failed:", error);
    }
}

testClarification();