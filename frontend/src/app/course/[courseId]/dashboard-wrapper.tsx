'use client';

import { cn } from '@/lib/utils';
import Navbar from '@/modules/admin/navbar';

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex  w-full min-h-screen flex-1 overflow-hidden'>
      <div
        className={cn(
          'flex-grow min-h-screen transition-all duration-500 ease-in-out overflow-y-auto'
        )}
        style={{ height: '100vh' }}
      >
        <Navbar />
        <main className='px-8 py-4'>
          {children}
        </main>
      </div>
    </div>
  );
}
