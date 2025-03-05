'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  ADMIN_SIDEBAR_DATA,
  USER_SIDEBAR_DATA,
} from '@/modules/admin/constants';
import {
  CheckCircle,
  Lock,
  Play,
} from 'lucide-react';
import { Session } from 'next-auth';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar({
  session,
  course,
  purchasedCourse,
}: {
  session: Session;
  course: Course;
  purchasedCourse: Course;
}) {
  const sidebar =
    session?.role === 'ADMIN'
      ? ADMIN_SIDEBAR_DATA
      : USER_SIDEBAR_DATA;

  const chapterNavItems =
    course?.chapters?.map((chapter) => ({
      title: chapter.title,
      url: `/course/${course.id}/chapters/${chapter.id}`,
      icon:
        !chapter?.isFree && !purchasedCourse
          ? Lock
          : !!chapter?.userProgress?.[0]
              ?.isCompleted
          ? CheckCircle
          : Play,
    })) || [];

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <TeamSwitcher teams={sidebar.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain menuItems={chapterNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
