import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";

const app = express();

if (env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(requestLogger);
app.use(cookieParser());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
            const normalizedOrigin = origin.replace(/\/$/, "");
            
            if (
                !process.env.CLIENT_URL ||
                normalizedOrigin === clientUrl ||
                normalizedOrigin === "http://localhost:5173" ||
                normalizedOrigin === "http://localhost:3000" ||
                origin.endsWith(".vercel.app") ||
                process.env.NODE_ENV !== "production"
            ) {
                return callback(null, true);
            }
            return callback(new Error(`CORS policy does not allow access from ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json());

app.use("/api", routes);

export default app