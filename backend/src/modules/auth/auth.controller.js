import {
    refreshAccessToken,
    logoutUser,
    registerUser,
    loginUser,
    getCurrentUser,
} from "./auth.service.js";
import { sendRegistrationOtp } from "./auth.service.js";

export const register = async (
    req,
    res
) => {
    try {

        const result =
            await registerUser(
                req.body
            );

        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge:
                    7 * 24 * 60 * 60 * 1000,
            }
        );

        res.status(201).json({
            success: true,
            data: {
                accessToken:
                    result.accessToken,

                user:
                    result.user,
            },
        });

    }
    catch (error) {

        console.error(
            "\nerror in controller\n"
        );

        res.status(400).json({
            success: false,
            message:
                error.message,
        });

    }
};

export const login = async (
    req,
    res
) => {
    try {
        const result =
            await loginUser(req.body);

        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge:
                    7 * 24 * 60 * 60 * 1000,
            }
        );

        res.status(200).json({
            success: true,
            data: {
                accessToken:
                    result.accessToken,

                user:
                    result.user,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
export const refresh = async (
    req,
    res
) => {
    console.log("\nrefresh called\n")

    try {

        const refreshToken =
            req.cookies.refreshToken;

        const data =
            await refreshAccessToken(
                refreshToken
            );

        res.cookie(
            "refreshToken",
            data.refreshToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge:
                    7 * 24 * 60 * 60 * 1000,
            }
        );

        res.status(200).json({
            success: true,
            data: {
                accessToken:
                    data.accessToken,
            },
        });

    }
    catch (error) {

        res.clearCookie("refreshToken");

        res.status(401).json({
            success: false,
            message: error.message,
        });

    }

};

export const logout = async (
    req,
    res
) => {
    try {

        const data =
            await logoutUser(
                req.user.userId
            );

        res.clearCookie(
            "refreshToken"
        );

        res.status(200).json({
            success: true,
            data,
        });

    }
    catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message,
        });

    }
};
export const me = async (
    req,
    res
) => {

    try {

        const user =
            await getCurrentUser(
                req.user.userId
            );

        res.status(200).json({
            success: true,
            data: user,
        });

    }
    catch (error) {

        res.status(404).json({
            success: false,
            message:
                error.message,
        });

    }
};
export const sendOtp = async (
    req,
    res
) => {
    try {

        const result =
            await sendRegistrationOtp(
                req.body
            );

        res.status(200).json({
            success: true,
            data: result,
        });

    }
    catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message,
        });

    }
};

export const resendOtp =
    async (req, res) => {
        try {

            const result =
                await sendRegistrationOtp(
                    req.body
                );

            res.status(200).json({
                success: true,
                data: result,
            });

        }
        catch (error) {

            res.status(400).json({
                success: false,
                message:
                    error.message,
            });

        }
    };