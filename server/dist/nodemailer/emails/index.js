"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSetPasswordSuccessEmail = exports.sendContactEmail = exports.sendResetSuccessEmail = exports.sendPasswordResetEmail = exports.setPasswordRequestEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = require("../email-templates");
const DOMAIN_EMAIL = process.env.EMAIL_USER;
const DOMAIN_FULL_EMAIL = `Identity Impact Hub <${process.env.EMAIL_USER}>`;
// Configure the transporter with environment variables
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587, // Default to 587 if not specified
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
/**
 * Reusable function to send emails.
 * Accepts an object containing email parameters.
 */
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, text, html, from = DOMAIN_FULL_EMAIL, }) {
    console.log(DOMAIN_EMAIL);
    console.log(DOMAIN_FULL_EMAIL);
    try {
        console.log({ from, to, subject });
        const response = yield transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent:', response);
        return {
            success: true,
            message: 'Email sent successfully!',
        };
    }
    catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            message: 'Failed to send email. Please try again later.',
        };
    }
});
exports.sendEmail = sendEmail;
/**
 * Function to send a "set password" email.
 */
const setPasswordRequestEmail = (email, setPasswordURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailBody = email_templates_1.SET_PASSWORD_REQUEST_TEMPLATE.replace('{setPasswordURL}', setPasswordURL);
        const result = yield (0, exports.sendEmail)({
            to: email,
            subject: 'Set your password',
            text: 'Please set your password using the link below',
            html: emailBody,
        });
        if (result.success) {
            console.log('Set password email sent successfully');
            return {
                success: true,
                message: 'Set password email sent successfully!',
            };
        }
        else {
            console.error('Failed to send set password email:', result.message);
            return {
                success: false,
                message: result.message,
            };
        }
    }
    catch (error) {
        console.error('Error sending set password email:', error);
        return {
            success: false,
            message: 'Failed to send set password email. Please try again later.',
        };
    }
});
exports.setPasswordRequestEmail = setPasswordRequestEmail;
const sendPasswordResetEmail = (email, resetURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailBody = email_templates_1.PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL);
        const result = yield (0, exports.sendEmail)({
            to: email,
            subject: 'Reset your password',
            text: 'Click the link below to reset your password.',
            html: emailBody,
        });
        if (result.success) {
            console.log('Password reset email sent successfully');
            return {
                success: true,
                message: 'Password reset email sent successfully!',
            };
        }
        else {
            console.error('Failed to send password reset email:', result.message);
            return {
                success: false,
                message: result.message,
            };
        }
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
        return {
            success: false,
            message: 'Failed to send password reset email. Please try again later.',
        };
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendResetSuccessEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, exports.sendEmail)({
            to: email,
            subject: 'Password Reset Successful',
            text: 'Your password has been successfully reset.',
            html: email_templates_1.PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        if (result.success) {
            console.log('Password reset success email sent successfully');
            return {
                success: true,
                message: 'Password reset success email sent successfully!',
            };
        }
        else {
            console.error('Failed to send password reset success email:', result.message);
            return {
                success: false,
                message: result.message,
            };
        }
    }
    catch (error) {
        console.error('Error sending password reset success email:', error);
        return {
            success: false,
            message: 'Failed to send password reset success email. Please try again later.',
        };
    }
});
exports.sendResetSuccessEmail = sendResetSuccessEmail;
/**
 * Function to send a contact email using a template.
 */
const sendContactEmail = (senderEmail, senderName, message, senderPhone) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        senderEmail,
        senderName,
        message,
        senderPhone,
    });
    try {
        const contactEmailBody = email_templates_1.CONTACT_EMAIL_TEMPLATE.replace(/{senderName}/g, senderName)
            .replace(/{senderEmail}/g, senderEmail)
            .replace(/{senderPhone}/g, senderPhone)
            .replace(/{message}/g, message);
        const result = yield (0, exports.sendEmail)({
            to: DOMAIN_EMAIL, // Replace with your support email
            subject: 'New Contact Form Submission',
            text: `Name: ${senderName}\nEmail: ${senderEmail}\nPhone: ${senderPhone}\nMessage: ${message}`,
            html: contactEmailBody,
            from: `${senderName} <${senderEmail}>`,
        });
        if (result.success) {
            console.log('Contact email sent successfully');
            return {
                success: true,
                message: 'Contact email sent successfully!',
            };
        }
        else {
            console.error('Failed to send contact email:', result.message);
            return {
                success: false,
                message: result.message,
            };
        }
    }
    catch (error) {
        console.error('Error sending contact email:', error);
        return {
            success: false,
            message: 'Failed to send contact email. Please try again later.',
        };
    }
});
exports.sendContactEmail = sendContactEmail;
const sendSetPasswordSuccessEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, exports.sendEmail)({
            to: email,
            subject: 'Password Set Successful',
            text: 'Your password has been set successfully.',
            html: email_templates_1.SET_PASSWORD_SUCCESS_TEMPLATE,
        });
        if (result.success) {
            console.log('Password set success email sent successfully');
            return {
                success: true,
                message: 'Password set success email sent successfully!',
            };
        }
        else {
            console.error('Failed to send password set success email:', result.message);
            return {
                success: false,
                message: result.message,
            };
        }
    }
    catch (error) {
        console.error('Error sending password set success email:', error);
        return {
            success: false,
            message: 'Failed to send password set success email. Please try again later.',
        };
    }
});
exports.sendSetPasswordSuccessEmail = sendSetPasswordSuccessEmail;
