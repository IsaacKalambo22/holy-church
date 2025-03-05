import { Router } from 'express';
import {
  createGallery,
  deleteGallery,
  getAllGallery,
  updateGallery,
} from '../../controllers/gallery';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createGallery);
router.get('/', getAllGallery);
router.patch('/:id', verifyToken, updateGallery);
router.delete('/:id', verifyToken, deleteGallery);

export default router;
