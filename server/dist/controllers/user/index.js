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
exports.sendContactMessage = exports.getStudentById = exports.deleteStudent = exports.getStudents = exports.updateStudent = exports.createStudent = exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const emails_1 = require("../../nodemailer/emails");
const prisma = new client_1.PrismaClient();
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
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
        const user = yield prisma.user.findUnique({
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
        const user = yield prisma.user.findUnique({
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
    const { name, email, password, role, phoneNumber, district, avatar, about, } = req.body;
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
        const existingUser = yield prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'User not found.',
            });
            return;
        }
        // Prepare updated data
        const updatedData = {
            name: (name === null || name === void 0 ? void 0 : name.trim()) || existingUser.name,
            avatar: (avatar === null || avatar === void 0 ? void 0 : avatar.trim()) || existingUser.avatar,
            about: (about === null || about === void 0 ? void 0 : about.trim()) || existingUser.about,
            email: (email === null || email === void 0 ? void 0 : email.trim()) || existingUser.email,
            role: (role === null || role === void 0 ? void 0 : role.trim()) || existingUser.role,
            phoneNumber: (phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.trim()) ||
                existingUser.phoneNumber,
        };
        // Hash the password if it's being updated
        if (password === null || password === void 0 ? void 0 : password.trim()) {
            const saltRounds = 10;
            updatedData.password = yield bcrypt_1.default.hash(password, saltRounds);
        }
        // Update the user details
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: updatedData,
        });
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User updated successfully.',
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
        const existingUser = yield prisma.user.findUnique({
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
        yield prisma.user.delete({
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
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber, name, avatar, about, age, gender, contactInfo, backgroundSummary, initialAssessment, aptitudesAndStrengths, shortTermGoals, longTermObjectives, workshopsAttended, resourcesUtilized, skillsDevelopment, behavioralChanges, feedbackAndSelfReflection, obstaclesEncountered, interventionsProvided, accountType, } = req.body;
        // Validate required fields
        if (!email || !name || !age) {
            res.status(400).json({
                success: false,
                message: 'Email, name, and age are required.',
                error: 'Validation error',
            });
            return;
        }
        // Check if the email is already taken
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Email is already in use.',
                error: 'Duplicate email',
            });
            return;
        }
        // Create the user with role STUDENT
        const user = yield prisma.user.create({
            data: {
                email,
                phoneNumber,
                name,
                avatar,
                about,
                role: client_1.Role.STUDENT, // Assigning Student Role
            },
        });
        // Create the student record linked to the user
        const student = yield prisma.student.create({
            data: {
                userId: user.id,
                age,
                gender,
                contactInfo,
                backgroundSummary,
                initialAssessment,
                aptitudesAndStrengths,
                shortTermGoals,
                longTermObjectives,
                workshopsAttended,
                resourcesUtilized,
                skillsDevelopment,
                behavioralChanges,
                feedbackAndSelfReflection,
                obstaclesEncountered,
                interventionsProvided,
                accountType: accountType || client_1.AccountType.SILVER,
            },
        });
        const verificationToken = crypto_1.default
            .randomBytes(32)
            .toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        yield (0, emails_1.setPasswordRequestEmail)(email, `${process.env.CLIENT_BASE_URL}/set-password/${verificationToken}`);
        yield prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: hashedToken,
                verificationTokenExpiresAt,
            },
        });
        // Respond with success
        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: { user, student },
        });
    }
    catch (error) {
        console.error('Error creating student:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the student. Please try again later.',
            error: error.message,
        });
    }
});
exports.createStudent = createStudent;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { email, phoneNumber, name, avatar, about, age, gender, contactInfo, backgroundSummary, initialAssessment, aptitudesAndStrengths, shortTermGoals, longTermObjectives, workshopsAttended, resourcesUtilized, skillsDevelopment, behavioralChanges, feedbackAndSelfReflection, obstaclesEncountered, interventionsProvided, accountType, } = req.body;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the student exists
        const existingStudent = yield prisma.student.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!existingStudent) {
            res.status(404).json({
                success: false,
                message: 'Student not found.',
            });
            return;
        }
        // Update the user details
        const updatedUser = yield prisma.user.update({
            where: { id: existingStudent.userId },
            data: {
                email: (email === null || email === void 0 ? void 0 : email.trim()) ||
                    existingStudent.user.email,
                phoneNumber: (phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.trim()) ||
                    existingStudent.user.phoneNumber,
                name: (name === null || name === void 0 ? void 0 : name.trim()) ||
                    existingStudent.user.name,
                avatar: (avatar === null || avatar === void 0 ? void 0 : avatar.trim()) ||
                    existingStudent.user.avatar,
                about: (about === null || about === void 0 ? void 0 : about.trim()) ||
                    existingStudent.user.about,
            },
        });
        // Update the student details
        const updatedStudent = yield prisma.student.update({
            where: { id },
            data: {
                gender: gender || existingStudent.gender,
                age: age || existingStudent.age,
                contactInfo: (contactInfo === null || contactInfo === void 0 ? void 0 : contactInfo.trim()) ||
                    existingStudent.contactInfo,
                backgroundSummary: (backgroundSummary === null || backgroundSummary === void 0 ? void 0 : backgroundSummary.trim()) ||
                    existingStudent.backgroundSummary,
                initialAssessment: (initialAssessment === null || initialAssessment === void 0 ? void 0 : initialAssessment.trim()) ||
                    existingStudent.initialAssessment,
                aptitudesAndStrengths: (aptitudesAndStrengths === null || aptitudesAndStrengths === void 0 ? void 0 : aptitudesAndStrengths.trim()) ||
                    existingStudent.aptitudesAndStrengths,
                shortTermGoals: (shortTermGoals === null || shortTermGoals === void 0 ? void 0 : shortTermGoals.trim()) ||
                    existingStudent.shortTermGoals,
                longTermObjectives: (longTermObjectives === null || longTermObjectives === void 0 ? void 0 : longTermObjectives.trim()) ||
                    existingStudent.longTermObjectives,
                workshopsAttended: (workshopsAttended === null || workshopsAttended === void 0 ? void 0 : workshopsAttended.trim()) ||
                    existingStudent.workshopsAttended,
                resourcesUtilized: (resourcesUtilized === null || resourcesUtilized === void 0 ? void 0 : resourcesUtilized.trim()) ||
                    existingStudent.resourcesUtilized,
                skillsDevelopment: (skillsDevelopment === null || skillsDevelopment === void 0 ? void 0 : skillsDevelopment.trim()) ||
                    existingStudent.skillsDevelopment,
                behavioralChanges: (behavioralChanges === null || behavioralChanges === void 0 ? void 0 : behavioralChanges.trim()) ||
                    existingStudent.behavioralChanges,
                feedbackAndSelfReflection: (feedbackAndSelfReflection === null || feedbackAndSelfReflection === void 0 ? void 0 : feedbackAndSelfReflection.trim()) ||
                    existingStudent.feedbackAndSelfReflection,
                obstaclesEncountered: (obstaclesEncountered === null || obstaclesEncountered === void 0 ? void 0 : obstaclesEncountered.trim()) ||
                    existingStudent.obstaclesEncountered,
                interventionsProvided: (interventionsProvided === null || interventionsProvided === void 0 ? void 0 : interventionsProvided.trim()) ||
                    existingStudent.interventionsProvided,
                accountType: accountType ||
                    existingStudent.accountType,
            },
        });
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Student updated successfully.',
            data: {
                user: updatedUser,
                student: updatedStudent,
            },
        });
    }
    catch (error) {
        console.error('Error updating student:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the student. Please try again later.',
            error: error.message,
        });
    }
});
exports.updateStudent = updateStudent;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.student.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: true, // Fetch associated user details
            },
        });
        res.status(200).json({
            success: true,
            message: 'Students retrieved successfully.',
            data: students,
        });
    }
    catch (error) {
        console.error('Error fetching students:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching students.',
            error: error.message,
        });
    }
});
exports.getStudents = getStudents;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Find the student first
        const student = yield prisma.student.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found.',
            });
            return;
        }
        // Delete the student record
        yield prisma.student.delete({
            where: { id },
        });
        // Delete the associated user
        yield prisma.user.delete({
            where: { id: student.userId },
        });
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully.',
        });
    }
    catch (error) {
        console.error('Error deleting student:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the student.',
            error: error.message,
        });
    }
});
exports.deleteStudent = deleteStudent;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the student exists
        const student = yield prisma.student.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found.',
            });
            return;
        }
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Student retrieved successfully',
            data: student,
        });
    }
    catch (error) {
        console.error('Error fetching students:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching students. Please try again later.',
            error: error.message,
        });
    }
});
exports.getStudentById = getStudentById;
const sendContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, message } = req.body;
    // Validate user input
    if (!name ||
        !email ||
        !phoneNumber ||
        !message) {
        res.status(400).json({
            success: false,
            message: 'Name, email, phone number, and message are required.',
        });
        return;
    }
    try {
        // Format email body using template
        // Send email
        const result = yield (0, emails_1.sendContactEmail)(email, name, message, phoneNumber);
        if (result.success) {
            console.log('Contact email sent successfully');
            res.status(200).json({
                success: true,
                message: 'Email sent successfully!',
            });
        }
        else {
            console.error('Failed to send contact email:', result.message);
            res.status(500).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending email. Please try again later.',
        });
    }
});
exports.sendContactMessage = sendContactMessage;
