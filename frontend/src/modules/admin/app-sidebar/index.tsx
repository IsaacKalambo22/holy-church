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
import { Session } from 'next-auth';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar({
  session,
}: {
  session: Session;
}) {
  const sidebar =
    session?.role === 'ADMIN'
      ? ADMIN_SIDEBAR_DATA
      : USER_SIDEBAR_DATA;

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <TeamSwitcher teams={sidebar.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain menuItems={sidebar.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
