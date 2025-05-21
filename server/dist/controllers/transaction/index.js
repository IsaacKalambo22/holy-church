"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDonation = exports.updateDonation = exports.getDonationById = exports.createDonation = exports.createStripePaymentIntent = exports.listDonations = void 0;
const stripe_1 = __importDefault(require("stripe"));
const lib_1 = require("../../lib");
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required but was not found in environment variables');
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
// apiVersion: '2022-11-15',
});
const listDonations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const donations = userId
            ? yield lib_1.prisma.donation.findMany({
                where: { donorId: userId },
                include: { donor: true }
            })
            : yield lib_1.prisma.donation.findMany({
                include: { donor: true }
            });
        res.json({
            success: true,
            message: 'Donations retrieved successfully',
            data: donations,
        });
    }
    catch (error) {
        console.error('Error retrieving donations:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving donations',
            error,
        });
    }
});
exports.listDonations = listDonations;
const createStripePaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    if (!amount || amount <= 0) {
        amount = 50; // Default amount if none is provided
    }
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe requires the amount in cents
            currency: 'mwk', // Malawian Kwacha
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({
            success: true,
            message: 'Payment intent created successfully',
            data: {
                clientSecret: paymentIntent.client_secret,
            },
        });
    }
    catch (error) {
        console.error('Error creating Stripe payment intent:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating Stripe payment intent',
            error,
        });
    }
});
exports.createStripePaymentIntent = createStripePaymentIntent;
const createDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { donorId, amount, message } = req.body;
    try {
        if (!amount || amount <= 0) {
            res.status(400).json({
                success: false,
                message: 'Valid amount is required',
            });
            return;
        }
        // Create donation record
        const newDonation = yield lib_1.prisma.donation.create({
            data: {
                donorId,
                amount,
                message,
            },
            include: {
                donor: true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Donation created successfully',
            data: newDonation,
        });
    }
    catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating donation',
            error,
        });
    }
});
exports.createDonation = createDonation;
const getDonationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const donation = yield lib_1.prisma.donation.findUnique({
            where: { id },
            include: { donor: true }
        });
        if (!donation) {
            res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Donation retrieved successfully',
            data: donation
        });
    }
    catch (error) {
        console.error('Error retrieving donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving donation',
            error
        });
    }
});
exports.getDonationById = getDonationById;
const updateDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { amount, message } = req.body;
    try {
        // Check if donation exists
        const existingDonation = yield lib_1.prisma.donation.findUnique({
            where: { id }
        });
        if (!existingDonation) {
            res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
            return;
        }
        // Validate amount if provided
        if (amount !== undefined && amount <= 0) {
            res.status(400).json({
                success: false,
                message: 'Valid amount is required'
            });
            return;
        }
        // Update donation
        const updatedDonation = yield lib_1.prisma.donation.update({
            where: { id },
            data: Object.assign(Object.assign({}, (amount !== undefined && { amount })), (message !== undefined && { message })),
            include: { donor: true }
        });
        res.json({
            success: true,
            message: 'Donation updated successfully',
            data: updatedDonation
        });
    }
    catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating donation',
            error
        });
    }
});
exports.updateDonation = updateDonation;
const deleteDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Check if donation exists
        const existingDonation = yield lib_1.prisma.donation.findUnique({
            where: { id }
        });
        if (!existingDonation) {
            res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
            return;
        }
        // Delete donation
        yield lib_1.prisma.donation.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Donation deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting donation',
            error
        });
    }
});
exports.deleteDonation = deleteDonation;
