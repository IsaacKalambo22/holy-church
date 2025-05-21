"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../controllers/user");
const verify_token_1 = require("../../middlewares/verify-token");
const router = (0, express_1.Router)();
// Public routes
router.post('/contact-email', user_1.sendContactMessage);
router.post('/request-password-reset', user_1.requestPasswordReset);
router.post('/reset-password', user_1.resetPassword);
router.post('/verify-email/:token', user_1.verifyEmail);
router.post('/register', user_1.createUser);
// Protected routes
router.get('/', verify_token_1.verifyToken, user_1.getAllUsers);
router.get('/email/:email', verify_token_1.verifyToken, user_1.getUserByEmail);
router.get('/:id', verify_token_1.verifyToken, user_1.getUserById);
router.patch('/:id', verify_token_1.verifyToken, user_1.updateUser);
router.delete('/:id', verify_token_1.verifyAdmin, user_1.deleteUser);
exports.default = router;
