import { Router } from 'express';
import {
  createSermon,
  deleteSermon,
  getSermon,
  getSermons,
  updateSermon
} from '../../controllers/sermon';
import {
} from '../../controllers/sermon/index';
import {
  verifyAdmin
} from '../../middlewares/verify-token';

const router = Router();

router.get('/', getSermons);
router.post('/', verifyAdmin, createSermon);
router.get('/:id', getSermon);
router.patch('/:id', verifyAdmin, updateSermon);


router.delete('/:id', verifyAdmin, deleteSermon);

export default router;
