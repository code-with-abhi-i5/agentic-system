import { agentSpecificationNode } from "./src/ai/nodes/agentSpecification.node.js";


// Truncated to exactly 3 tasks with re-wired edges for a valid test pass
const mockState = {
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
    }
};

const runTest = async () => {
    console.log(`[🚀] Firing up concurrent Agent Specification Generation...\n`);

    const startTime = performance.now();

    // Invoke the node directly with the mock state
    const result = await agentSpecificationNode(mockState);

    const endTime = performance.now();

    if (result.error) {
        console.error(`\n[❌] Execution Failed in ${(endTime - startTime).toFixed(2)}ms`);
        console.error(`Reason: ${result.error}\n\n${result.specifications}`);
        return;
    }

    console.log(`\n[✅] Generated ${result.specifications.length} Agent Specifications in ${(endTime - startTime).toFixed(2)}ms`);
    console.log("\n--- Compiled Agent Specifications ---");
    console.log(JSON.stringify(result.specifications, null, 2));
};

runTest();