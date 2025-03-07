"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../controllers/auth");
const router = (0, express_1.Router)();
router.post('/register', 
// verifyAdmin,
auth_1.registerUser);
router.post('/sign-in', auth_1.login);
router.post('/set-password', auth_1.setPassword);
router.post('/reset-password', auth_1.resetPassword);
router.post('/forgot-password', auth_1.forgotPassword);
exports.default = router;
