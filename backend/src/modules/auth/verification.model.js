import mongoose from "mongoose";

const verificationSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
            },

            passwordHash: {
                type: String,
                required: true,
            },

            otpHash: {
                type: String,
                required: true,
            },

            expiresAt: {
                type: Date,
                required: true,
                expires: 0,
            },
            
            lastOtpSentAt: {
                type: Date,
                default: Date.now,
            },
        },
        {
            timestamps: true,
        }
    );

export default mongoose.model(
    "Verification",
    verificationSchema
);