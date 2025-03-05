import { auth } from '@/auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/modules/admin/app-sidebar';

import DashboardWrapper from './dashboard-wrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) return;

  return (
    <SidebarProvider>
      <div className='dashboard min-h-screen w-full flex z-30'>
        <AppSidebar session={session} />
        {/* <h1>Sidebar</h1> */}
        <DashboardWrapper>
          {children}
        </DashboardWrapper>
      </div>
    </SidebarProvider>
  );
}
