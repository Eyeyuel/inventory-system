// app/(dashboard)/layout.tsx

import { AppSidebar } from '@/components/app-sidebar';
import AppBreadCrumbs from '@/components/appBreadCrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <AppBreadCrumbs />
          </header>
          {/* 👇 children render the actual page content */}
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
            </div>
          </div>
          {/* <main className="flex-1 p-4">{children}</main> */}
        </SidebarInset>
      </SidebarProvider>
      <div>something</div>
    </div>
  );
}
