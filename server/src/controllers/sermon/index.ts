import {
  PrismaClient,
} from '@prisma/client';
import { Request, Response } from 'express';
import {
  APIResponse,
} from '../../types/types';

const prisma = new PrismaClient();

export const getSermons = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const sermons = await prisma.sermon.findMany({
      include: { preacher: true },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      message: 'Sermons retrieved successfully',
      data: sermons,
    });
  } catch (error) {
    console.error(
      'Error retrieving sermons:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving sermons. Please try again later.',
      error: error,
    });
  }
};


export const getSermon = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  try {
    const sermon = await prisma.sermon.findUnique(
      {
        where: {
          id: id,
        },
        include: {
          preacher: true
        },
      }
    );

    if (!sermon) {
      res.status(404).json({
        success: false,
        message: 'Sermon not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Sermon retrieved successfully',
      data: sermon,
    });
  } catch (error) {
    console.log('Error fetching sermon:', error);
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching the sermon. Please try again later.',
      error: error,
    });
  }
};

export const createSermon = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    console.log(req.body);
    console.log(req.user);

    // Get user ID from request (assuming authentication middleware)
    const userId = req?.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          'Unauthorized: User ID is missing.',
      });
      return;
    }

    // Find the user in the database by userId
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    // Check if user exists and has the required role
    if (
      !user ||
      (user.role !== 'TEACHER' &&
        user.role !== 'ADMIN')
    ) {
      res.status(403).json({
        success: false,
        message:
          'Unauthorized: Only teachers or admins can create a sermon.',
      });
      return;
    }

    // Create Sermon
    const newSermon = await prisma.sermon.create({
      data: {
        userId: user.id,
        teacherName: user.name,
        title: 'Untitled title',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Sermon created successfully',
      data: newSermon,
    });
  } catch (error) {
    console.error(
      'Error creating sermon:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the sermon. Please try again later.',
      error: error,
    });
  }
};

export const updateSermon = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const { id: sermonId } = req.params;

    const {
      title,
      description,
      category,
      imageUrl,
      price,
      isPublished,
    } = req.body;

    const userId = req?.user?.id;

    // Find the user in the database
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    // Check if user exists and has the required role
    if (
      !user ||
      (user.role !== 'TEACHER' &&
        user.role !== 'ADMIN')
    ) {
      res.status(403).json({
        success: false,
        message:
          'Unauthorized: Only teachers or admins can update a sermon.',
      });
      return;
    }

    // Find the sermon to ensure it exists and the user is authorized to update it
    const existingSermon =
      await prisma.sermon.findUnique({
        where: { id: sermonId },
      });

    if (!existingSermon) {
      res.status(404).json({
        success: false,
        message: 'Sermon not found.',
      });
      return;
    }

    if (
      user.role !== 'ADMIN' &&
      existingSermon.userId !== userId
    ) {
      res.status(403).json({
        success: false,
        message:
          'Unauthorized: You can only update your own sermons.',
      });
      return;
    }

    // Find or create the category if necessary
    let categoryId = existingSermon.categoryId;
    if (category) {
      const categoryRecord =
        await prisma.category.findFirst({
          where: { name: category },
        });

      if (!categoryRecord) {
        const newCategory =
          await prisma.category.create({
            data: { name: category },
          });
        categoryId = newCategory.id;
      } else {
        categoryId = categoryRecord.id;
      }
    }

    // Prepare updated data
    const updatedData: Partial<
      typeof existingSermon
    > = {
      title:
        title?.trim() || existingSermon.title,
      description:
        description?.trim() ||
        existingSermon.description,
      imageUrl:
        imageUrl?.trim() ||
        existingSermon.imageUrl,
      price:
        price !== undefined && price !== ''
          ? Number(price)
          : existingSermon.price,
      isPublished:
        isPublished ?? existingSermon.isPublished,
      categoryId,
    };

    // Update the sermon
    const updatedSermon =
      await prisma.sermon.update({
        where: { id: sermonId },
        data: updatedData,
      });

    res.status(200).json({
      success: true,
      message: 'Sermon updated successfully',
      data: updatedSermon,
    });
  } catch (error) {
    console.error(
      'Error updating sermon:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the sermon. Please try again later.',
      error: error,
    });
  }
};

export const deleteSermon = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const userId = req?.user?.id;

  try {
    if (!userId || !id) {
      res.status(404).json({
        success: false,
        message:
          'User id and sermon id are required',
      });
      return;
    }
    // Find the sermon by its ID
    const sermon = await prisma.sermon.findUnique(
      {
        where: { id: id },
      }
    );

    if (!sermon) {
      res.status(404).json({
        success: false,
        message: 'Sermon not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this sermon
    if (sermon.userId !== userId) {
      res.status(403).json({
        success: false,
        message:
          'Not authorized to delete this sermon',
      });
      return;
    }

    // Delete the sermon
    await prisma.sermon.delete({
      where: { id: id },
    });

    res.status(200).json({
      success: true,
      message: 'Sermon deleted successfully',
      data: sermon, // Optional: Include sermon details if needed
    });
  } catch (error) {
    console.error(
      'Error deleting sermon:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the sermon. Please try again later.',
      error: error,
    });
  }
};


