export const dynamic = 'force-dynamic';

import {
  fetchCategories,
  fetchPublishedCourses,
} from '@/lib/api';
import Courses from '@/modules/client/courses';
import CoursesHeader from '@/modules/client/courses/courses-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses | Identity Impact Hub',
  description:
    'Explore our diverse range of courses designed to empower changemakers, entrepreneurs, and social impact leaders.',
  keywords: [
    'Identity Impact Hub Courses',
    'Entrepreneurship Training',
    'Social Impact Education',
    'Business Growth Workshops',
    'Innovation Hub Learning',
    'Online Courses for Entrepreneurs',
  ],
  openGraph: {
    title: 'Courses | Identity Impact Hub',
    description:
      'Discover transformative courses at Identity Impact Hub, designed to foster innovation, entrepreneurship, and sustainable impact.',
    url: 'https://identityimpacthub.com/courses',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/courses-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Courses',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface Props {
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}

const ClientCoursesPage = async ({
  searchParams,
}: Props) => {
  try {
    const { title, categoryId } =
      await searchParams; // No need to await

    // Fetch data in parallel for better performance
    const [categoriesData, coursesData] =
      await Promise.all([
        fetchCategories(),
        fetchPublishedCourses(
          title || '',
          categoryId || ''
        ),
      ]);

    const categories: Category[] = Array.isArray(
      categoriesData.data
    )
      ? categoriesData.data
      : [];
    const courses: Course[] = Array.isArray(
      coursesData.data
    )
      ? coursesData.data
      : [];

    if (
      !categoriesData.success ||
      !coursesData.success
    ) {
      console.error('Error fetching data:', {
        categoriesError: categoriesData.message,
        coursesError: coursesData.message,
      });
      return (
        <div className='flex flex-col items-center gap-10 mb-16'>
          <CoursesHeader />
          <div className='text-red-500 text-center'>
            {categoriesData.message ||
              'Failed to load categories.'}{' '}
            <br />
            {coursesData.message ||
              'Failed to load courses.'}
          </div>
        </div>
      );
    }

    // if (courses.length === 0) {
    //   return (
    //     <div className='flex flex-col items-center gap-10 mb-16'>
    //       <CoursesHeader />
    //       <div className='text-gray-500 text-center text-xl'>
    //         No courses available at the moment.
    //         Please check back later.
    //       </div>
    //     </div>
    //   );
    // }

    return (
      <div className='flex flex-col items-center gap-10 mb-16'>
        <CoursesHeader />
        <Courses
          courses={courses}
          categories={categories}
        />
      </div>
    );
  } catch (error) {
    console.error(
      'Unexpected error fetching courses:',
      error
    );
    return (
      <div className='flex flex-col items-center gap-10 mb-16'>
        <CoursesHeader />
        <div className='text-red-500 text-center'>
          An unexpected error occurred while
          fetching courses. <br />
          Please try again later.
        </div>
      </div>
    );
  }
};

export default ClientCoursesPage;
