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

export function SidebarWrapper({ children, pageTitle }: SidebarWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
        </div>
        <div className="flex flex-1 flex-col gap-4 w-full h-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
