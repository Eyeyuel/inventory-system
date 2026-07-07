'use client';

import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { CaretUpDownIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react';

import { getProfile } from '@/services/client/profile';
import { logout } from '@/services/client/user';

export function ProfileSwitcher() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const fullName = React.useMemo(() => {
    if (!profile) return '';
    return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
  }, [profile]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                {profile?.image ? (
                  <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="size-4" />
                )}
              </div>

              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">
                  {isLoading ? 'Loading...' : fullName || 'Unknown user'}
                </span>

                <span className="text-xs text-muted-foreground">
                  {profile?.userName ?? 'No username'}
                </span>
              </div>

              <CaretUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
            <form action={logout}>
              <button className="w-full text-left">
                <DropdownMenuItem asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <SignOutIcon className="size-4" />
                    Logout
                  </div>
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// 'use client';

// import * as React from 'react';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { CaretUpDownIcon, CheckIcon, RowsIcon } from '@phosphor-icons/react';

// export function VersionSwitcher({
//   versions,
//   defaultVersion,
// }: {
//   versions: string[];
//   defaultVersion: string;
// }) {
//   const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion);

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//                 <RowsIcon className="size-4" />
//               </div>
//               <div className="flex flex-col gap-0.5 leading-none">
//                 <span className="font-medium">user 1</span>
//                 <span className="">v{selectedVersion}</span>
//               </div>
//               <CaretUpDownIcon className="ml-auto" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
//             {versions.map((version) => (
//               <DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
//                 v{version} {version === selectedVersion && <CheckIcon className="ml-auto" />}
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
