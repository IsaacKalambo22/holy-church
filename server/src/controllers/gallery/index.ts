
import { Request, Response } from 'express';
import { APIResponse } from '../../types/types';
import { prisma } from '../../lib';


export const createGallery = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { caption, imageUrls, date } = req.body;

  // Validate input
  if (
    !caption ||
    !imageUrls ||
    !Array.isArray(imageUrls) ||
    imageUrls.length === 0 ||
    !date
  ) {
    res.status(400).json({
      success: false,
      message:
        'Caption, image URLs, and date are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new gallery
    const newGallery =
      await prisma.gallery.create({
        data: {
          caption,
          imageUrls,
          createdAt: new Date(date),
        },
      });

    res.status(201).json({
      success: true,
      message: 'Gallery created successfully',
      data: newGallery,
    });
  } catch (error: any) {
    console.error(
      'Error creating gallery:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the gallery. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllGallery = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const gallery = await prisma.gallery.findMany(
      {
        orderBy: { createdAt: 'desc' },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Gallery retrieved successfully',
      data: gallery,
    });
  } catch (error: any) {
    console.error(
      'Error fetching gallery:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching gallery. Please try again later.',
      error: error.message,
    });
  }
};

export const updateGallery = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { caption, imageUrls, date } = req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Gallery ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingGallery =
      await prisma.gallery.findUnique({
        where: { id },
      });

    if (!existingGallery) {
      res.status(404).json({
        success: false,
        message: 'Gallery not found.',
      });
      return;
    }

    const updatedData: any = {
      caption:
        caption?.trim() ||
        existingGallery.caption,
      imageUrls:
        Array.isArray(imageUrls) &&
        imageUrls.length > 0
          ? imageUrls
          : existingGallery.imageUrls,
      createdAt: date
        ? new Date(date)
        : existingGallery.createdAt,
    };

    const updatedGallery =
      await prisma.gallery.update({
        where: { id },
        data: updatedData,
      });

    res.status(200).json({
      success: true,
      message: 'Gallery updated successfully',
      data: updatedGallery,
    });
  } catch (error: any) {
    console.error(
      'Error updating gallery:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the gallery. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteGallery = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Gallery ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingGallery =
      await prisma.gallery.findUnique({
        where: { id },
      });

    if (!existingGallery) {
      res.status(404).json({
        success: false,
        message: 'Gallery not found.',
      });
      return;
    }

    await prisma.gallery.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Gallery deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting gallery:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the gallery. Please try again later.',
      error: error.message,
    });
  }
};
