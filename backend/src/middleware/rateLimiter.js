import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const createLimiter = ({
    windowMs,
    max,
    message,
    keyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
}) =>
    rateLimit({
        windowMs,
        max,

        standardHeaders: true,
        legacyHeaders: false,

        keyGenerator,

        skipSuccessfulRequests,
        skipFailedRequests,

        handler: (req, res) => {
            console.warn(
                `[Rate Limit] ${req.method} ${req.originalUrl} | IP: ${req.ip}`
            );

            res.status(429).json({
                success: false,
                code: "RATE_LIMIT_EXCEEDED",
                message,
            });
        },
    });

export const loginLimiter =
    createLimiter({
        windowMs: 15 * 60 * 1000,
        max: 5,
        skipSuccessfulRequests: true,
        message:
            "Too many login attempts. Please try again in 15 minutes.",
    });

export const registerLimiter =
    createLimiter({
        windowMs: 60 * 60 * 1000,
        max: 5,
        message:
            "Too many registration attempts. Please try again later.",
    });

export const otpLimiter =
    createLimiter({
        windowMs: 60 * 1000,
        max: 3,
        message:
            "Too many OTP requests. Please wait one minute.",
    });

export const chatLimiter =
    createLimiter({
        windowMs: 60 * 1000,
        max: 20,

        keyGenerator: (req) =>
            req.user?.userId || req.ip,

        skipFailedRequests: true,

        message:
            "You're sending messages too quickly.",
    });

export const conversationLimiter =
    createLimiter({
        windowMs: 60 * 1000,
        max: 100,

        keyGenerator: (req) =>
            req.user?.userId || req.ip,

        message:
            "Too many conversation requests.",
    });