'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] =
    React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <activeTeam.logo className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {/* {activeTeam.name} */}
                  Identity Impact Hub
                </span>
                <span className='truncate text-xs'>
                  {/* {activeTeam.plan} */}
                  Revealing the hidden potential
                </span>
              </div>
              {/* <ChevronsUpDown className='ml-auto' /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() =>
                  setActiveTeam(team)
                }
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <team.logo className='size-4 shrink-0' />
                </div>
                {team.name}
                <DropdownMenuShortcut>
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>
                Add team
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// 'use client';

// import { Button } from '@/components/ui/button';
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from '@/components/ui/sidebar';
// import { X } from 'lucide-react';
// import Image from 'next/image';

// export function TeamSwitcher() {
//   const { toggleSidebar } = useSidebar();

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <SidebarMenuButton
//           size='lg'
//           onClick={() => toggleSidebar()}
//           className='group hover:bg-gray-200'
//         >
//           <div className='flex justify-between items-center gap-5 pr-1 h-10 w-full group-data-[collapsible=icon]:ml-1 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-0 group'>
//             <div className='flex items-center gap-5'>
//               <Image
//                 src='/assets/images/logo.png'
//                 alt='logo'
//                 width={25}
//                 height={20}
//                 className='transition duration-200 group-data-[collapsible=icon]:group-hover:brightness-75 w-auto'
//               />
//               <p className='app-sidebar__title'>
//                 Identity Impact Hub
//               </p>
//             </div>
//             <Button
//               variant='ghost'
//               size='icon'
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 toggleSidebar();
//               }}
//               className='sm:hidden'
//             >
//               <X className='text-gray-700 w-5 h-5 group-data-[collapsible=icon]:hidden' />
//             </Button>
//           </div>
//         </SidebarMenuButton>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
