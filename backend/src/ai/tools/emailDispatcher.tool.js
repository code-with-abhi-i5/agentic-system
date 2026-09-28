import { tool } from "@langchain/core/tools";
import { z } from "zod";
import nodemailer from "nodemailer";
import { logger } from "../../utils/logger.js";
import { env } from "../../config/env.js";

export const emailDispatcherTool = tool(
    async (args) => {
        try {
            logger.info(`📧 Dispatching email to: ${args.to}`);

            // Ensure SMTP credentials exist in env
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                return `Error: SMTP credentials (EMAIL_USER, EMAIL_PASS) are missing from the environment variables. Cannot send real email.`;
            }

            // Create reusable transporter object using Gmail
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Send mail with defined transport object
            const info = await transporter.sendMail({
                from: `"Meta-Architect Agent" <${process.env.EMAIL_USER}>`, // sender address
                to: args.to, // list of receivers
                subject: args.subject, // Subject line
                text: args.body, // plain text body
                html: args.body.replace(/\n/g, '<br>'), // html body simple formatting
            });

            logger.info(`📧 Message sent: ${info.messageId}`);
            
            return `Email successfully sent to ${args.to}! Message ID: ${info.messageId}`;

        } catch (error) {
            logger.error(`❌ Email Dispatcher Error: ${error.message}`);
            return `Failed to send email: ${error.message}`;
        }
    },
    {
        name: "email_dispatcher_tool",
        description: "Sends a real email to the specified recipient using the backend's SMTP configuration. Use this when the user asks you to email someone or send a notification.",
        schema: z.object({
            to: z.string().email().describe("The email address of the recipient."),
            subject: z.string().describe("The subject line of the email."),
            body: z.string().describe("The main body content of the email.")
        })
    }
);
