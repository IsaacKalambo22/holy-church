import { Router } from 'express';
import {
  createGallery,
  deleteGallery,
  getAllGallery,
  updateGallery,
} from '../../controllers/gallery';
import { verifyAdmin, verifyToken } from '../../middlewares/verify-token';

const router = Router();

// Public routes
router.get('/', getAllGallery);

// Protected routes
router.post('/', verifyAdmin, createGallery);
router.patch('/:id', verifyAdmin, updateGallery);
router.delete('/:id', verifyAdmin, deleteGallery);

export default router;
