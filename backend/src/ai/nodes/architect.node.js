import { z } from "zod";
import { plannerPrompt, routerPrompt } from "../prompts/architect.prompt.js";
import { AVAILABLE_TOOL_NAMES, TOOL_CATALOG } from "../tools/catalog.js";
import { gpt20b } from "../models/gpt-20b.js";
import { gpt120b } from "../models/gpt-120b.js";
import { logger } from "../../utils/logger.js";
import { retryWithRateLimit } from "../../utils/retryWithRateLimit.js";

// ==========================================
// 1. YOUR EXACT SCHEMAS (With the Empty Array Fix)
// ==========================================
const MetadataSchema = z.object({

    id: z.string().describe("A unique programmatic identifier for this execution plan run."),
    version: z.string().describe("Semantic versioning string for this blueprint blueprint layout."),
    generatedFrom: z.string().describe("Always output exactly the string 'Intent Object'."),
    complexity: z.string().describe("Must be exactly one of: LOW, MEDIUM, HIGH, VERY_HIGH")

});



const ExecutionSchema = z.object({

    entryTask: z.string().describe("The exact name/id of the first task inside the tasks array to execute."),
    allowParallel: z.boolean().describe("Flag specifying if tasks with met dependencies can run concurrently."),
    allowLoops: z.boolean().describe("Flag detailing if cycle edges or re-evaluation nodes are permitted."),
    maxRetries: z.number().int().min(0).describe("Maximum retry allowance for any single task execution node."),
    maxTasks: z.number().int().positive().describe("Hard ceiling for absolute total steps allowed in the runtime pipeline.")

});



const TaskSchema = z.object({

    id: z.string().describe("The unique semantic name of the agent in snake_case. IMPORTANT: Always name tasks as Professional Agent Roles (e.g. 'research_specialist', 'code_architect'), NOT verbs (e.g. do NOT use 'generate_code' or 'do_research'). This acts as the key for your graph edges."),
    name: z.string().describe("Human-readable formal name of the agent's role (e.g. 'Research Specialist', 'Itinerary Generator'). DO NOT use verbs."),
    objective: z.string().describe("Strict, clear instruction of WHAT this agent must achieve, omitting technical runtime implementation details."),
    rationale: z.string().describe("Architectural justification detailing why this task is critical to the top-level goal."),
    requiredTools: z.array(z.enum(AVAILABLE_TOOL_NAMES.length > 0 ? AVAILABLE_TOOL_NAMES : ["NONE"])).describe("The exact, literal names of the system tools this agent requires to execute its objective. Must be selected ONLY from the provided system menu."),
    dependencies: z.array(z.string()).describe("Array of task name strings that must complete before this agent can be executed."),
    expectedInput: z.array(z.string()).describe("Keys or variables expected to be present in the state channel when this task fires."),
    expectedOutput: z.array(z.string()).describe("Keys or state mutations this agent is expected to merge back into the global runtime context upon completion."),
    successCriteria: z.array(z.string()).describe("Quantifiable assertions used by validation layers to confirm the task's output is structurally sound.")

});



const EdgeSchema = z.object({

    from: z.string().describe("The exact name/id string of the originating source task node, or 'START' if it is the entry edge."),
    to: z.string().describe("The exact name/id string of the target destination task node, or 'END' if this path completes the workflow graph."),
    condition: z.string().describe("Must be exactly one of: ALWAYS, SUCCESS, FAILURE")
});



const ConstraintSchema = z.object({

    requiresVerification: z.boolean().describe("Mandates that outputs must pass a validation check node before executing target edges."),
    allowParallel: z.boolean().describe("Global workflow toggle determining whether independent graph branches can run simultaneously."),
    requiresHumanApproval: z.boolean().describe("Halts state execution to await physical operator approval before moving past critical state mutations.")

});



const OutputSchema = z.object({

    artifact: z.string().describe("Detailed description of the final delivered component or engine build."),
    format: z.string().describe("The concrete structure or format of the output deliverable (e.g., 'Express Project Structure', 'JSON configuration').")

});

// ==========================================
// 2. THE SPLIT (Grouping your schemas)
// ==========================================
const PlannerSchema = z.object({
    metadata: MetadataSchema,
    execution: ExecutionSchema,
    tasks: z.array(TaskSchema).describe("Limit to a maximum of 7 critical tasks to ensure stability.")
}).passthrough()

const RouterSchema = z.object({
    edges: z.array(EdgeSchema).describe("The routing topology connecting your agents. MUST form a valid graph."),
});


// ==========================================
// 3. THE NODE EXECUTION
// ==========================================
const plannerModel = gpt20b.withStructuredOutput(PlannerSchema, { name: "generate_tasks" });
const routerModel = gpt120b.withStructuredOutput(RouterSchema, { name: "generate_routes" });


export const architectNode = async (state, config) => {

    logger.info("📐 Meta-Architect [Part 1]: Generating tasks...");

    const plannerResult = await retryWithRateLimit(() => plannerModel.invoke([
        {
            role: "system",
            content: plannerPrompt
        },
        {
            role: "user",
            content: JSON.stringify({
                intent: state.intent,
                clarification: state.clarification || null,
            }, null, 2)
        }
    ]), config);

    logger.info("🔗 Meta-Architect [Part 2]: Routing edges...");

    const routerResult = await retryWithRateLimit(() => routerModel.invoke([
        {
            role: "system",
            content: routerPrompt
        },
        {
            role: "user",
            content: JSON.stringify({
                intent: state.intent,
                tasks_generated_in_phase_1: plannerResult.tasks
            }, null, 2)
        }
    ]), config);

    // Merge the two halves back into the single Blueprint structure!
    const blueprint = {
        ...plannerResult,
        ...routerResult
    };

    return {
        blueprint
    };
};