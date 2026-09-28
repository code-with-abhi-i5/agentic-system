import { z } from "zod";
import { intentPrompt } from "../prompts/intent.prompt.js";
import { gpt20b } from "../models/gpt-20b.js";
import { logger } from "../../utils/logger.js";
import { retryWithRateLimit } from "../../utils/retryWithRateLimit.js";

const IntentSchema = z.object({
    goal: z.string().describe("A concise, imperative summary of the core objective."),

    problemDomain: z.array(
        z.string()
    ).describe(
        "High-level domains the problem belongs to (e.g., 'Software Engineering', 'Finance', 'Healthcare', 'Machine Learning')."
    ),

    technologies: z.array(
        z.string()
    ).describe(
        "Explicit technologies, frameworks, languages, libraries, databases, or platforms mentioned by the user."
    ),

    features: z.array(
        z.string()
    ).describe(
        "Functional capabilities or system requirements requested by the user."
    ),

    intentCategory: z.enum([
        "CREATE",
        "MODIFY",
        "DEBUG",
        "ANALYZE",
        "PLAN",
        "EXPLAIN",
        "COMPARE",
        "RESEARCH",
        "SUMMARIZE",
        "OTHER"
    ]).describe(
        "The user's high-level intention regardless of the technical domain."
    ),

    taskType: z.enum([
        "CODE_GENERATION", "DEBUGGING", "ARCHITECTURE", "RESEARCH",
        "WRITING", "DATA_ANALYSIS", "PLANNING", "EXPLANATION", "OTHER"
    ]).describe("The primary operational classification of the request."),

    constraints: z.array(z.string()).describe("Explicit boundaries, budgets, tech stack limits, or formatting rules."),

    inputs: z.array(z.string()).describe("Explicit data, files, or parameters provided by the user to execute the task."),

    expectedOutput: z.string().describe("The exact deliverable format expected (e.g., 'JSON payload', 'Markdown essay', 'Python module')."),

    ambiguities: z.array(z.string()).describe("List of missing or unclear details."),

    complexity: z.object({

        reasoning: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
            "VERY_HIGH"
        ]),

        execution: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
            "VERY_HIGH"
        ]),

        overall: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
            "VERY_HIGH"
        ])

    }),

    confidence: z.object({
        goal: z.number().min(0).max(1),
        technologies: z.number().min(0).max(1),
        constraints: z.number().min(0).max(1),
        expectedOutput: z.number().min(0).max(1),
        taskType: z.number().min(0).max(1),
        overall: z.number().min(0).max(1),
        problemDomain: z.number().min(0).max(1),
        features: z.number().min(0).max(1),
        intentCategory: z.number().min(0).max(1),
        ambiguities: z.number().min(0).max(1).optional(),
        inputs: z.number().min(0).max(1).optional(),
        complexity: z.number().min(0).max(1).optional()
    }).describe(
        "Confidence scores for the extracted intent fields. Provide scores between 0.0 and 1.0 for these specific fields."
    )
})

const structuredModel =
    gpt20b.withStructuredOutput(IntentSchema);

export const intentNode = async (state, config) => {

    const intent = await retryWithRateLimit(() =>
        structuredModel.invoke([
            {
                role: "system",
                content: intentPrompt
            },
            {
                role: "user",
                content: state.userQuery
            }
        ]),
        config
    );

    return {
        intent,
        constraints: intent.constraints
    };
};