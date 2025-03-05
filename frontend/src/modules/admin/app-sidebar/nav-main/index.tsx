'use client';

import { ChevronRight } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { SidebarNavItemProps } from '@/modules/admin/constants';
import { usePathname } from 'next/navigation';

export function NavMain({
  menuItems,
}: {
  menuItems: SidebarNavItemProps[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(
            item.url
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className='group/collapsible'
            >
              <SidebarMenuItem
                className={cn(
                  'rounded-md',
                  isActive && 'bg-gray-200'
                )}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className='hover:bg-gray-200 h-10'
                    tooltip={item.title}
                  >
                    {item.items &&
                    item.items.length > 0 ? (
                      <>
                        {item.icon && (
                          <item.icon className='h-5 w-5' />
                        )}
                        <span>{item.title}</span>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </>
                    ) : (
                      <a
                        href={item.url}
                        className='flex items-center gap-2'
                      >
                        {item.icon && (
                          <item.icon className='h-5 w-5 text-gray-700' />
                        )}
                        <span className='text-gray-800'>
                          {item.title}
                        </span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item?.items &&
                  item?.items?.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map(
                          (subItem) => (
                            <SidebarMenuSubItem
                              key={subItem.title}
                            >
                              <SidebarMenuSubButton
                                asChild
                              >
                                <a
                                  href={
                                    subItem.url
                                  }
                                >
                                  <span>
                                    {
                                      subItem.title
                                    }
                                  </span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
