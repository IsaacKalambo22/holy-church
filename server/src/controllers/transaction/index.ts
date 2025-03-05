import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import Stripe from 'stripe';

const prisma = new PrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET_KEY is required but was not found in environment variables'
  );
}

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  {
    // apiVersion: '2022-11-15',
  }
);

export const listTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  try {
    const transactions = userId
      ? await prisma.transaction.findMany({
          where: { userId: userId as string },
        })
      : await prisma.transaction.findMany();

    res.json({
      message:
        'Transactions retrieved successfully',
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving transactions',
      error,
    });
  }
};

export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { amount } = req.body;

  if (!amount || amount <= 0) {
    amount = 50; // Default amount if none is provided
  }

  try {
    const paymentIntent =
      await stripe.paymentIntents.create({
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
  } catch (error) {
    res.status(500).json({
      message:
        'Error creating Stripe payment intent',
      error,
    });
  }
};

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    userId,
    courseId,
    transactionId,
    amount,
    paymentProvider,
  } = req.body;

  try {
    // 1. Get course info
    const course = await prisma.course.findUnique(
      {
        where: { id: courseId },
      }
    );

    if (!course) {
      res
        .status(404)
        .json({ message: 'Course not found' });
      return;
    }

    // 2. Create transaction record
    const newTransaction =
      await prisma.transaction.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        'Error creating transaction and enrollment',
      error,
    });
  }
};
