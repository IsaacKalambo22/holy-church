import { Router } from 'express';
import {
  login,
  registerUser,
  resetPassword,
  setPassword,
  forgotPassword,
  verifyEmail,
  refreshToken
} from '../../controllers/auth';

const router = Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Password management
router.post('/set-password', setPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Email verification
router.post('/verify-email/:token', verifyEmail);

export default router;
