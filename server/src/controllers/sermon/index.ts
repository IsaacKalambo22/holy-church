
import { Request, Response } from 'express';
import { APIResponse } from '../../types/types';
import { Role, prisma } from '../../lib';


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
    const { title, description, videoUrl, audioUrl, preacherId } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    // Create Sermon
    const newSermon = await prisma.sermon.create({
      data: {
        title,
        description,
        videoUrl,
        audioUrl,
        preacherId,
      },
      include: {
        preacher: true
      }
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

    const { title, description, videoUrl, audioUrl, preacherId } = req.body;

    // Find the sermon to ensure it exists
    const existingSermon = await prisma.sermon.findUnique({
      where: { id: sermonId },
    });

    if (!existingSermon) {
      res.status(404).json({
        success: false,
        message: 'Sermon not found.',
      });
      return;
    }

    // Update the sermon
    const updatedSermon = await prisma.sermon.update({
      where: { id: sermonId },
      data: {
        title: title || existingSermon.title,
        description: description || existingSermon.description,
        videoUrl: videoUrl || existingSermon.videoUrl,
        audioUrl: audioUrl || existingSermon.audioUrl,
        preacherId: preacherId || existingSermon.preacherId,
      },
      include: {
        preacher: true
      }
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
  try {
    // Find the sermon by its ID
    const sermon = await prisma.sermon.findUnique({
      where: { id: id },
    });

    if (!sermon) {
      res.status(404).json({
        success: false,
        message: 'Sermon not found',
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


