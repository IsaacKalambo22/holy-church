import {
  Attachment,
  Chapter,
  PrismaClient,
} from '@prisma/client';
import { Request, Response } from 'express';
import {
  APIResponse,
  CourseProgress,
} from '../../types/types';

const prisma = new PrismaClient();

export const getCourses = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        attachments: true,
        chapters: {
          orderBy: { position: 'asc' },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    console.error(
      'Error retrieving courses:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving courses. Please try again later.',
      error: error,
    });
  }
};
export const getCategories = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const categories =
      await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });

    res.status(200).json({
      success: true,
      message:
        'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error(
      'Error retrieving categories:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving categories. Please try again later.',
      error: error,
    });
  }
};
async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const categoryId = req.query.categoryId as
    | string
    | undefined;
  const title = req.query.title as
    | string
    | undefined;

  try {
    const publishedCourses =
      await prisma.course.findMany({
        where: {
          isPublished: true,
          categoryId,
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        include: {
          attachments: true,
          category: true,
          transactions: true,
          chapters: {
            where: {
              isPublished: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    res.status(200).json({
      success: true,
      message:
        'Published courses retrieved successfully',
      data: publishedCourses,
    });
  } catch (error) {
    console.error(
      'Error retrieving published courses:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving published courses. Please try again later.',
      error: error,
    });
  }
};
export const getPublishedCourses = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const categoryId = req.query.categoryId as
    | string
    | undefined;
  const title = req.query.title as
    | string
    | undefined;

  try {
    const publishedCourses =
      await prisma.course.findMany({
        where: {
          isPublished: true,
          categoryId,
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        include: {
          attachments: true,
          category: true,
          transactions: true,
          chapters: {
            where: {
              isPublished: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    res.status(200).json({
      success: true,
      message:
        'Published courses retrieved successfully',
      data: publishedCourses,
    });
  } catch (error) {
    console.error(
      'Error retrieving published courses:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving published courses. Please try again later.',
      error: error,
    });
  }
};

export const getPublishedCourse = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  try {
    const publishedCourse =
      await prisma.course.findUnique({
        where: {
          id: id,
        },
        include: {
          chapters: {
            where: {
              isPublished: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

    res.status(200).json({
      success: true,
      message:
        'Published course retrieved successfully',
      data: publishedCourse,
    });
  } catch (error) {
    console.error(
      'Error retrieving published course:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving published course. Please try again later.',
      error: error,
    });
  }
};
export const getPublishedOrFreeChapterWithProgress =
  async (
    req: Request,
    res: Response<APIResponse>
  ): Promise<void> => {
    const { courseId, chapterId } = req.params;
    const userId = req?.user?.id;
    try {
      if (!userId || !courseId || !chapterId) {
        res.status(404).json({
          success: false,
          message:
            'User id, course id & chapter id are required',
        });
        return;
      }

      const purchasedCourse =
        await prisma.transaction.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });

      const publishedCourse =
        await prisma.course.findUnique({
          where: {
            id: courseId,
            isPublished: true,
          },
          select: {
            price: true,
            description: true,
            attachments: true,
          },
        });
      const chapter =
        await prisma.chapter.findUnique({
          where: {
            id: chapterId,
            isPublished: true,
          },
        });

      if (!chapter || !publishedCourse) {
        res.status(404).json({
          success: false,
          message: 'Course or chapter not found',
        });
        return;
      }
      let attachments: Attachment[] = [];
      let nextChapter: Chapter | null = null;

      if (purchasedCourse) {
        attachments =
          await prisma.attachment.findMany({
            where: {
              courseId: courseId,
            },
          });
      }

      if (chapter.isFree || purchasedCourse) {
        nextChapter =
          await prisma.chapter.findFirst({
            where: {
              courseId: courseId,
              isPublished: true,
              position: {
                gt: chapter?.position,
              },
            },
            orderBy: {
              position: 'asc',
            },
          });
      }

      const userProgress =
        await prisma.userProgress.findUnique({
          where: {
            userId_chapterId: {
              userId,
              chapterId,
            },
          },
        });
      res.status(200).json({
        success: true,
        message:
          'Chapter with progress retrieved successfully',
        data: {
          chapter,
          course: publishedCourse,
          attachments,
          nextChapter,
          userProgress,
          purchasedCourse,
        },
      });
    } catch (error) {
      console.error(
        'Error retrieving chapter with progress:',
        error
      );
      res.status(500).json({
        success: false,
        message:
          'An error occurred while retrieving chapter with progress. Please try again later.',
        error: error,
      });
    }
  };

export const getPublishedCourseProgress = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const userId = req?.user?.id;
  try {
    const course = await prisma.course.findUnique(
      {
        where: {
          id: id,
        },
        include: {
          attachments: true,
          chapters: {
            where: {
              isPublished: true,
            },
            include: {
              userProgress: {
                where: {
                  userId,
                },
              },
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message:
        'Published course progress retrieved successfully',
      data: course,
    });
  } catch (error) {
    console.error(
      'Error retrieving published course progress:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving published course progress. Please try again later.',
      error: error,
    });
  }
};
export const getPurchasedCourse = async (
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
          'User id and course id are required',
      });
      return;
    }
    const purchasedCourse =
      await prisma.transaction.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: id,
          },
        },
      });

    res.status(200).json({
      success: true,
      message:
        'Purchased course retrieved successfully',
      data: purchasedCourse,
    });
  } catch (error) {
    console.error(
      'Error retrieving purchased course:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving purchased course. Please try again later.',
      error: error,
    });
  }
};
export const getUserProgress = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const userId = req?.user?.id;

  try {
    if (!userId) {
      res.status(404).json({
        success: false,
        message: 'User id is required',
      });
      return;
    }
    const purchasedCourses =
      await prisma.transaction.findMany({
        where: {
          userId,
        },
        select: {
          course: {
            include: {
              category: true,
              attachments: true,
              chapters: {
                where: {
                  isPublished: true,
                },
              },
            },
          },
        },
      });

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as unknown as CourseProgress[];

    for (let course of courses) {
      const progress: number | null =
        await getProgress(userId, course.id);
      course.progress = progress;
    }

    // Handle completed and courses in progress
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    // Courses in progress (progress must be greater than 0 but less than 100)
    const coursesInProgress = courses.filter(
      (course) =>
        course.progress !== null &&
        course.progress === 0 &&
        course.progress < 100
    );

    res.status(200).json({
      success: true,
      message:
        'User progress retrieved successfully',
      data: {
        completedCourses,
        coursesInProgress,
      },
    });
  } catch (error) {
    console.error(
      'Error retrieving user progress:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving user progress. Please try again later.',
      error: error,
    });
  }
};
export const getUserCourseProgress = async (
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
          'User id & course id are required',
      });
      return;
    }

    const progress: number | null =
      await getProgress(userId, id);

    res.status(200).json({
      success: true,
      message:
        'User course progress retrieved successfully',
      data: progress,
    });
  } catch (error) {
    console.error(
      'Error retrieving user course progress:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving user course progress. Please try again later.',
      error: error,
    });
  }
};
export const getPublishedCoursesWithProgress =
  async (
    req: Request,
    res: Response<APIResponse>
  ): Promise<void> => {
    const categoryId = req.query.categoryId as
      | string
      | undefined;
    const title = req.query.title as
      | string
      | undefined;
    const userId = req?.user?.id;

    try {
      if (!userId) {
        res.status(404).json({
          success: false,
          message: 'User id is required',
        });
        return;
      }
      const publishedCourses =
        await prisma.course.findMany({
          where: {
            isPublished: true,
            categoryId,
            title: {
              contains: title,
              mode: 'insensitive',
            },
          },
          include: {
            attachments: true,
            category: true,
            transactions: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      const coursesWithProgress: CourseProgress[] =
        await Promise.all(
          publishedCourses.map(async (course) => {
            if (
              course.transactions.length === 0
            ) {
              return {
                ...course,
                progress: null, // make progress possibly null
              };
            }
            const progressPercentage =
              await getProgress(
                userId,
                course.id
              );

            return {
              ...course,
              progress: progressPercentage,
            };
          })
        );

      res.status(200).json({
        success: true,
        message:
          'Published courses with progress retrieved successfully',
        data: coursesWithProgress,
      });
    } catch (error) {
      console.error(
        'Error retrieving published courses with progress:',
        error
      );
      res.status(500).json({
        success: false,
        message:
          'An error occurred while retrieving published courses with progress. Please try again later.',
        error: error,
      });
    }
  };

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number | null> => {
  try {
    const publishedChapters =
      await prisma.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
        select: {
          id: true,
        },
      });

    // create an array of chapter ids
    const publishedChapterIds =
      publishedChapters.map(
        (chapter) => chapter.id
      );

    const validCompletedChapters =
      await prisma.userProgress.count({
        where: {
          userId: userId,
          chapterId: {
            in: publishedChapterIds,
          },
          isCompleted: true,
        },
      });

    //calcucate progress percentage:
    // completed chapters / total published chapters
    const progressPercentage =
      (validCompletedChapters /
        publishedChapters.length) *
      100;

    return progressPercentage;
  } catch (error) {
    console.log('[GET_PROGRESS]', error);
    return 0;
  }
};
export const getCourse = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique(
      {
        where: {
          id: id,
        },
        include: {
          attachments: true,
          chapters: {
            orderBy: { position: 'asc' },
          },
          category: true,
        },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course,
    });
  } catch (error) {
    console.log('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching the course. Please try again later.',
      error: error,
    });
  }
};

