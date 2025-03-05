'use client';

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function NavUser({
  session,
}: {
  session: Session;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const profileLink =
    session?.role === 'ADMIN'
      ? `/admin/profile`
      : `/user/profile`;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='mb-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                {session?.user?.image && (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.name}
                  />
                )}
                <AvatarFallback className='rounded-lg'>
                  {session?.user?.name
                    ? session.user.name
                        .charAt(0)
                        .toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {session.name}
                </span>
                <span className='truncate text-xs'>
                  {session.email}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  {session?.user?.image && (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.name}
                    />
                  )}
                  <AvatarFallback className='rounded-lg'>
                    {session?.user?.name
                      ? session.user.name
                          .charAt(0)
                          .toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {session.name}
                  </span>
                  <span className='truncate text-xs'>
                    {session.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  router.push(profileLink)
                }
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  signOut({ callbackUrl: '/' })
                }
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
