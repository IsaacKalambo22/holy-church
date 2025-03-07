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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserCourseProgress = exports.getCourseChapter = exports.updateCourseChapter = exports.createCourseChapter = exports.reorderCourseChapters = exports.deleteCourse = exports.deleteCourseAttachment = exports.createCourseAttachment = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getProgress = exports.getPublishedCoursesWithProgress = exports.getUserCourseProgress = exports.getUserProgress = exports.getPurchasedCourse = exports.getPublishedCourseProgress = exports.getPublishedOrFreeChapterWithProgress = exports.getPublishedCourse = exports.getPublishedCourses = exports.getCategories = exports.getCourses = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma.course.findMany({
            include: {
                attachments: true,
                chapters: {
                    orderBy: { position: 'asc' },
                },
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            message: 'Courses retrieved successfully',
            data: courses,
        });
    }
    catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving courses. Please try again later.',
            error: error,
        });
    }
});
exports.getCourses = getCourses;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories,
        });
    }
    catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving categories. Please try again later.',
            error: error,
        });
    }
});
exports.getCategories = getCategories;
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.query.categoryId;
    const title = req.query.title;
    try {
        const publishedCourses = yield prisma.course.findMany({
            where: {
                isPublished: true,
                categoryId,
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
            include: {
                attachments: true,
                category: true,
                transactions: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            message: 'Published courses retrieved successfully',
            data: publishedCourses,
        });
    }
    catch (error) {
        console.error('Error retrieving published courses:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving published courses. Please try again later.',
            error: error,
        });
    }
});
const getPublishedCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.query.categoryId;
    const title = req.query.title;
    try {
        const publishedCourses = yield prisma.course.findMany({
            where: {
                isPublished: true,
                categoryId,
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
            include: {
                attachments: true,
                category: true,
                transactions: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            message: 'Published courses retrieved successfully',
            data: publishedCourses,
        });
    }
    catch (error) {
        console.error('Error retrieving published courses:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving published courses. Please try again later.',
            error: error,
        });
    }
});
exports.getPublishedCourses = getPublishedCourses;
const getPublishedCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const publishedCourse = yield prisma.course.findUnique({
            where: {
                id: id,
            },
            include: {
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: 'Published course retrieved successfully',
            data: publishedCourse,
        });
    }
    catch (error) {
        console.error('Error retrieving published course:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving published course. Please try again later.',
            error: error,
        });
    }
});
exports.getPublishedCourse = getPublishedCourse;
const getPublishedOrFreeChapterWithProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courseId, chapterId } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId || !courseId || !chapterId) {
            res.status(404).json({
                success: false,
                message: 'User id, course id & chapter id are required',
            });
            return;
        }
        const purchasedCourse = yield prisma.transaction.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        const publishedCourse = yield prisma.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
            select: {
                price: true,
                description: true,
                attachments: true,
            },
        });
        const chapter = yield prisma.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });
        if (!chapter || !publishedCourse) {
            res.status(404).json({
                success: false,
                message: 'Course or chapter not found',
            });
            return;
        }
        let attachments = [];
        let nextChapter = null;
        if (purchasedCourse) {
            attachments =
                yield prisma.attachment.findMany({
                    where: {
                        courseId: courseId,
                    },
                });
        }
        if (chapter.isFree || purchasedCourse) {
            nextChapter =
                yield prisma.chapter.findFirst({
                    where: {
                        courseId: courseId,
                        isPublished: true,
                        position: {
                            gt: chapter === null || chapter === void 0 ? void 0 : chapter.position,
                        },
                    },
                    orderBy: {
                        position: 'asc',
                    },
                });
        }
        const userProgress = yield prisma.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });
        res.status(200).json({
            success: true,
            message: 'Chapter with progress retrieved successfully',
            data: {
                chapter,
                course: publishedCourse,
                attachments,
                nextChapter,
                userProgress,
                purchasedCourse,
            },
        });
    }
    catch (error) {
        console.error('Error retrieving chapter with progress:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving chapter with progress. Please try again later.',
            error: error,
        });
    }
});
exports.getPublishedOrFreeChapterWithProgress = getPublishedOrFreeChapterWithProgress;
const getPublishedCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const course = yield prisma.course.findUnique({
            where: {
                id: id,
            },
            include: {
                attachments: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    include: {
                        userProgress: {
                            where: {
                                userId,
                            },
                        },
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: 'Published course progress retrieved successfully',
            data: course,
        });
    }
    catch (error) {
        console.error('Error retrieving published course progress:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving published course progress. Please try again later.',
            error: error,
        });
    }
});
exports.getPublishedCourseProgress = getPublishedCourseProgress;
const getPurchasedCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id and course id are required',
            });
            return;
        }
        const purchasedCourse = yield prisma.transaction.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: id,
                },
            },
        });
        res.status(200).json({
            success: true,
            message: 'Purchased course retrieved successfully',
            data: purchasedCourse,
        });
    }
    catch (error) {
        console.error('Error retrieving purchased course:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving purchased course. Please try again later.',
            error: error,
        });
    }
});
exports.getPurchasedCourse = getPurchasedCourse;
const getUserProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            res.status(404).json({
                success: false,
                message: 'User id is required',
            });
            return;
        }
        const purchasedCourses = yield prisma.transaction.findMany({
            where: {
                userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        attachments: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            },
                        },
                    },
                },
            },
        });
        const courses = purchasedCourses.map((purchase) => purchase.course);
        for (let course of courses) {
            const progress = yield (0, exports.getProgress)(userId, course.id);
            course.progress = progress;
        }
        // Handle completed and courses in progress
        const completedCourses = courses.filter((course) => course.progress === 100);
        // Courses in progress (progress must be greater than 0 but less than 100)
        const coursesInProgress = courses.filter((course) => course.progress !== null &&
            course.progress === 0 &&
            course.progress < 100);
        res.status(200).json({
            success: true,
            message: 'User progress retrieved successfully',
            data: {
                completedCourses,
                coursesInProgress,
            },
        });
    }
    catch (error) {
        console.error('Error retrieving user progress:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving user progress. Please try again later.',
            error: error,
        });
    }
});
exports.getUserProgress = getUserProgress;
const getUserCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id & course id are required',
            });
            return;
        }
        const progress = yield (0, exports.getProgress)(userId, id);
        res.status(200).json({
            success: true,
            message: 'User course progress retrieved successfully',
            data: progress,
        });
    }
    catch (error) {
        console.error('Error retrieving user course progress:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving user course progress. Please try again later.',
            error: error,
        });
    }
});
exports.getUserCourseProgress = getUserCourseProgress;
const getPublishedCoursesWithProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const categoryId = req.query.categoryId;
    const title = req.query.title;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            res.status(404).json({
                success: false,
                message: 'User id is required',
            });
            return;
        }
        const publishedCourses = yield prisma.course.findMany({
            where: {
                isPublished: true,
                categoryId,
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
            include: {
                attachments: true,
                category: true,
                transactions: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const coursesWithProgress = yield Promise.all(publishedCourses.map((course) => __awaiter(void 0, void 0, void 0, function* () {
            if (course.transactions.length === 0) {
                return Object.assign(Object.assign({}, course), { progress: null });
            }
            const progressPercentage = yield (0, exports.getProgress)(userId, course.id);
            return Object.assign(Object.assign({}, course), { progress: progressPercentage });
        })));
        res.status(200).json({
            success: true,
            message: 'Published courses with progress retrieved successfully',
            data: coursesWithProgress,
        });
    }
    catch (error) {
        console.error('Error retrieving published courses with progress:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving published courses with progress. Please try again later.',
            error: error,
        });
    }
});
exports.getPublishedCoursesWithProgress = getPublishedCoursesWithProgress;
const getProgress = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publishedChapters = yield prisma.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });
        // create an array of chapter ids
        const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);
        const validCompletedChapters = yield prisma.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapterIds,
                },
                isCompleted: true,
            },
        });
        //calcucate progress percentage:
        // completed chapters / total published chapters
        const progressPercentage = (validCompletedChapters /
            publishedChapters.length) *
            100;
        return progressPercentage;
    }
    catch (error) {
        console.log('[GET_PROGRESS]', error);
        return 0;
    }
});
exports.getProgress = getProgress;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield prisma.course.findUnique({
            where: {
                id: id,
            },
            include: {
                attachments: true,
                chapters: {
                    orderBy: { position: 'asc' },
                },
                category: true,
            },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Course retrieved successfully',
            data: course,
        });
    }
    catch (error) {
        console.log('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the course. Please try again later.',
            error: error,
        });
    }
});
exports.getCourse = getCourse;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.body);
        console.log(req.user);
        // Get user ID from request (assuming authentication middleware)
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID is missing.',
            });
            return;
        }
        // Find the user in the database by userId
        const user = yield prisma.user.findFirst({
            where: { id: userId },
        });
        // Check if user exists and has the required role
        if (!user ||
            (user.role !== 'TEACHER' &&
                user.role !== 'ADMIN')) {
            res.status(403).json({
                success: false,
                message: 'Unauthorized: Only teachers or admins can create a course.',
            });
            return;
        }
        // Create Course
        const newCourse = yield prisma.course.create({
            data: {
                userId: user.id,
                teacherName: user.name,
                title: 'Untitled title',
            },
        });
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: newCourse,
        });
    }
    catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the course. Please try again later.',
            error: error,
        });
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: courseId } = req.params;
        const { title, description, category, imageUrl, price, isPublished, } = req.body;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Find the user in the database
        const user = yield prisma.user.findFirst({
            where: { id: userId },
        });
        // Check if user exists and has the required role
        if (!user ||
            (user.role !== 'TEACHER' &&
                user.role !== 'ADMIN')) {
            res.status(403).json({
                success: false,
                message: 'Unauthorized: Only teachers or admins can update a course.',
            });
            return;
        }
        // Find the course to ensure it exists and the user is authorized to update it
        const existingCourse = yield prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!existingCourse) {
            res.status(404).json({
                success: false,
                message: 'Course not found.',
            });
            return;
        }
        if (user.role !== 'ADMIN' &&
            existingCourse.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only update your own courses.',
            });
            return;
        }
        // Find or create the category if necessary
        let categoryId = existingCourse.categoryId;
        if (category) {
            const categoryRecord = yield prisma.category.findFirst({
                where: { name: category },
            });
            if (!categoryRecord) {
                const newCategory = yield prisma.category.create({
                    data: { name: category },
                });
                categoryId = newCategory.id;
            }
            else {
                categoryId = categoryRecord.id;
            }
        }
        // Prepare updated data
        const updatedData = {
            title: (title === null || title === void 0 ? void 0 : title.trim()) || existingCourse.title,
            description: (description === null || description === void 0 ? void 0 : description.trim()) ||
                existingCourse.description,
            imageUrl: (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.trim()) ||
                existingCourse.imageUrl,
            price: price !== undefined && price !== ''
                ? Number(price)
                : existingCourse.price,
            isPublished: isPublished !== null && isPublished !== void 0 ? isPublished : existingCourse.isPublished,
            categoryId,
        };
        // Update the course
        const updatedCourse = yield prisma.course.update({
            where: { id: courseId },
            data: updatedData,
        });
        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the course. Please try again later.',
            error: error,
        });
    }
});
exports.updateCourse = updateCourse;
const createCourseAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { name, url } = req.body;
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id and course id are required',
            });
            return;
        }
        // Find the course by its ID
        const course = yield prisma.course.findUnique({
            where: { id: id },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        // Check if the logged-in user is the teacher for this course
        if (course.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to create attachment',
            });
            return;
        }
        const attachment = yield prisma.attachment.create({
            data: {
                name,
                url,
                courseId: id,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Attachment created successfully',
            data: attachment, // Optional: Include attachment details if needed
        });
    }
    catch (error) {
        console.error('Error creating attachment:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the attachment. Please try again later.',
            error: error,
        });
    }
});
exports.createCourseAttachment = createCourseAttachment;
const deleteCourseAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id and attachment id are required',
            });
            return;
        }
        // Find the attachment by its ID
        const attachment = yield prisma.attachment.findUnique({
            where: { id: id },
        });
        if (!attachment) {
            res.status(404).json({
                success: false,
                message: 'Attachment not found',
            });
            return;
        }
        // Delete the attachment
        yield prisma.attachment.delete({
            where: { id: id },
        });
        res.status(200).json({
            success: true,
            message: 'Attachment deleted successfully',
            data: attachment, // Optional: Include attachment details if needed
        });
    }
    catch (error) {
        console.error('Error deleting attachment:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the attachment. Please try again later.',
            error: error,
        });
    }
});
exports.deleteCourseAttachment = deleteCourseAttachment;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id and course id are required',
            });
            return;
        }
        // Find the course by its ID
        const course = yield prisma.course.findUnique({
            where: { id: id },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        // Check if the logged-in user is the teacher for this course
        if (course.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to delete this course',
            });
            return;
        }
        // Delete the course
        yield prisma.course.delete({
            where: { id: id },
        });
        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
            data: course, // Optional: Include course details if needed
        });
    }
    catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the course. Please try again later.',
            error: error,
        });
    }
});
exports.deleteCourse = deleteCourse;
const reorderCourseChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const list = req.body;
    console.log(req.body);
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id and course id are required',
            });
            return;
        }
        // Find the course by its ID
        const course = yield prisma.course.findUnique({
            where: { id: id },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        // Check if the logged-in user is the teacher for this course
        if (course.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to reorder chapters',
            });
            return;
        }
        for (let item of list) {
            yield prisma.chapter.update({
                where: { id: item.id },
                data: { position: item.position },
            });
        }
        res.status(200).json({
            success: true,
            message: 'Course chapters ordered successfully',
            data: course, // Optional: Include course details if needed
        });
    }
    catch (error) {
        console.error('Error reordering chapters:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while reordering the chapters. Please try again later.',
            error: error,
        });
    }
});
exports.reorderCourseChapters = reorderCourseChapters;
const createCourseChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { title, description, content, videoUrl, isPublished, isFree, } = req.body;
    try {
        if (!userId || !id) {
            res.status(404).json({
                success: false,
                message: 'User id and course id are required',
            });
            return;
        }
        // Find the course by its ID
        const course = yield prisma.course.findUnique({
            where: { id: id },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        // Check if the logged-in user is the teacher for this course
        if (course.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to create chapter',
            });
            return;
        }
        const lastChapter = yield prisma.chapter.findFirst({
            where: {
                courseId: id,
            },
            orderBy: {
                position: 'desc',
            },
        });
        const newPosition = lastChapter
            ? lastChapter.position + 1
            : 1;
        const chapter = yield prisma.chapter.create({
            data: {
                title,
                description,
                content,
                videoUrl,
                courseId: id,
                position: newPosition,
                isFree,
                isPublished,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Chapter created successfully',
            data: chapter, // Optional: Include chapter details if needed
        });
    }
    catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the chapter. Please try again later.',
            error: error,
        });
    }
});
exports.createCourseChapter = createCourseChapter;
const updateCourseChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, chapterId } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { title, description, content, videoUrl, isPublished, isFree, } = req.body;
    try {
        if (!userId || !id || !chapterId) {
            res.status(404).json({
                success: false,
                message: 'User id and course id & chapter id are required',
            });
            return;
        }
        // Find the course by its ID
        const course = yield prisma.course.findUnique({
            where: { id: id },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        // Check if the logged-in user is the teacher for this course
        if (course.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to update chapter',
            });
            return;
        }
        const existingChapter = yield prisma.chapter.findFirst({
            where: {
                courseId: id,
                id: chapterId,
            },
        });
        // Prepare updated data
        const updatedData = {
            title: (title === null || title === void 0 ? void 0 : title.trim()) || (existingChapter === null || existingChapter === void 0 ? void 0 : existingChapter.title),
            description: (description === null || description === void 0 ? void 0 : description.trim()) ||
                (existingChapter === null || existingChapter === void 0 ? void 0 : existingChapter.description),
            content: (content === null || content === void 0 ? void 0 : content.trim()) ||
                (existingChapter === null || existingChapter === void 0 ? void 0 : existingChapter.content),
            videoUrl: (videoUrl === null || videoUrl === void 0 ? void 0 : videoUrl.trim()) ||
                (existingChapter === null || existingChapter === void 0 ? void 0 : existingChapter.videoUrl),
            isPublished: isPublished !== null && isPublished !== void 0 ? isPublished : existingChapter === null || existingChapter === void 0 ? void 0 : existingChapter.isPublished,
            isFree: isFree !== null && isFree !== void 0 ? isFree : existingChapter === null || existingChapter === void 0 ? void 0 : existingChapter.isFree,
        };
        const chapter = yield prisma.chapter.update({
            where: { courseId: id, id: chapterId },
            data: updatedData,
        });
        res.status(200).json({
            success: true,
            message: 'Chapter updated successfully',
            data: chapter, // Optional: Include chapter details if needed
        });
    }
    catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the chapter. Please try again later.',
            error: error,
        });
    }
});
exports.updateCourseChapter = updateCourseChapter;
const getCourseChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, chapterId } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId || !id || !chapterId) {
            res.status(404).json({
                success: false,
                message: 'User id and course id & chapter id are required',
            });
            return;
        }
        // Find the course by its ID
        const course = yield prisma.course.findUnique({
            where: { id: id },
        });
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found',
            });
            return;
        }
        // Check if the logged-in user is the teacher for this course
        if (course.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to get chapter',
            });
            return;
        }
        const chapter = yield prisma.chapter.findFirst({
            where: {
                courseId: id,
                id: chapterId,
            },
        });
        console.log({ chapter });
        res.status(200).json({
            success: true,
            message: 'Chapter retrieved successfully',
            data: chapter, // Optional: Include chapter details if needed
        });
    }
    catch (error) {
        console.error('Error retrieving chapter:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the chapter. Please try again later.',
            error: error,
        });
    }
});
exports.getCourseChapter = getCourseChapter;
const updateUserCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { chapterId } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { isCompleted } = req.body;
    try {
        // Check if userId and chapterId are provided
        if (!userId || !chapterId) {
            res.status(400).json({
                success: false,
                message: 'User id and chapter id are required',
            });
            return;
        }
        // Update the user progress for the specified chapter
        const updatedProgress = yield prisma.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId,
                isCompleted,
            },
        });
        console.log({ updatedProgress });
        res.status(200).json({
            success: true,
            message: 'User progress updated successfully',
            data: updatedProgress,
        });
    }
    catch (error) {
        console.error('Error updating user progress:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating user progress. Please try again later.',
            error: error,
        });
    }
});
exports.updateUserCourseProgress = updateUserCourseProgress;
