
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../../lib';

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

export const listDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  try {
    const donations = userId
      ? await prisma.donation.findMany({
          where: { donorId: userId as string },
          include: { donor: true }
        })
      : await prisma.donation.findMany({
          include: { donor: true }
        });

    res.json({
      success: true,
      message: 'Donations retrieved successfully',
      data: donations,
    });
  } catch (error) {
    console.error('Error retrieving donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving donations',
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
    const paymentIntent = await stripe.paymentIntents.create({
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
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Stripe payment intent',
      error,
    });
  }
};

export const createDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const newDonation = await prisma.donation.create({
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
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating donation',
      error,
    });
  }
};

export const getDonationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const donation = await prisma.donation.findUnique({
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
  } catch (error) {
    console.error('Error retrieving donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving donation',
      error
    });
  }
};

export const updateDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { amount, message } = req.body;

  try {
    // Check if donation exists
    const existingDonation = await prisma.donation.findUnique({
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
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(message !== undefined && { message })
      },
      include: { donor: true }
    });

    res.json({
      success: true,
      message: 'Donation updated successfully',
      data: updatedDonation
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation',
      error
    });
  }
};

export const deleteDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Check if donation exists
    const existingDonation = await prisma.donation.findUnique({
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
    await prisma.donation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting donation',
      error
    });
  }
};
