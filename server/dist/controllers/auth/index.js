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
exports.refreshToken = exports.verifyEmail = exports.forgotPassword = exports.resetPassword = exports.setPassword = exports.login = exports.registerUser = exports.bootstrapSuperAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emails_1 = require("../../nodemailer/emails");
const utils_1 = require("../../utils");
const lib_1 = require("../../lib");
const bootstrapSuperAdmin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAdmin = yield lib_1.prisma.user.findFirst({
        where: { roles: { has: lib_1.Role.SUPER_ADMIN } },
    });
    if (!existingAdmin) {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield lib_1.prisma.user.create({
            data: {
                name: "Super Admin",
                email,
                password: hashedPassword,
                roles: [lib_1.Role.SUPER_ADMIN],
            },
        });
        console.log("✅ Super Admin user created automatically.");
    }
    else {
        console.log("🛡️ Super Admin user already exists.");
    }
});
exports.bootstrapSuperAdmin = bootstrapSuperAdmin;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, role, phoneNumber, password, } = req.body;
    // Validate user input
    if (!name || !email) {
        res.status(400).json({
            success: false,
            message: 'Name, email are required.',
        });
        return; // Ensure early exit after sending response
    }
    try {
        // Check if the email already exists
        const existingUser = yield lib_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'Email already in use. Please use a different email.',
            });
            return; // Ensure early exit after sending response
        }
        const verificationToken = crypto_1.default
            .randomBytes(32)
            .toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        let hashedPassword = '';
        // Hash the password if it's being updated
        if (password) {
            const saltRounds = 10;
            hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        }
        // Create the user
        const newUser = yield lib_1.prisma.user.create({
            data: {
                name,
                email,
                phoneNumber: phoneNumber || null,
                password: hashedPassword || null,
                role: role || lib_1.Role.USER,
                verificationToken: hashedToken,
                verificationTokenExpiresAt, // 24 hours
            },
        });
        yield (0, emails_1.setPasswordRequestEmail)(email, `${process.env.CLIENT_BASE_URL}/set-password/${verificationToken}`);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the user. Please try again later.',
        });
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    // Validate user input
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Email and password are required.',
        });
        return;
    }
    try {
        // Check if the user exists
        const user = yield lib_1.prisma.user.findUnique({
            where: { email },
        });
        console.log({ user });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found. Please check your email.',
            });
            return;
        }
        // Compare the provided password with the stored hash
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please check your password.',
            });
            return;
        }
        const { access_token, refresh_token } = (0, utils_1.generateTokens)(user.id, user.email, user.role);
        // Update the user's last login timestamp
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        // Set the refresh token as an HTTP-only cookie for secure token refreshing
        res.cookie('jwt-refresh', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 1,
        });
        // Return a success response with the generated token
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: access_token,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging in. Please try again later.',
        });
    }
});
exports.login = login;
const setPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken, password } = req.body;
    // Validate input
    if (!verificationToken || !password) {
        res.status(400).json({
            success: false,
            message: 'Token and new password are required.',
        });
        return;
    }
    try {
        // Hash the token to match database storage
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        // Find the user with the matching token and ensure it's not expired
        const user = yield lib_1.prisma.user.findFirst({
            where: {
                verificationToken: hashedToken,
                verificationTokenExpiresAt: {
                    gte: new Date(), // Ensure the token has not expired
                },
            },
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired token.',
            });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Update the user's record
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                verificationToken: null, // Clear the token
                verificationTokenExpiresAt: null,
            },
        });
        yield (0, emails_1.sendSetPasswordSuccessEmail)(user.email);
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Password updated successfully. You can now log in.',
            email: user.email,
        });
    }
    catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the password. Please try again later.',
        });
    }
});
exports.setPassword = setPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken, password } = req.body;
    // Validate input
    if (!verificationToken || !password) {
        res.status(400).json({
            success: false,
            message: 'Token and new password are required.',
        });
        return;
    }
    try {
        // Hash the token to match database storage
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        // Find the user with the matching token and ensure it's not expired
        const user = yield lib_1.prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiresAt: {
                    gte: new Date(), // Ensure the token has not expired
                },
            },
        });
        console.log({ user });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired token.',
            });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Update the user's record
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null, // Clear the token
                resetPasswordExpiresAt: null,
            },
        });
        yield (0, emails_1.sendResetSuccessEmail)(user.email);
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now log in.',
            email: user.email,
        });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the password. Please try again later.',
        });
    }
});
exports.resetPassword = resetPassword;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Validate input
    if (!email) {
        res.status(400).json({
            success: false,
            message: 'Email is required.',
        });
        return;
    }
    try {
        const verificationToken = crypto_1.default
            .randomBytes(32)
            .toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        const resetPasswordExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        // Find the user with the matching token and ensure it's not expired
        const user = yield lib_1.prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'User not found.',
            });
            return;
        }
        // Update the user's record
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiresAt,
            },
        });
        yield (0, emails_1.sendPasswordResetEmail)(email, `${process.env.CLIENT_BASE_URL}/reset-password/${verificationToken}`);
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email',
            email: user.email,
        });
    }
    catch (error) {
        console.error('Error sending password reset link:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending password reset link. Please try again later.',
        });
    }
});
exports.forgotPassword = forgotPassword;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token) {
        res.status(400).json({
            success: false,
            message: 'Verification token is required'
        });
        return;
    }
    try {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = yield lib_1.prisma.user.findFirst({
            where: {
                verificationToken: hashedToken,
                verificationTokenExpiresAt: {
                    gt: new Date()
                }
            }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
            return;
        }
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null
            }
        });
        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email'
        });
    }
});
exports.verifyEmail = verifyEmail;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies['jwt-refresh'];
    if (!refreshToken) {
        res.status(401).json({
            success: false,
            message: 'Refresh token is required'
        });
        return;
    }
    try {
        // Verify the refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const { userId, email, role } = decoded;
        // Generate new tokens
        const tokens = (0, utils_1.generateTokens)(userId, email, role);
        // Set the new refresh token as an HTTP-only cookie
        res.cookie('jwt-refresh', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                access_token: tokens.access_token
            }
        });
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
});
exports.refreshToken = refreshToken;
