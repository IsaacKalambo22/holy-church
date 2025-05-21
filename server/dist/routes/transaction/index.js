"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_1 = require("../../controllers/transaction");
const verify_token_1 = require("../../middlewares/verify-token");
const router = (0, express_1.Router)();
// Donation routes
router.get('/', transaction_1.listDonations);
router.get('/:id', transaction_1.getDonationById);
router.post('/', verify_token_1.verifyToken, transaction_1.createDonation);
router.patch('/:id', verify_token_1.verifyToken, transaction_1.updateDonation);
router.delete('/:id', verify_token_1.verifyToken, transaction_1.deleteDonation);
// Payment routes
router.post('/stripe/payment-intent', transaction_1.createStripePaymentIntent);
exports.default = router;
