// components/layouts/sidebar/sidebar-wrapper.tsx
import { AppSidebar } from "./sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
}

function SidebarWrapper({ children, pageTitle }: SidebarWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* SidebarInset must be full-height / flex column so children can flex correctly */}
      <SidebarInset className="flex-1 min-h-0 flex flex-col m-0 p-0">
        {/* top appbar */}
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
        </div>

        <div className="flex-1 min-h-0 flex flex-col m-0 p-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { SidebarWrapper };
export default SidebarWrapper;
