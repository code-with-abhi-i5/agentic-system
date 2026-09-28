import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../../utils/logger.js";

export const chartGeneratorTool = tool(
    async (args) => {
        try {
            logger.info(`📊 Generating Chart: ${args.title} (${args.type})`);
            
            // Build the Chart.js config object
            const chartConfig = {
                type: args.type,
                data: {
                    labels: args.labels,
                    datasets: [{
                        label: args.title,
                        data: args.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: args.title
                    }
                }
            };

            const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
            const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}`;

            // Return a markdown image tag so the chat UI will render it directly!
            return `Here is your generated chart:\n\n![${args.title}](${chartUrl})`;

        } catch (error) {
            logger.error(`❌ Chart Generator Error: ${error.message}`);
            return `Failed to generate chart: ${error.message}`;
        }
    },
    {
        name: "chart_generator_tool",
        description: "Generates a beautiful data visualization chart (bar, line, pie, etc.) and returns a Markdown image link that renders in the UI.",
        schema: z.object({
            title: z.string().describe("The title of the chart."),
            type: z.enum(["bar", "line", "pie", "doughnut", "radar"]).describe("The type of chart to generate."),
            labels: z.array(z.string()).describe("An array of strings representing the X-axis labels (e.g., ['Jan', 'Feb', 'Mar'])."),
            data: z.array(z.number()).describe("An array of numbers representing the Y-axis data points corresponding to the labels.")
        })
    }
);