export const createCourse = async (
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
          'Unauthorized: Only teachers or admins can create a course.',
      });
      return;
    }

    // Create Course
    const newCourse = await prisma.course.create({
      data: {
        userId: user.id,
        teacherName: user.name,
        title: 'Untitled title',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error) {
    console.error(
      'Error creating course:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the course. Please try again later.',
      error: error,
    });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const { id: courseId } = req.params;

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
          'Unauthorized: Only teachers or admins can update a course.',
      });
      return;
    }

    // Find the course to ensure it exists and the user is authorized to update it
    const existingCourse =
      await prisma.course.findUnique({
        where: { id: courseId },
      });

    if (!existingCourse) {
      res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
      return;
    }

    if (
      user.role !== 'ADMIN' &&
      existingCourse.userId !== userId
    ) {
      res.status(403).json({
        success: false,
        message:
          'Unauthorized: You can only update your own courses.',
      });
      return;
    }

    // Find or create the category if necessary
    let categoryId = existingCourse.categoryId;
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
      typeof existingCourse
    > = {
      title:
        title?.trim() || existingCourse.title,
      description:
        description?.trim() ||
        existingCourse.description,
      imageUrl:
        imageUrl?.trim() ||
        existingCourse.imageUrl,
      price:
        price !== undefined && price !== ''
          ? Number(price)
          : existingCourse.price,
      isPublished:
        isPublished ?? existingCourse.isPublished,
      categoryId,
    };

    // Update the course
    const updatedCourse =
      await prisma.course.update({
        where: { id: courseId },
        data: updatedData,
      });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    console.error(
      'Error updating course:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the course. Please try again later.',
      error: error,
    });
  }
};
export const createCourseAttachment = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const userId = req?.user?.id;
  const { name, url } = req.body;
  try {
    if (!userId || !id) {
      res.status(404).json({
        success: false,
        message:
          'User id and course id are required',
      });
      return;
    }
    // Find the course by its ID
    const course = await prisma.course.findUnique(
      {
        where: { id: id },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this course
    if (course.userId !== userId) {
      res.status(403).json({
        success: false,
        message:
          'Not authorized to create attachment',
      });
      return;
    }

    const attachment =
      await prisma.attachment.create({
        data: {
          name,
          url,
          courseId: id,
        },
      });

    res.status(201).json({
      success: true,
      message: 'Attachment created successfully',
      data: attachment, // Optional: Include attachment details if needed
    });
  } catch (error) {
    console.error(
      'Error creating attachment:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the attachment. Please try again later.',
      error: error,
    });
  }
};
export const deleteCourseAttachment = async (
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
          'User id and attachment id are required',
      });
      return;
    }
    // Find the attachment by its ID
    const attachment =
      await prisma.attachment.findUnique({
        where: { id: id },
      });

    if (!attachment) {
      res.status(404).json({
        success: false,
        message: 'Attachment not found',
      });
      return;
    }

    // Delete the attachment
    await prisma.attachment.delete({
      where: { id: id },
    });

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully',
      data: attachment, // Optional: Include attachment details if needed
    });
  } catch (error) {
    console.error(
      'Error deleting attachment:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the attachment. Please try again later.',
      error: error,
    });
  }
};
export const deleteCourse = async (
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
          'User id and course id are required',
      });
      return;
    }
    // Find the course by its ID
    const course = await prisma.course.findUnique(
      {
        where: { id: id },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this course
    if (course.userId !== userId) {
      res.status(403).json({
        success: false,
        message:
          'Not authorized to delete this course',
      });
      return;
    }

    // Delete the course
    await prisma.course.delete({
      where: { id: id },
    });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: course, // Optional: Include course details if needed
    });
  } catch (error) {
    console.error(
      'Error deleting course:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the course. Please try again later.',
      error: error,
    });
  }
};

