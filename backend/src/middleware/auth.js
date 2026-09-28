import jwt from "jsonwebtoken";

export const authMiddleware = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                code: "UNAUTHORIZED",
                message: "Authorization token required",
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET
            );

        req.user = {
            userId:
                decoded.userId,
        };

        next();

    }
    catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Access token expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                code: "INVALID_TOKEN",
                message: "Invalid access token",
            });
        }

        return res.status(401).json({
            success: false,
            code: "AUTH_FAILED",
            message: "Authentication failed",
        });

    }
};