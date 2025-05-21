import { Router } from 'express';
import {
  createDonation,
  getDonationById,
  listDonations,
  updateDonation,
  createStripePaymentIntent,
  deleteDonation
} from '../../controllers/transaction';
import { verifyToken } from '../../middlewares/verify-token';

const router = Router();

// Donation routes
router.get('/', listDonations);
router.get('/:id', getDonationById);
router.post('/', verifyToken, createDonation);
router.patch('/:id', verifyToken, updateDonation);
router.delete('/:id', verifyToken, deleteDonation);

// Payment routes
router.post('/stripe/payment-intent', createStripePaymentIntent);

export default router;
