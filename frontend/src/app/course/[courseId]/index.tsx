import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  fetchPublishedCourseProgress,
  fetchUserCourseProgress,
} from '@/lib/api';
import Navbar from '@/modules/admin/navbar';
import { CourseSidebar } from '@/modules/user/courses/sidebar/course-sidebar';

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const session = await auth();
  const { courseId } = params;
  if (!session) {
    return redirect('/');
  }

  // Fetch data in parallel for better performance
  const [courseData, progressData] =
    await Promise.all([
      fetchPublishedCourseProgress(courseId),
      fetchUserCourseProgress(courseId),
    ]);
  console.log(progressData.data);
  const course = courseData.data;
  const progress = progressData.data;

  if (!course) {
    return redirect('/');
  }

  return (
    <SidebarProvider>
      <div className='h-full'>
        <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
          {/* <CourseNavbar
          course={course}
          progressCount={progress}
          // currentProfile={safeProfile}
        /> */}

          <Navbar />
        </div>
        <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
          <CourseSidebar
            course={course}
            progressCount={progress}
          />
        </div>
        <main className='md:pl-80 pt-[80px] h-full'>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CourseLayout;
