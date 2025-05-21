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
exports.createUser = exports.verifyEmail = exports.resetPassword = exports.requestPasswordReset = exports.sendContactMessage = exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const emails_1 = require("../../nodemailer/emails");
const lib_1 = require("../../lib");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield lib_1.prisma.user.findMany({
            orderBy: { createdAt: 'desc' }, // Sort users by most recent creation date
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                name: true,
                role: true,
                lastLogin: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
        });
    }
    catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching users. Please try again later.',
            error: error.message,
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'User ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the user exists
        const user = yield lib_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found.',
            });
            return;
        }
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user,
        });
    }
    catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching users. Please try again later.',
            error: error.message,
        });
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    // Validation input
    if (!email) {
        res.status(400).json({
            success: false,
            message: 'User email is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the user exists
        const user = yield lib_1.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                name: true,
                role: true,
                lastLogin: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found.',
            });
            return;
        }
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user,
        });
    }
    catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching users. Please try again later.',
            error: error.message,
        });
    }
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password, role, phoneNumber, avatar, about, } = req.body;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'User ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the user exists
        const existingUser = yield lib_1.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'User not found.',
            });
            return;
        }
        // If email is being changed, check if it's already taken
        if (email && email !== existingUser.email) {
            const emailExists = yield lib_1.prisma.user.findUnique({
                where: { email },
            });
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    message: 'Email is already in use.',
                });
                return;
            }
        }
        // Validate role if provided
        if (role && !Object.values(lib_1.Role).includes(role)) {
            res.status(400).json({
                success: false,
                message: 'Invalid role provided',
            });
            return;
        }
        // Update the user
        const updatedUser = yield lib_1.prisma.user.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (email && { email })), (password && {
                password: yield bcrypt_1.default.hash(password, 10),
            })), (role && { role })), (phoneNumber && { phoneNumber })), (avatar && { avatar })), (about && { about })),
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                name: true,
                avatar: true,
                about: true,
                role: true,
                lastLogin: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the user. Please try again later.',
            error: error.message,
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'User ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the user exists
        const existingUser = yield lib_1.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'User not found.',
            });
            return;
        }
        // Delete the user
        yield lib_1.prisma.user.delete({
            where: { id },
        });
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the user. Please try again later.',
            error: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const sendContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, message } = req.body;
    // Validate user input
    if (!name || !email || !phoneNumber || !message) {
        res.status(400).json({
            success: false,
            message: 'Name, email, phone number, and message are required.'
        });
        return;
    }
    try {
        const result = yield (0, emails_1.sendContactEmail)(email, name, message, phoneNumber);
        if (result.success) {
            console.log('Contact email sent successfully');
            res.status(200).json({
                success: true,
                message: 'Email sent successfully!'
            });
        }
        else {
            console.error('Failed to send contact email:', result.message);
            res.status(500).json({
                success: false,
                message: result.message
            });
        }
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending email. Please try again later.'
        });
    }
});
exports.sendContactMessage = sendContactMessage;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({
            success: false,
            message: 'Email is required'
        });
        return;
    }
    try {
        const user = yield lib_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // Save hashed token
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiresAt: resetTokenExpiresAt
            }
        });
        // Send reset email
        yield (0, emails_1.setPasswordRequestEmail)(email, `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}`);
        res.status(200).json({
            success: true,
            message: 'Password reset instructions have been sent to your email'
        });
    }
    catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({
            success: false,
            message: 'Error requesting password reset'
        });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    if (!token || !password) {
        res.status(400).json({
            success: false,
            message: 'Token and password are required'
        });
        return;
    }
    try {
        // Find user with valid reset token
        const user = yield lib_1.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: {
                    gt: new Date()
                }
            }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
            return;
        }
        // Hash new password and update user
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield lib_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null
            }
        });
        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully'
        });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
});
exports.resetPassword = resetPassword;
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
        // Find user with valid verification token
        const user = yield lib_1.prisma.user.findFirst({
            where: {
                verificationToken: token,
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
        // Update user verification status
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
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, role } = req.body;
    // Validate required fields
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: 'Name, email, and password are required',
            error: 'Validation error'
        });
        return;
    }
    try {
        // Check if user exists
        const existingUser = yield lib_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }
        // Validate role if provided
        if (role && !Object.values(lib_1.Role).includes(role)) {
            res.status(400).json({
                success: false,
                message: 'Invalid role provided'
            });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Generate verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // Create user
        const newUser = yield lib_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                role: role || lib_1.Role.USER,
                isVerified: false,
                verificationToken,
                verificationTokenExpiresAt,
                lastLogin: new Date()
            },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                name: true,
                role: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });
        // Send verification email
        yield (0, emails_1.setPasswordRequestEmail)(email, `${process.env.CLIENT_BASE_URL}/verify-email/${verificationToken}`);
        res.status(201).json({
            success: true,
            message: 'User created successfully. Please check your email to verify your account.',
            data: newUser
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error
        });
    }
});
exports.createUser = createUser;