export const reorderCourseChapters = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const userId = req?.user?.id;
  const list = req.body;
  console.log(req.body);
  try {
    if (!userId || !id) {
      res.status(404).json({
        success: false,
        message:
          'User id and course id are required',
      });
      return;
    }
    // Find the course by its ID
    const course = await prisma.course.findUnique(
      {
        where: { id: id },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this course
    if (course.userId !== userId) {
      res.status(403).json({
        success: false,
        message:
          'Not authorized to reorder chapters',
      });
      return;
    }

    for (let item of list) {
      await prisma.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    res.status(200).json({
      success: true,
      message:
        'Course chapters ordered successfully',
      data: course, // Optional: Include course details if needed
    });
  } catch (error) {
    console.error(
      'Error reordering chapters:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while reordering the chapters. Please try again later.',
      error: error,
    });
  }
};
export const createCourseChapter = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const userId = req?.user?.id;
  const {
    title,
    description,
    content,
    videoUrl,
    isPublished,
    isFree,
  } = req.body;
  try {
    if (!userId || !id) {
      res.status(404).json({
        success: false,
        message:
          'User id and course id are required',
      });
      return;
    }
    // Find the course by its ID
    const course = await prisma.course.findUnique(
      {
        where: { id: id },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this course
    if (course.userId !== userId) {
      res.status(403).json({
        success: false,
        message:
          'Not authorized to create chapter',
      });
      return;
    }
    const lastChapter =
      await prisma.chapter.findFirst({
        where: {
          courseId: id,
        },
        orderBy: {
          position: 'desc',
        },
      });

    const newPosition = lastChapter
      ? lastChapter.position + 1
      : 1;

    const chapter = await prisma.chapter.create({
      data: {
        title,
        description,
        content,
        videoUrl,
        courseId: id,
        position: newPosition,
        isFree,
        isPublished,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: chapter, // Optional: Include chapter details if needed
    });
  } catch (error) {
    console.error(
      'Error creating chapter:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the chapter. Please try again later.',
      error: error,
    });
  }
};
export const updateCourseChapter = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id, chapterId } = req.params;
  const userId = req?.user?.id;
  const {
    title,
    description,
    content,
    videoUrl,
    isPublished,
    isFree,
  } = req.body;
  try {
    if (!userId || !id || !chapterId) {
      res.status(404).json({
        success: false,
        message:
          'User id and course id & chapter id are required',
      });
      return;
    }
    // Find the course by its ID
    const course = await prisma.course.findUnique(
      {
        where: { id: id },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this course
    if (course.userId !== userId) {
      res.status(403).json({
        success: false,
        message:
          'Not authorized to update chapter',
      });
      return;
    }
    const existingChapter =
      await prisma.chapter.findFirst({
        where: {
          courseId: id,
          id: chapterId,
        },
      });

    // Prepare updated data
    const updatedData: Partial<
      typeof existingChapter
    > = {
      title:
        title?.trim() || existingChapter?.title,
      description:
        description?.trim() ||
        existingChapter?.description,
      content:
        content?.trim() ||
        existingChapter?.content,
      videoUrl:
        videoUrl?.trim() ||
        existingChapter?.videoUrl,
      isPublished:
        isPublished ??
        existingChapter?.isPublished,
      isFree: isFree ?? existingChapter?.isFree,
    };
    const chapter = await prisma.chapter.update({
      where: { courseId: id, id: chapterId },
      data: updatedData,
    });

    res.status(200).json({
      success: true,
      message: 'Chapter updated successfully',
      data: chapter, // Optional: Include chapter details if needed
    });
  } catch (error) {
    console.error(
      'Error updating chapter:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the chapter. Please try again later.',
      error: error,
    });
  }
};
export const getCourseChapter = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id, chapterId } = req.params;
  const userId = req?.user?.id;

  try {
    if (!userId || !id || !chapterId) {
      res.status(404).json({
        success: false,
        message:
          'User id and course id & chapter id are required',
      });
      return;
    }
    // Find the course by its ID
    const course = await prisma.course.findUnique(
      {
        where: { id: id },
      }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    // Check if the logged-in user is the teacher for this course
    if (course.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to get chapter',
      });
      return;
    }
    const chapter =
      await prisma.chapter.findFirst({
        where: {
          courseId: id,
          id: chapterId,
        },
      });
    console.log({ chapter });
    res.status(200).json({
      success: true,
      message: 'Chapter retrieved successfully',
      data: chapter, // Optional: Include chapter details if needed
    });
  } catch (error) {
    console.error(
      'Error retrieving chapter:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while retrieving the chapter. Please try again later.',
      error: error,
    });
  }
};

export const updateUserCourseProgress = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { chapterId } = req.params;
  const userId = req?.user?.id;
  const { isCompleted } = req.body;
  try {
    // Check if userId and chapterId are provided
    if (!userId || !chapterId) {
      res.status(400).json({
        success: false,
        message:
          'User id and chapter id are required',
      });
      return;
    }

    // Update the user progress for the specified chapter
    const updatedProgress =
      await prisma.userProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
        update: {
          isCompleted,
        },
        create: {
          userId,
          chapterId,
          isCompleted,
        },
      });
    console.log({ updatedProgress });
    res.status(200).json({
      success: true,
      message:
        'User progress updated successfully',
      data: updatedProgress,
    });
  } catch (error) {
    console.error(
      'Error updating user progress:',
      error
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating user progress. Please try again later.',
      error: error,
    });
  }
};
