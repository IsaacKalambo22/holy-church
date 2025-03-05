export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import {
  fetchCategories,
  fetchPublishedCoursesWithUserProgress,
} from '@/lib/api';
import { SearchInput } from '@/modules/common/search-input';
import { Categories } from '@/modules/user/browse-courses/categories';
import { CoursesList } from '@/modules/user/courses/course-list';
import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({
  searchParams,
}: SearchPageProps) => {
  try {
    const session = await auth();

    if (!session) {
      return redirect('/');
    }

    const { title, categoryId } =
      await searchParams;

    // Fetch data in parallel for better performance
    const [categoriesData, coursesData] =
      await Promise.all([
        fetchCategories(),
        fetchPublishedCoursesWithUserProgress(
          title,
          categoryId
        ),
      ]);

    if (
      !categoriesData.success ||
      !coursesData.success
    ) {
      throw new Error(
        'Failed to fetch categories or courses.'
      );
    }

    const categories: Category[] = Array.isArray(
      categoriesData.data
    )
      ? categoriesData.data
      : [];
    const courses: CourseProgress[] =
      Array.isArray(coursesData.data)
        ? coursesData.data
        : [];

    return (
      <>
        <div className='px-6 pt-6 '>
          <SearchInput />
        </div>
        <div className='p-6 space-y-4'>
          <Categories items={categories} />
          <CoursesList items={courses} />
        </div>
      </>
    );
  } catch (error) {
    console.error(
      'Error loading search page:',
      error
    );

    return (
      <div className='p-6 space-y-4 text-center'>
        <p className='text-red-500'>
          There was an error loading the page.
          Please try again later.
        </p>
      </div>
    );
  }
};

export default SearchPage;
