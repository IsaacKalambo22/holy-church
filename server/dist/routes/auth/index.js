"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../controllers/auth");
const router = (0, express_1.Router)();
// Authentication routes
router.post('/register', auth_1.registerUser);
router.post('/login', auth_1.login);
router.post('/refresh-token', auth_1.refreshToken);
// Password management
router.post('/set-password', auth_1.setPassword);
router.post('/forgot-password', auth_1.forgotPassword);
router.post('/reset-password', auth_1.resetPassword);
// Email verification
router.post('/verify-email/:token', auth_1.verifyEmail);
exports.default = router;
