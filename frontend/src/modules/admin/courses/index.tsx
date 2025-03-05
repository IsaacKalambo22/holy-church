import { fetchCourses } from '@/lib/api';
import AddNewHeader from '../add-new-header';
import CoursesList from './course-list';

const Courses = async () => {
  let courses = [];
  try {
    const data = await fetchCourses(); // Fetch the data directly
    courses = data?.data;
  } catch (error) {
    console.error(
      'Failed to fetch courses:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Courses'
          buttonName='New Course'
        />
        <p className='text-red-500'>
          Failed to load courses.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Courses'
        buttonName='New Course'
      />
      {courses.length > 0 ? (
        <CoursesList courses={courses} />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No courses available. Create a new
          courses to get started!
        </p>
      )}
    </div>
  );
};

export default Courses;
