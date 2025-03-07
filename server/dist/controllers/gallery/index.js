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
exports.deleteGallery = exports.updateGallery = exports.getAllGallery = exports.createGallery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caption, imageUrls, date } = req.body;
    // Validate input
    if (!caption ||
        !imageUrls ||
        !Array.isArray(imageUrls) ||
        imageUrls.length === 0 ||
        !date) {
        res.status(400).json({
            success: false,
            message: 'Caption, image URLs, and date are required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Create the new gallery
        const newGallery = yield prisma.gallery.create({
            data: {
                caption,
                imageUrls,
                date: new Date(date),
            },
        });
        res.status(201).json({
            success: true,
            message: 'Gallery created successfully',
            data: newGallery,
        });
    }
    catch (error) {
        console.error('Error creating gallery:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the gallery. Please try again later.',
            error: error.message,
        });
    }
});
exports.createGallery = createGallery;
const getAllGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gallery = yield prisma.gallery.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            success: true,
            message: 'Gallery retrieved successfully',
            data: gallery,
        });
    }
    catch (error) {
        console.error('Error fetching gallery:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching gallery. Please try again later.',
            error: error.message,
        });
    }
});
exports.getAllGallery = getAllGallery;
const updateGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { caption, imageUrls, date } = req.body;
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Gallery ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        const existingGallery = yield prisma.gallery.findUnique({
            where: { id },
        });
        if (!existingGallery) {
            res.status(404).json({
                success: false,
                message: 'Gallery not found.',
            });
            return;
        }
        const updatedData = {
            caption: (caption === null || caption === void 0 ? void 0 : caption.trim()) ||
                existingGallery.caption,
            imageUrls: Array.isArray(imageUrls) &&
                imageUrls.length > 0
                ? imageUrls
                : existingGallery.imageUrls,
            date: date
                ? new Date(date)
                : existingGallery.date,
        };
        const updatedGallery = yield prisma.gallery.update({
            where: { id },
            data: updatedData,
        });
        res.status(200).json({
            success: true,
            message: 'Gallery updated successfully',
            data: updatedGallery,
        });
    }
    catch (error) {
        console.error('Error updating gallery:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the gallery. Please try again later.',
            error: error.message,
        });
    }
});
exports.updateGallery = updateGallery;
const deleteGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Gallery ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        const existingGallery = yield prisma.gallery.findUnique({
            where: { id },
        });
        if (!existingGallery) {
            res.status(404).json({
                success: false,
                message: 'Gallery not found.',
            });
            return;
        }
        yield prisma.gallery.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Gallery deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting gallery:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the gallery. Please try again later.',
            error: error.message,
        });
    }
});
exports.deleteGallery = deleteGallery;
