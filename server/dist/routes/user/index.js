"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../controllers/user");
const verify_token_1 = require("../../middlewares/verify-token");
const router = (0, express_1.Router)();
router.get('/', user_1.getAllUsers);
router.post('/contact-email', user_1.sendContactMessage);
router.get('/students', user_1.getStudents);
router.post('/students', verify_token_1.verifyAdmin, user_1.createStudent);
router.get('/students/:id', verify_token_1.verifyToken, user_1.getStudentById);
router.get('/email/:email', user_1.getUserByEmail);
router.get('/:id', verify_token_1.verifyToken, user_1.getUserById);
router.patch('/:id', verify_token_1.verifyToken, user_1.updateUser);
router.delete('/:id', verify_token_1.verifyAdmin, user_1.deleteUser);
// router.get(
//   '/students/:id',
//   verifyToken,
//   getUserById
// );
router.patch('/students/:id', verify_token_1.verifyToken, user_1.updateStudent);
router.delete('/students/:id', verify_token_1.verifyToken, user_1.deleteStudent);
exports.default = router;
