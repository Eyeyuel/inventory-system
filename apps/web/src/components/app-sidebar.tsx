'use client';
import * as React from 'react';

import { SearchForm } from '@/components/search-form';
import { ProfileSwitcher } from '@/components/version-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const data = {
  navMain: [
    {
      title: 'GENERAL',
      url: '#',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
        },
        {
          title: 'Sales Order',
          url: '/shipment',
        },
        {
          title: 'Stock',
          url: '/stock',
        },
        {
          title: 'Locations',
          url: '/locations',
        },
        {
          title: 'Products',
          url: '/products',
        },
        {
          title: 'Purchase Order',
          url: '/purchase',
        },
        {
          title: 'Reports',
          url: '/reports',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // try {
  //   const profileInfo = await getProfile();
  //   console.log(profileInfo);
  // } catch (error) {
  //   console.log('getProfile error:', error);
  // }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ProfileSwitcher />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={item.url}>{item.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
