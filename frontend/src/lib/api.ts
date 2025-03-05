'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import config from './config';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const revalidateCourses = async () => {
  revalidatePath('/courses');
  revalidatePath('/user/search');
  revalidatePath('/user/dashboard');
  revalidatePath(
    '/course/[courseId]/chapters/[chapterId]'
  );
};

async function fetchServerAction<T>(
  endpoint: string,
  useSession: boolean = false
): Promise<ApiResponse<T>> {
  try {
    let token: string | undefined = undefined;

    if (useSession) {
      const session = await auth();

      if (!session) {
        return {
          success: false,
          message: 'Not signed in',
          data: {} as T,
        };
      }

      token = session.accessToken;
    }

    const options: RequestInit = {
      next: { revalidate: 1 },
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }), // Include token only if available
      },
    };

    const response = await fetch(
      `${config.env.baseUrl}/${endpoint}`,
      options
    );

    const result: ApiResponse<T> =
      await response.json();

    if (!response.ok) {
      const errorText =
        result.message || 'Unknown error';
      console.error(
        'Server action failed:',
        errorText
      );
      throw new Error(
        `Server action failed. Status: ${response.status}, Error: ${errorText}`
      );
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error(
      'Error during server action:',
      error
    );
    return {
      success: false,
      message:
        'An error occurred during the server action.',
      data: {} as T, // Fallback to an empty object of type T
    };
  }
}

export const fetchGallery = async (): Promise<
  ApiResponse<Gallery[]>
> => {
  return await fetchServerAction<Gallery[]>(
    'gallery'
  );
};

export const fetchUsers = async (): Promise<
  ApiResponse<User[]>
> => {
  return await fetchServerAction<User[]>('users');
};
export const fetchStudents = async (): Promise<
  ApiResponse<Student[]>
> => {
  return await fetchServerAction<Student[]>(
    'users/students'
  );
};

export const fetchCourses = async (): Promise<
  ApiResponse<Course[]>
> => {
  return await fetchServerAction<Course[]>(
    'courses'
  );
};
export const fetchTransactions =
  async (): Promise<
    ApiResponse<Transaction[]>
  > => {
    return await fetchServerAction<Transaction[]>(
      'transactions'
    );
  };

export const fetchCourse = async (
  id: string
): Promise<ApiResponse<Course>> => {
  return await fetchServerAction<Course>(
    `courses/${id}`
  );
};

export const fetchCategories = async (): Promise<
  ApiResponse<Category>
> => {
  return await fetchServerAction<Category>(
    `courses/categories`
  );
};
export const fetchCourseById = async (
  id: string
): Promise<ApiResponse<Course>> => {
  return await fetchServerAction<Course>(
    `courses/${id}`
  );
};
export const fetchUserProgress =
  async (): Promise<
    ApiResponse<UserCourseProgress>
  > => {
    return await fetchServerAction<UserCourseProgress>(
      `courses/user-progress`,
      true
    );
  };
export const fetchUserCourseProgress = async (
  id: string
): Promise<ApiResponse<number>> => {
  return await fetchServerAction<number>(
    `courses/${id}/user-course-progress`,
    true
  );
};
export const fetchCourseChapter = async (
  courseId: string,
  chapterId: string
): Promise<ApiResponse<Chapter>> => {
  return await fetchServerAction<Chapter>(
    `courses/${courseId}/course-chapters/${chapterId}`,
    true
  );
};
export const fetchPublishedCoursesWithUserProgress =
  async (
    title?: string,
    categoryId?: string
  ): Promise<ApiResponse<CourseProgress>> => {
    const queryParams = new URLSearchParams();

    if (title) queryParams.append('title', title);
    if (categoryId)
      queryParams.append(
        'categoryId',
        categoryId
      );

    const url = `courses/published-courses-with-progress?${queryParams.toString()}`;

    return await fetchServerAction<CourseProgress>(
      url,
      true
    );
  };
export const fetchPublishedCourses = async (
  title?: string,
  categoryId?: string
): Promise<ApiResponse<Course[]>> => {
  const queryParams = new URLSearchParams();

  if (title) queryParams.append('title', title);
  if (categoryId)
    queryParams.append('categoryId', categoryId);

  const url = `courses/published-courses?${queryParams.toString()}`;

  return await fetchServerAction<Course[]>(url);
};

export const fetchPublishedCourseProgress =
  async (
    id: string
  ): Promise<ApiResponse<Course>> => {
    return await fetchServerAction<Course>(
      `courses/${id}/published-courses-progress`,
      true
    );
  };

export const fetchPurchasedCourse = async (
  id: string
): Promise<ApiResponse<Course>> => {
  return await fetchServerAction<Course>(
    `courses/${id}/purchased-course`,
    true
  );
};
export const fetchPublishedCourse = async (
  id: string
): Promise<ApiResponse<Course>> => {
  return await fetchServerAction<Course>(
    `courses/${id}/published-course`,
    true
  );
};
export const fetchPublishedOrFreeChapter = async (
  courseId: string,
  chapterId: string
): Promise<
  ApiResponse<ChapterCourseProgress>
> => {
  return await fetchServerAction<ChapterCourseProgress>(
    `courses/${courseId}/chapters/${chapterId}`,
    true
  );
};
