import "dotenv/config";
import { testGraph } from "../src/ai/graphs/test.graph.js";
import { logger } from "../src/utils/logger.js";

const initialState = {
  userQuery: "Plan a 7-day trip to Japan from India with a budget of ₹1,50,000 for two people. Research destinations, transportation, accommodation, activities, and create a final itinerary.",
};

const result = await testGraph.invoke(initialState);

logger.info("Workflow execution complete.");
logger.debug("Final output:", result);

// "Write a python script to scrape news headlines from a public RSS feed",
// "Give me a detailed 3-day workout plan for a beginner",
// "Explain the theory of relativity to a 5 year old"