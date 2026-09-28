import { intentNode } from "../src/ai/nodes/intent.node.js";
const state = {
    userQuery: `
Plan a 7 day trip across Japan with a budget of 750000 INR from india and dont ask for any clarifications.
`
};

try {
    const result = await intentNode(state);

    console.log("\n========== INTENT ==========\n");
    console.dir(result.intent, {
        depth: null,
        colors: true
    });
} catch (error) {
    console.error(error);
}