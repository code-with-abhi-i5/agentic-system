import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Conversation from "../../modules/conversation/conversation.model.js";
import { logger } from "../../utils/logger.js";
import mongoose from "mongoose";

export const databaseAnalyticsTool = tool(
    async (args) => {
        try {
            logger.info(`📊 Running Advanced Database Query on collection: ${args.collection}`);
            
            // Ensure DB is connected
            if (mongoose.connection.readyState !== 1) {
                return "Database is not currently connected.";
            }

            const db = mongoose.connection.db;
            const collection = db.collection(args.collection);
            
            let queryObj = {};
            if (args.query) {
                try {
                    queryObj = JSON.parse(args.query);
                } catch (e) {
                    return `Error parsing query JSON: ${e.message}. Ensure it is a valid JSON string.`;
                }
            }

            if (args.operation === "count") {
                const count = await collection.countDocuments(queryObj);
                return `Total count in '${args.collection}' matching query: ${count}`;
            } 
            
            if (args.operation === "aggregate") {
                if (!Array.isArray(queryObj)) {
                    return `Error: For aggregate operations, 'query' must be a valid JSON array string representing the pipeline.`;
                }
                const results = await collection.aggregate(queryObj).toArray();
                return JSON.stringify(results, null, 2);
            }

            if (args.operation === "find") {
                let cursor = collection.find(queryObj);
                
                if (args.sort) {
                    try {
                        const sortObj = JSON.parse(args.sort);
                        cursor = cursor.sort(sortObj);
                    } catch (e) {
                        return `Error parsing sort JSON: ${e.message}`;
                    }
                }
                
                const limit = args.limit || 10;
                // Hard cap limit to prevent massive payload issues
                const safeLimit = Math.min(limit, 50); 
                
                const results = await cursor.limit(safeLimit).toArray();
                
                if (results.length === 0) return `No documents found in '${args.collection}' matching the query.`;
                
                return JSON.stringify(results, null, 2);
            }
            
            return `Unknown operation: ${args.operation}. Supported operations are "find", "count", and "aggregate".`;

        } catch (error) {
            logger.error(`❌ Database Analytics Error: ${error.message}`);
            return `Failed to execute database query: ${error.message}`;
        }
    },
    {
        name: "database_analytics_tool",
        description: "Advanced tool for executing read-only MongoDB queries directly against the application's database (collections: 'conversations', 'messages', 'users', etc.). Use this to inspect application data.",
        schema: z.object({
            collection: z.string().describe("The exact name of the MongoDB collection to query (e.g., 'conversations', 'messages', 'users')."),
            operation: z.enum(["find", "count", "aggregate"]).describe("The read operation to perform."),
            query: z.string().optional().describe("A valid JSON string representing the query filter (for 'find'/'count') or the pipeline array (for 'aggregate'). Example: '{\"role\":\"user\"}' or '[{\"$group\": {\"_id\": \"$role\", \"count\": {\"$sum\": 1}}}]'"),
            sort: z.string().optional().describe("A valid JSON string for sorting results. Example: '{\"createdAt\": -1}'"),
            limit: z.number().int().positive().optional().describe("Max number of documents to return (max 50, default 10).")
        })
    }
);
