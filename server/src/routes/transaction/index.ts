import { Router } from 'express';
import {
  createStripePaymentIntent,
  createTransaction,
  listTransactions,
} from '../../controllers/transaction';
import { verifyToken } from '../../middlewares/verify-token';

const router = Router();

router.get('/', listTransactions);
router.post('/', verifyToken, createTransaction);
router.post(
  '/stripe/payment-intent',
  createStripePaymentIntent
);

export default router;
