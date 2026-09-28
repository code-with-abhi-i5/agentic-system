import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { logger } from "../../utils/logger.js";

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
};

export const weatherTool = tool(
    async (args) => {
        try {
            logger.info(`⛅ Fetching weather for: ${args.location}`);
            
            // 1. Geocode location
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(args.location)}&count=1&language=en&format=json`;
            const geoResponse = await axios.get(geoUrl);
            
            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                return `Could not find coordinates for location: ${args.location}`;
            }

            const { latitude, longitude, name, country } = geoResponse.data.results[0];

            // 2. Fetch weather
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`;
            const weatherResponse = await axios.get(weatherUrl);
            const current = weatherResponse.data.current;

            const condition = weatherCodes[current.weather_code] || "Unknown";

            return `Current Weather in ${name}, ${country}:
- Temperature: ${current.temperature_2m}°C
- Condition: ${condition}
- Wind Speed: ${current.wind_speed_10m} km/h`;

        } catch (error) {
            logger.error(`❌ Weather Tool Error: ${error.message}`);
            return `Failed to fetch weather data: ${error.message}`;
        }
    },
    {
        name: "weather_tool",
        description: "Fetches current weather conditions (temperature, condition, wind) for any city or location.",
        schema: z.object({
            location: z.string().describe("The name of the city or location (e.g., 'London', 'New York', 'Tokyo').")
        })
    }
);
