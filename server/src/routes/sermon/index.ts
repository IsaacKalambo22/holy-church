import { Router } from 'express';
import {
  createSermon,
  deleteSermon,
  getSermon,
  getSermons,
  updateSermon
} from '../../controllers/sermon';
import { verifyAdmin } from '../../middlewares/verify-token';

const router = Router();

// Public routes
router.get('/', getSermons);
router.get('/:id', getSermon);

// Protected routes
router.post('/', verifyAdmin, createSermon);
router.patch('/:id', verifyAdmin, updateSermon);
router.delete('/:id', verifyAdmin, deleteSermon);

export default router;
