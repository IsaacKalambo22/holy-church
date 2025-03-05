import {
  AccountType,
  PrismaClient,
  Role,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import {
  sendContactEmail,
  setPasswordRequestEmail,
} from '../../nodemailer/emails';
import { APIResponse } from '../../types/types';

const prisma = new PrismaClient();

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
    district,
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

    // Prepare updated data
    const updatedData: Partial<
      typeof existingUser
    > = {
      name: name?.trim() || existingUser.name,

      avatar:
        avatar?.trim() || existingUser.avatar,
      about: about?.trim() || existingUser.about,
      email: email?.trim() || existingUser.email,
      role: role?.trim() || existingUser.role,
      phoneNumber:
        phoneNumber?.trim() ||
        existingUser.phoneNumber,
    };

    // Hash the password if it's being updated
    if (password?.trim()) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(
        password,
        saltRounds
      );
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(
      'Error updating user:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the user. Please try again later.',
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

export const createStudent = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const {
      email,
      phoneNumber,
      name,
      avatar,
      about,
      age,
      gender,
      contactInfo,
      backgroundSummary,
      initialAssessment,
      aptitudesAndStrengths,
      shortTermGoals,
      longTermObjectives,
      workshopsAttended,
      resourcesUtilized,
      skillsDevelopment,
      behavioralChanges,
      feedbackAndSelfReflection,
      obstaclesEncountered,
      interventionsProvided,
      accountType,
    } = req.body;

    // Validate required fields
    if (!email || !name || !age) {
      res.status(400).json({
        success: false,
        message:
          'Email, name, and age are required.',
        error: 'Validation error',
      });
      return;
    }

    // Check if the email is already taken
    const existingUser =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email is already in use.',
        error: 'Duplicate email',
      });
      return;
    }

    // Create the user with role STUDENT
    const user = await prisma.user.create({
      data: {
        email,
        phoneNumber,
        name,
        avatar,
        about,
        role: Role.STUDENT, // Assigning Student Role
      },
    });

    // Create the student record linked to the user
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        age,
        gender,
        contactInfo,
        backgroundSummary,
        initialAssessment,
        aptitudesAndStrengths,
        shortTermGoals,
        longTermObjectives,
        workshopsAttended,
        resourcesUtilized,
        skillsDevelopment,
        behavioralChanges,
        feedbackAndSelfReflection,
        obstaclesEncountered,
        interventionsProvided,
        accountType:
          accountType || AccountType.SILVER,
      },
    });

    const verificationToken = crypto
      .randomBytes(32)
      .toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); // 24 hours from now

    await setPasswordRequestEmail(
      email,
      `${process.env.CLIENT_BASE_URL}/set-password/${verificationToken}`
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: hashedToken,
        verificationTokenExpiresAt,
      },
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { user, student },
    });
  } catch (error: any) {
    console.error(
      'Error creating student:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the student. Please try again later.',
      error: error.message,
    });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = req.params.id;
  const {
    email,
    phoneNumber,
    name,
    avatar,
    about,
    age,
    gender,
    contactInfo,
    backgroundSummary,
    initialAssessment,
    aptitudesAndStrengths,
    shortTermGoals,
    longTermObjectives,
    workshopsAttended,
    resourcesUtilized,
    skillsDevelopment,
    behavioralChanges,
    feedbackAndSelfReflection,
    obstaclesEncountered,
    interventionsProvided,
    accountType,
  } = req.body;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Student ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the student exists
    const existingStudent =
      await prisma.student.findUnique({
        where: { id },
        include: { user: true },
      });

    if (!existingStudent) {
      res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
      return;
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id: existingStudent.userId },
      data: {
        email:
          email?.trim() ||
          existingStudent.user.email,
        phoneNumber:
          phoneNumber?.trim() ||
          existingStudent.user.phoneNumber,
        name:
          name?.trim() ||
          existingStudent.user.name,
        avatar:
          avatar?.trim() ||
          existingStudent.user.avatar,
        about:
          about?.trim() ||
          existingStudent.user.about,
      },
    });

    // Update the student details
    const updatedStudent =
      await prisma.student.update({
        where: { id },
        data: {
          gender:
            gender || existingStudent.gender,
          age: age || existingStudent.age,
          contactInfo:
            contactInfo?.trim() ||
            existingStudent.contactInfo,
          backgroundSummary:
            backgroundSummary?.trim() ||
            existingStudent.backgroundSummary,
          initialAssessment:
            initialAssessment?.trim() ||
            existingStudent.initialAssessment,
          aptitudesAndStrengths:
            aptitudesAndStrengths?.trim() ||
            existingStudent.aptitudesAndStrengths,
          shortTermGoals:
            shortTermGoals?.trim() ||
            existingStudent.shortTermGoals,
          longTermObjectives:
            longTermObjectives?.trim() ||
            existingStudent.longTermObjectives,
          workshopsAttended:
            workshopsAttended?.trim() ||
            existingStudent.workshopsAttended,
          resourcesUtilized:
            resourcesUtilized?.trim() ||
            existingStudent.resourcesUtilized,
          skillsDevelopment:
            skillsDevelopment?.trim() ||
            existingStudent.skillsDevelopment,
          behavioralChanges:
            behavioralChanges?.trim() ||
            existingStudent.behavioralChanges,
          feedbackAndSelfReflection:
            feedbackAndSelfReflection?.trim() ||
            existingStudent.feedbackAndSelfReflection,
          obstaclesEncountered:
            obstaclesEncountered?.trim() ||
            existingStudent.obstaclesEncountered,
          interventionsProvided:
            interventionsProvided?.trim() ||
            existingStudent.interventionsProvided,
          accountType:
            accountType ||
            existingStudent.accountType,
        },
      });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      data: {
        user: updatedUser,
        student: updatedStudent,
      },
    });
  } catch (error: any) {
    console.error(
      'Error updating student:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the student. Please try again later.',
      error: error.message,
    });
  }
};

