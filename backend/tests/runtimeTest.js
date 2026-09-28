import "dotenv/config";
import { runtimeNode } from "../src/ai/nodes/runtime.node.js";

const parentGraphState = {
    userQuery: `Plan a 7 day trip across Japan with a budget of 750000 INR from india and dont ask for any clarifications.`,
    specifications: [
        {
            "taskId": "trip_parameters_extraction",
            "persona": "Travel Planner",
            "role": "Trip Parameters Extractor",
            "systemPrompt": "Objective:\nExtract and clarify trip parameters such as travel dates, preferred cities or regions, accommodation preferences, transportation preferences, activity preferences, and meal preferences.\n\nInputs:\n- intent\n\nOutputs:\n- tripParameters\n\nRules:\n- Only solve this task.\n- Never solve downstream tasks.\n- Never modify the provided inputs.\n- Use tools only if required.\n- Never fabricate external information.\n- If tools are available, use them whenever they improve factual accuracy.\n- Think step-by-step internally.\n- Return ONLY the requested outputs.\n\nCRITICAL OUTPUT CONTRACT:\n\nReturn ONLY valid JSON.\n\nThe JSON MUST contain EXACTLY the output fields listed in the Outputs section.\n\nEvery required output MUST exist.\n\nDo NOT rename keys.\n\nDo NOT omit keys.\n\nDo NOT wrap outputs inside another object.\n\nDo NOT return markdown.\n\nDo NOT return explanations.\n\nDo NOT return natural language.\n\nReturn ONLY raw JSON.",
            "model": "gpt120b",
            "temperature": 0.2,
            "toolStrategy": "REQUIRED",
            "maxIterations": 5
        },
        {
            "taskId": "destination_research",
            "persona": "Travel Researcher",
            "role": "Destination Researcher",
            "systemPrompt": "Objective:\nResearch and suggest destinations in Japan based on the trip parameters.\n\nInputs:\n- tripParameters\n\nOutputs:\n- destinationOptions\n\nRules:\n- Only solve this task.\n- Never solve downstream tasks.\n- Never modify the provided inputs.\n- Use tools only if required.\n- Never fabricate external information.\n- If tools are available, use them whenever they improve factual accuracy.\n- Think step-by-step internally.\n- Return ONLY the requested outputs.\n\nCRITICAL OUTPUT CONTRACT:\n\nReturn ONLY valid JSON.\n\nThe JSON MUST contain EXACTLY the output fields listed in the Outputs section.\n\nEvery required output MUST exist.\n\nDo NOT rename keys.\n\nDo NOT omit keys.\n\nDo NOT wrap outputs inside another object.\n\nDo NOT return markdown.\n\nDo NOT return explanations.\n\nDo NOT return natural language.\n\nReturn ONLY raw JSON.",
            "model": "gpt120b",
            "temperature": 0.2,
            "toolStrategy": "REQUIRED",
            "maxIterations": 5
        },
        {
            "taskId": "transportation_planning",
            "persona": "Transportation Planner",
            "role": "Trip Planner",
            "systemPrompt": "Objective: Plan transportation between destinations in Japan.\n\nInputs:\n- destinationOptions\n- tripParameters\n\nOutputs:\n- transportationPlan\n\nRules:\n- Only solve this task.\n- Never solve downstream tasks.\n- Never modify the provided inputs.\n- Use tools only if required.\n- Never fabricate external information.\n- If tools are available, use them whenever they improve factual accuracy.\n- Think step-by-step internally.\n- Return ONLY the requested outputs.\n\nCRITICAL OUTPUT CONTRACT:\n\nReturn ONLY valid JSON.\n\nThe JSON MUST contain EXACTLY the output fields listed in the Outputs section.\n\nEvery required output MUST exist.\n\nDo NOT rename keys.\n\nDo NOT omit keys.\n\nDo NOT wrap outputs inside another object.\n\nDo NOT return markdown.\n\nDo NOT return explanations.\n\nDo NOT return natural language.\n\nReturn ONLY raw JSON.",
            "model": "gpt120b",
            "temperature": 0.2,
            "toolStrategy": "REQUIRED",
            "maxIterations": 5
        },
        {
            "taskId": "accommodation_planning",
            "persona": "Accommodation Planner",
            "role": "Trip Planner",
            "systemPrompt": "Objective:\nPlan accommodation for the trip based on the provided destination options and trip parameters.\n\nInputs:\n- destinationOptions\n- tripParameters\n\nOutputs:\n- accommodationPlan\n\nRules:\n- Only solve this task.\n- Never solve downstream tasks.\n- Never modify the provided inputs.\n- Use tools only if required.\n- Never fabricate external information.\n- If tools are available, use them whenever they improve factual accuracy.\n- Think step-by-step internally.\n- Return ONLY the requested outputs.\n\nCRITICAL OUTPUT CONTRACT:\nReturn ONLY valid JSON.\nThe JSON MUST contain EXACTLY the output fields listed in the Outputs section.\nEvery required output MUST exist.\nDo NOT rename keys.\nDo NOT omit keys.\nDo NOT wrap outputs inside another object.\nDo NOT return markdown.\nDo NOT return explanations.\nDo NOT return natural language.\nReturn ONLY raw JSON.",
            "model": "gpt120b",
            "temperature": 0.2,
            "toolStrategy": "REQUIRED",
            "maxIterations": 5
        },
        {
            "taskId": "activity_suggestions",
            "persona": "Travel Planner",
            "role": "Activity Suggestion Specialist",
            "systemPrompt": "Objective: Suggest activities and sightseeing options for the trip.\n\nInputs:\n- destinationOptions\n- tripParameters\n\nOutputs:\n- activitySuggestions\n\nRules:\n- Only solve this task.\n- Never solve downstream tasks.\n- Never modify the provided inputs.\n- Use tools only if required.\n- Never fabricate external information.\n- If tools are available, use them whenever they improve factual accuracy.\n- Think step-by-step internally.\n- Return ONLY the requested outputs.\n\nCRITICAL OUTPUT CONTRACT:\n\nReturn ONLY valid JSON.\n\nThe JSON MUST contain EXACTLY the output fields listed in the Outputs section.\n\nEvery required output MUST exist.\n\nDo NOT rename keys.\n\nDo NOT omit keys.\n\nDo NOT wrap outputs inside another object.\n\nDo NOT return markdown.\n\nDo NOT return explanations.\n\nDo NOT return natural language.\n\nReturn ONLY raw JSON.",
            "model": "gpt120b",
            "temperature": 0.2,
            "toolStrategy": "REQUIRED",
            "maxIterations": 5
        },
        {
            "taskId": "itinerary_generation",
            "persona": "Itinerary Planner",
            "role": "Trip Itinerary Generator",
            "systemPrompt": "Objective:\nGenerate a detailed day-by-day itinerary for the trip.\n\nInputs:\n- transportationPlan\n- accommodationPlan\n- activitySuggestions\n- tripParameters\n\nOutputs:\n- dayByDayItinerary\n\nRules:\n- Only solve this task.\n- Never solve downstream tasks.\n- Never modify the provided inputs.\n- Use tools only if required.\n- Never fabricate external information.\n- If tools are available, use them whenever they improve factual accuracy.\n- Think step-by-step internally.\n- Return ONLY the requested outputs.\n\nCRITICAL OUTPUT CONTRACT:\n\nReturn ONLY valid JSON.\n\nThe JSON MUST contain EXACTLY the output fields listed in the Outputs section.\n\nEvery required output MUST exist.\n\nDo NOT rename keys.\n\nDo NOT omit keys.\n\nDo NOT wrap outputs inside another object.\n\nDo NOT return markdown.\n\nDo NOT return explanations.\n\nDo NOT return natural language.\n\nReturn ONLY raw JSON.",
            "model": "gpt120b",
            "temperature": 0.2,
            "toolStrategy": "AUTO",
            "maxIterations": 5
        }
    ],
    blueprint: {
        "metadata": {
            "id": "japan_trip_planning",
            "version": "1.0",
            "generatedFrom": "Intent Object",
            "complexity": "MEDIUM"
        },
        "execution": {
            "entryTask": "trip_parameters_extraction",
            "allowParallel": true,
            "allowLoops": false,
            "maxRetries": 3,
            "maxTasks": 7
        },
        "tasks": [
            {
                "id": "trip_parameters_extraction",
                "name": "Extract Trip Parameters",
                "objective": "Extract and clarify trip parameters such as travel dates, preferred cities or regions, accommodation preferences, transportation preferences, activity preferences, and meal preferences.",
                "rationale": "This task is necessary to gather required information for planning a personalized trip.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [],
                "expectedInput": [
                    "intent"
                ],
                "expectedOutput": [
                    "tripParameters"
                ],
                "successCriteria": [
                    "tripParameters"
                ]
            },
            {
                "id": "destination_research",
                "name": "Research Destinations",
                "objective": "Research and suggest destinations in Japan based on the trip parameters.",
                "rationale": "This task is necessary to provide a list of potential destinations for the trip.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "trip_parameters_extraction"
                ],
                "expectedInput": [
                    "tripParameters"
                ],
                "expectedOutput": [
                    "destinationOptions"
                ],
                "successCriteria": [
                    "destinationOptions"
                ]
            },
            {
                "id": "transportation_planning",
                "name": "Plan Transportation",
                "objective": "Plan transportation between destinations in Japan.",
                "rationale": "This task is necessary to provide a transportation plan for the trip.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "destination_research"
                ],
                "expectedInput": [
                    "destinationOptions",
                    "tripParameters"
                ],
                "expectedOutput": [
                    "transportationPlan"
                ],
                "successCriteria": [
                    "transportationPlan"
                ]
            },
            {
                "id": "accommodation_planning",
                "name": "Plan Accommodation",
                "objective": "Plan accommodation for the trip.",
                "rationale": "This task is necessary to provide an accommodation plan for the trip.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "destination_research"
                ],
                "expectedInput": [
                    "destinationOptions",
                    "tripParameters"
                ],
                "expectedOutput": [
                    "accommodationPlan"
                ],
                "successCriteria": [
                    "accommodationPlan"
                ]
            },
            {
                "id": "activity_suggestions",
                "name": "Suggest Activities",
                "objective": "Suggest activities and sightseeing options for the trip.",
                "rationale": "This task is necessary to provide activity suggestions for the trip.",
                "requiredTools": [
                    "web_search_tool"
                ],
                "dependencies": [
                    "destination_research"
                ],
                "expectedInput": [
                    "destinationOptions",
                    "tripParameters"
                ],
                "expectedOutput": [
                    "activitySuggestions"
                ],
                "successCriteria": [
                    "activitySuggestions"
                ]
            },
            {
                "id": "itinerary_generation",
                "name": "Generate Itinerary",
                "objective": "Generate a detailed day-by-day itinerary for the trip.",
                "rationale": "This task is necessary to provide a comprehensive itinerary for the trip.",
                "requiredTools": [],
                "dependencies": [
                    "transportation_planning",
                    "accommodation_planning",
                    "activity_suggestions"
                ],
                "expectedInput": [
                    "transportationPlan",
                    "accommodationPlan",
                    "activitySuggestions",
                    "tripParameters"
                ],
                "expectedOutput": [
                    "dayByDayItinerary"
                ],
                "successCriteria": [
                    "dayByDayItinerary"
                ]
            }
        ],
        "edges": [
            {
                "from": "START",
                "to": "trip_parameters_extraction",
                "condition": "ALWAYS"
            },
            {
                "from": "trip_parameters_extraction",
                "to": "destination_research",
                "condition": "SUCCESS"
            },
            {
                "from": "destination_research",
                "to": "transportation_planning",
                "condition": "SUCCESS"
            },
            {
                "from": "destination_research",
                "to": "accommodation_planning",
                "condition": "SUCCESS"
            },
            {
                "from": "destination_research",
                "to": "activity_suggestions",
                "condition": "SUCCESS"
            },
            {
                "from": "transportation_planning",
                "to": "itinerary_generation",
                "condition": "SUCCESS"
            },
            {
                "from": "accommodation_planning",
                "to": "itinerary_generation",
                "condition": "SUCCESS"
            },
            {
                "from": "activity_suggestions",
                "to": "itinerary_generation",
                "condition": "SUCCESS"
            },
            {
                "from": "itinerary_generation",
                "to": "END",
                "condition": "SUCCESS"
            }
        ]
    },
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

async function runRuntimeNodeTest() {
    try {
        console.log("🚀 Launching Runtime Node Test...");

        const result = await runtimeNode(parentGraphState);

        console.log("\n========================================");
        console.log("🎉 Runtime Node Finished");
        console.log("========================================");

        console.dir(result.finalOutput, {
            depth: null
        });

    } catch (error) {
        console.error("\n❌ Runtime Node Failed");
        console.error(error);

        if (error.stack) {
            console.error(error.stack);
        }
    }
}

runRuntimeNodeTest();