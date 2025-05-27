import { fetchCourseById } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import EditCourse from '@/modules/admin/courses/edit-course';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Details - Holy Church Assembly',
  description:
    'Enroll the latest courses from Holy Church Assembly.',
};

interface Props {
  params: {
    id: string; // The course ID will be passed as a string in the params
  };
}

const CourseDetailsPage = async ({
  params,
}: Props) => {
  const id = (await params).id; // Extract the course ID from the params

  let course: Course | null = null;
  try {
    const response = await fetchCourseById(id);

    course = response?.data;
  } catch (error) {
    console.log('Failed to fetch course:', error);
    return (
      <div>
        <AddNewHeader name='Edit Course' />
        <p className='text-red-500'>
          Failed to load course. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full mb-20 '>
      <AddNewHeader name='Edit Course' />
      {course ? (
        <EditCourse course={course} />
      ) : (
        <p className='text-gray-500 text-lg mt-5 text-center'>
          Course not found
        </p>
      )}
    </div>
  );
};

export default CourseDetailsPage;