export const getStudents = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const students =
      await prisma.student.findMany({
        orderBy: { createdAt: 'desc' },

        include: {
          user: true, // Fetch associated user details
        },
      });

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully.',
      data: students,
    });
  } catch (error: any) {
    console.error(
      'Error fetching students:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching students.',
      error: error.message,
    });
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Student ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Find the student first
    const student =
      await prisma.student.findUnique({
        where: { id },
        include: { user: true },
      });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
      return;
    }

    // Delete the student record
    await prisma.student.delete({
      where: { id },
    });

    // Delete the associated user
    await prisma.user.delete({
      where: { id: student.userId },
    });

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully.',
    });
  } catch (error: any) {
    console.error(
      'Error deleting student:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the student.',
      error: error.message,
    });
  }
};

export const getStudentById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Student ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the student exists
    const student =
      await prisma.student.findUnique({
        where: { id },
        include: { user: true },
      });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    });
  } catch (error: any) {
    console.error(
      'Error fetching students:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching students. Please try again later.',
      error: error.message,
    });
  }
};

export const sendContactMessage = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, email, phoneNumber, message } =
    req.body;

  // Validate user input
  if (
    !name ||
    !email ||
    !phoneNumber ||
    !message
  ) {
    res.status(400).json({
      success: false,
      message:
        'Name, email, phone number, and message are required.',
    });
    return;
  }

  try {
    // Format email body using template

    // Send email
    const result = await sendContactEmail(
      email,
      name,
      message,
      phoneNumber
    );

    if (result.success) {
      console.log(
        'Contact email sent successfully'
      );
      res.status(200).json({
        success: true,
        message: 'Email sent successfully!',
      });
    } else {
      console.error(
        'Failed to send contact email:',
        result.message
      );
      res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message:
        'An error occurred while sending email. Please try again later.',
    });
  }
};
