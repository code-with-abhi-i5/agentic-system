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
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

app.use("/api", routes);

export default app