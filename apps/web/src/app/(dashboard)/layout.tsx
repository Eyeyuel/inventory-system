import { AppSidebar } from '@/components/app-sidebar';
import AppBreadCrumbs from '@/components/appBreadCrumbs';
import { RightSidebar } from '@/components/dashboard/right-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Main area: left sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <AppBreadCrumbs />
            </header>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* Sticky right sidebar */}
      <div className="sticky top-0 h-screen shrink-0 border-l bg-background">
        <RightSidebar />
      </div>
    </div>
  );
}

// // app/(dashboard)/layout.tsx

// import { AppSidebar } from '@/components/app-sidebar';
// import AppBreadCrumbs from '@/components/appBreadCrumbs';
// import { RightSidebar } from '@/components/dashboard/right-sidebar';
// import { Separator } from '@/components/ui/separator';
// import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen w-screen overflow-hidden">
//     <div className="flex h-screen w-screen overflow-y-auto overflow-x-hidden">
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset>
//           <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
//             <AppBreadCrumbs />
//           </header>
//           {/* 👇 children render the actual page content */}
//           <div className="flex flex-1 flex-col">
//             <div className="@container/main flex flex-1 flex-col gap-2">
//               <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
//             </div>
//           </div>
//           {/* <main className="flex-1 p-4">{children}</main> */}
//         </SidebarInset>
//         <div className="ml-auto">
//           <RightSidebar />
//         </div>
//       </SidebarProvider>
//     </div>
//     </div>

//   );
// }
