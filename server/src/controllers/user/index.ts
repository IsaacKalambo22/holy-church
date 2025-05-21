import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import {
  sendContactEmail,
  setPasswordRequestEmail,
} from '../../nodemailer/emails';
import { APIResponse } from '../../types/types';
import { prisma, Role } from '../../lib';

export const getAllUsers = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, // Sort users by most recent creation date
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        role: true,
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error: any) {
    console.error(
      'Error fetching users:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching users. Please try again later.',
      error: error.message,
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'User ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    console.error(
      'Error fetching users:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching users. Please try again later.',
      error: error.message,
    });
  }
};
export const getUserByEmail = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { email } = req.params;

  // Validation input
  if (!email) {
    res.status(400).json({
      success: false,
      message: 'User email is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        role: true,
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    console.error(
      'Error fetching users:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching users. Please try again later.',
      error: error.message,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    avatar,
    about,
  } = req.body;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'User ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // If email is being changed, check if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        res.status(400).json({
          success: false,
          message: 'Email is already in use.',
        });
        return;
      }
    }

    // Validate role if provided
    if (role && !Object.values(Role).includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role provided',
      });
      return;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && {
          password: await bcrypt.hash(password, 10),
        }),
        ...(role && { role }),
        ...(phoneNumber && { phoneNumber }),
        ...(avatar && { avatar }),
        ...(about && { about }),
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        avatar: true,
        about: true,
        role: true,
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the user. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'User ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the user exists
    const existingUser =
      await prisma.user.findUnique({
        where: { id },
      });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting user:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the user. Please try again later.',
      error: error.message,
    });
  }
};

export const sendContactMessage = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, email, phoneNumber, message } = req.body;

  // Validate user input
  if (!name || !email || !phoneNumber || !message) {
    res.status(400).json({
      success: false,
      message: 'Name, email, phone number, and message are required.'
    });
    return;
  }

  try {
    const result = await sendContactEmail(email, name, message, phoneNumber);

    if (result.success) {
      console.log('Contact email sent successfully');
      res.status(200).json({
        success: true,
        message: 'Email sent successfully!'
      });
    } else {
      console.error('Failed to send contact email:', result.message);
      res.status(500).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending email. Please try again later.'
    });
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: 'Email is required'
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save hashed token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: resetTokenExpiresAt
      }
    });

    // Send reset email
    await setPasswordRequestEmail(email, `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions have been sent to your email'
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting password reset'
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({
      success: false,
      message: 'Token and password are required'
    });
    return;
  }

  try {
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
      return;
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({
      success: false,
      message: 'Verification token is required'
    });
    return;
  }

  try {
    // Find user with valid verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
      return;
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, email, password, phoneNumber, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
      error: 'Validation error'
    });
    return;
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Validate role if provided
    if (role && !Object.values(Role).includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role provided'
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role: role || Role.USER,
        isVerified: false,
        verificationToken,
        verificationTokenExpiresAt,
        lastLogin: new Date()
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Send verification email
    await setPasswordRequestEmail(email, `${process.env.CLIENT_BASE_URL}/verify-email/${verificationToken}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email to verify your account.',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error
    });
  }
};
