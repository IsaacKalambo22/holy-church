import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  sendContactMessage,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  createUser
} from '../../controllers/user';
import { verifyAdmin, verifyToken } from '../../middlewares/verify-token';

const router = Router();

// Public routes
router.post('/contact-email', sendContactMessage);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/verify-email/:token', verifyEmail);
router.post('/register', createUser);

// Protected routes
router.get('/', verifyToken, getAllUsers);
router.get('/email/:email', verifyToken, getUserByEmail);
router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);

export default router;
