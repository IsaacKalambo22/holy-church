'use server';

import { auth } from '@/auth';
import config from '@/lib/config';
import { revalidatePath } from 'next/cache';

export const serverAction = async (
  endpoint: string,
  method:
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'DELETE',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any> | null = null,
  revalidatePaths: string[] = [],
  useSession: boolean = true // Default to true
) => {
  try {
    let token: string | undefined = undefined;

    if (useSession) {
      const session = await auth();

      if (!session) {
        return {
          success: false,
          error: 'Not signed in',
        };
      }

      token = session.accessToken;
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }), // Include token only if available
      },
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(
      `${config.env.baseUrl}/${endpoint}`,
      options
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.message ||
          'Something went wrong',
      };
    }

    // Revalidate specified paths
    for (const path of revalidatePaths) {
      revalidatePath(path);
    }

    return { success: true, ...result };
  } catch (error) {
    // General error handling
    console.log(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
    };
  }
};

export const sendContactMessage = async (
  payload: object
) => {
  return await serverAction(
    'users/contact-email',
    'POST',
    payload,
    [],
    false
  );
};

// USERS SERVER ACTIONS
export const createUser = async (
  payload: object,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    'auth/register',
    'POST',
    payload,
    [fullPath, layout] // Revalidate paths
  );
};

export const updateUser = async (
  payload: object,
  userId: string,
  fullPath: string
) => {
  return await serverAction(
    `users/${userId}`,
    'PATCH',
    payload,
    [fullPath]
  );
};

export const deleteUser = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `users/${id}`,
    'DELETE',
    null,
    [fullPath, layout]
  );
};

// Course SERVER ACTIONS
export const createStripePaymentIntent = async (
  payload: object
) => {
  return await serverAction(
    'transactions/stripe/payment-intent',
    'POST',
    payload
  );
};
export const createTransaction = async (
  payload: object
) => {
  return await serverAction(
    'transactions',
    'POST',
    payload
  );
};

// Course SERVER ACTIONS
export const createCourse = async (
  payload: object,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    'courses',
    'POST',
    payload,
    [fullPath, layout] // Revalidate paths
  );
};

export const updateCourse = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `courses/${id}`,
    'PATCH',
    payload,
    [fullPath]
  );
};
export const reorderCourseChapters = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `courses/${id}/chapters/reorder`,
    'PATCH',
    payload,
    [fullPath]
  );
};
export const createCourseChapter = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `courses/${id}/chapters`,
    'POST',
    payload,
    [fullPath]
  );
};
export const createCourseAttachment = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `courses/${id}/attachments`,
    'POST',
    payload,
    [fullPath]
  );
};
export const deleteCourseAttachment = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `courses/attachments/${id}`,
    'DELETE',
    [fullPath, layout]
  );
};
export const updateCourseChapter = async (
  payload: object,
  courseId: string,
  chapterId: string,
  fullPath: string
) => {
  return await serverAction(
    `courses/${courseId}/chapters/${chapterId}`,
    'PATCH',
    payload,
    [fullPath]
  );
};
export const updateUserCourseProgress = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `courses/chapters/${id}/progress`,
    'PATCH',
    payload,
    [fullPath]
  );
};

export const deleteCourse = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `courses/${id}`,
    'DELETE',
    null,
    [fullPath, layout]
  );
};
export const getUploadVideoUrl = async (
  courseId: string,
  sectionId: string,
  chapterId: string,
  fileName: string,
  fileType: string
) => {
  const payload = { fileName, fileType };
  return await serverAction(
    `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
    'POST',
    payload
  );
};
export const getUploadFileUrl = async (
  fileName: string,
  fileType: string
) => {
  const payload = { fileName, fileType };
  return await serverAction(
    `courses/upload-file/get-upload-url`,
    'POST',
    payload
  );
};

// USERS SERVER ACTIONS
export const createStudent = async (
  payload: object,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    'users/students',
    'POST',
    payload,
    [fullPath, layout] // Revalidate paths
  );
};

export const updateStudent = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `users/students/${id}`,
    'PATCH',
    payload,
    [fullPath]
  );
};

export const deleteStudent = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `users/students/${id}`,
    'DELETE',
    null,
    [fullPath, layout]
  );
};

// GALLERY SERVER ACTIONS
export const createGallery = async (
  payload: object,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    'gallery',
    'POST',
    payload,
    [fullPath, layout] // Revalidate paths
  );
};

export const updateGallery = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `gallery/${id}`,
    'PATCH',
    payload,
    [fullPath]
  );
};

export const deleteGallery = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `gallery/${id}`,
    'DELETE',
    null,
    [fullPath, layout]
  );
};

// Sermon SERVER ACTIONS
export const createSermon = async (
  payload: object,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    'sermons',
    'POST',
    payload,
    [fullPath, layout, '/sermons'] // Revalidate paths
  );
};

export const updateSermon = async (
  payload: object,
  id: string,
  fullPath: string
) => {
  return await serverAction(
    `sermons/${id}`,
    'PATCH',
    payload,
    [fullPath, '/sermons', `/sermons/${id}`]
  );
};

export const deleteSermon = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `sermons/${id}`,
    'DELETE',
    null,
    [fullPath, layout, '/sermons']
  );
};

export const publishSermon = async (
  id: string,
  isPublished: boolean,
  fullPath: string
) => {
  return await serverAction(
    `sermons/${id}/publish`,
    'PATCH',
    { isPublished },
    [fullPath, '/sermons', `/sermons/${id}`]
  );
};
