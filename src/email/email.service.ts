import nodemailer from 'nodemailer';
// load environment variables from .env file
import 'dotenv/config';

// function to create and configure email transporter using Gmail
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials not found in environment variables");
    }

    // return nodemailer transport
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
};

// send a verification email with a code to the new user's email address
export const sendVerificationEmail = async (
    userEmail: string,
    userName: string,
    verificationCode: string
) => {
    const transporter = createTransporter(); // setup email transporter
    // send email using Nodemailer
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Verify Your Email - Medical Portal",
        html:`
            <h3>Hello ${userName},</h3>
            <p>Thank you for registering with our medical portal.</p>
            <p>Your email verification code is:</p>
            <h2>${verificationCode}</h2>
            <p>Please enter this code to verify your account and access the system.</p>
            <p>If you did not request this, please ignore this email.</p>
            <br/>
            <p>— The Medical Portal Team</p>
        `
    });
};

// send a welcome email to the new user
export const sendWelcomeEmail = async (to: string, name: string) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Welcome to Medical Portal",
        html: `
        <h3>Hello ${name},</h3>
        <p>Welcome to our medical patient portal.</p>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <br/>
        <p>— The Medical Portal Team</p>
        `
    });
}
        