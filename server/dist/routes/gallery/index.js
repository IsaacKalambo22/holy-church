"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_1 = require("../../controllers/gallery");
const verify_token_1 = require("../../middlewares/verify-token");
const router = (0, express_1.Router)();
// Public routes
router.get('/', gallery_1.getAllGallery);
// Protected routes
router.post('/', verify_token_1.verifyAdmin, gallery_1.createGallery);
router.patch('/:id', verify_token_1.verifyAdmin, gallery_1.updateGallery);
router.delete('/:id', verify_token_1.verifyAdmin, gallery_1.deleteGallery);
exports.default = router;
