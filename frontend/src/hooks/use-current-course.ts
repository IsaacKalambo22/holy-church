import { fetchCourse } from '@/lib/api';

export const useCurrentCourse = async (
  courseId: string
) => {
  try {
    const res = await fetchCourse(courseId); // Ensure the API call is awaited
    const course = res.data;
    console.log({ course });
    return course;
  } catch (error) {
    console.error(
      'Error fetching course:',
      error
    );
    return null; // Return `null` or handle the error as needed
  }
};
