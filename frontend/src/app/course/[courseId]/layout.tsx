import { auth } from '@/auth';
import { SidebarProvider } from '@/components/ui/sidebar';

import {
  fetchPublishedCourseProgress,
  fetchPurchasedCourse,
} from '@/lib/api';
import { AppSidebar } from '@/modules/user/app-sidebar';
import DashboardWrapper from './dashboard-wrapper';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const session = await auth();
  console.log({ session });
  if (!session) return;

  const { courseId } = await params;
  const response =
    await fetchPublishedCourseProgress(courseId);

  const purchasedCourseData =
    await fetchPurchasedCourse(courseId);
  const course = response.data;
  const purchasedCourse =
    purchasedCourseData.data;

  return (
    <SidebarProvider>
      <div className='dashboard min-h-screen w-full flex z-30'>
        <AppSidebar
          session={session}
          course={course}
          purchasedCourse={purchasedCourse}
        />
        <DashboardWrapper>
          {children}
        </DashboardWrapper>
      </div>
    </SidebarProvider>
  );
}
