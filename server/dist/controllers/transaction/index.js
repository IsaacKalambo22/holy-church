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
exports.createTransaction = exports.createStripePaymentIntent = exports.listTransactions = void 0;
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const prisma = new client_1.PrismaClient();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required but was not found in environment variables');
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
// apiVersion: '2022-11-15',
});
const listTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const transactions = userId
            ? yield prisma.transaction.findMany({
                where: { userId: userId },
            })
            : yield prisma.transaction.findMany();
        res.json({
            message: 'Transactions retrieved successfully',
            data: transactions,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving transactions',
            error,
        });
    }
});
exports.listTransactions = listTransactions;
const createStripePaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { amount } = req.body;
    if (!amount || amount <= 0) {
        amount = 50; // Default amount if none is provided
    }
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe requires the amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({
            message: '',
            data: {
                clientSecret: paymentIntent.client_secret,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error creating Stripe payment intent',
            error,
        });
    }
});
exports.createStripePaymentIntent = createStripePaymentIntent;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId, transactionId, amount, paymentProvider, } = req.body;
    try {
        // 1. Get course info
        const course = yield prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            res
                .status(404)
                .json({ message: 'Course not found' });
            return;
        }
        // 2. Create transaction record
        const newTransaction = yield prisma.transaction.create({
            data: {
                dateTime: new Date(),
                userId,
                courseId,
                transactionId,
                amount,
                paymentProvider,
            },
        });
        res.json({
            message: 'Purchased course successfully',
            data: {
                transaction: newTransaction,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating transaction and enrollment',
            error,
        });
    }
});
exports.createTransaction = createTransaction;
