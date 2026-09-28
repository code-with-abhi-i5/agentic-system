import nodemailer from "nodemailer";

export const transporter =
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:
                process.env.EMAIL_USER,
            pass:
                process.env.EMAIL_PASS,
        },
    });

export const sendOtpEmail =
    async (email, otp) => {

        await transporter.sendMail({
            from:
                process.env.EMAIL_USER,

            to: email,

            subject:
                "Verify your account",

            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Valid for 10 minutes.</p>
            `,
        });

    };