import "dotenv/config"; // Or your dotenvx setup
import { architectNode } from "../src/ai/nodes/architect.node.js";

async function testArchitect() {
    console.log("📐 Initializing Meta-Architect Node...");
    console.log("🧠 Architect is designing the workflow (this may take a few seconds)...");

    // 1. Mock the state using the exact Intent payload
    const mockState = {
        intent: {
            goal: 'Plan a 7 day trip across Japan with a budget of 750000 INR from India',
            problemDomain: ['Travel Planning', 'Tourism'],
            technologies: [],
            features: [
                '7-day itinerary',
                'budget constraint',
                'travel from India',
                'accommodation planning',
                'transportation planning',
                'activity suggestions'
            ],
            intentCategory: 'PLAN',
            taskType: 'PLANNING',
            constraints: ['Budget: 750000 INR', 'Duration: 7 days', 'Origin: India'],
            inputs: [],
            expectedOutput: 'Detailed day-by-day itinerary in JSON format',
            ambiguities: [
                'Preferred travel dates',
                'Preferred cities or regions',
                'Accommodation preferences',
                'Transportation preferences',
                'Activity preferences',
                'Meal preferences',
                'Currency conversion details'
            ],
            requiresClarification: false,
            complexity: { reasoning: 'MEDIUM', execution: 'MEDIUM', overall: 'MEDIUM' },
            confidence: {
                goal: 0.95,
                technologies: 0.2,
                constraints: 0.9,
                expectedOutput: 0.8,
                taskType: 0.95,
                overall: 0.9
            }
        }

    };

    try {
        // 2. Execute the node
        const result = await architectNode(mockState);

        // 3. Output the structured JSON Blueprint
        console.log("\n========== BLUEPRINT OUTPUT ==========\n");
        console.log(JSON.stringify(result.blueprint, null, 2));
        console.log("\n======================================\n");

        if (result.error) {
            console.error("⚠️ Node reported a graceful error state:", result.error);
        }

    } catch (error) {
        console.error("❌ Architect Node threw a fatal error:", error);
    }
}

testArchitect();