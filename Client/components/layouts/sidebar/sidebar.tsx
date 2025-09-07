"use client";

import * as React from "react";
import Image from "next/image";
import {
  Home,
  Users,
  Trophy,
  FileText,
  TrendingUp,
  LogOut,
  Coins,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { signOut, useSession } from "next-auth/react";

// Website and navigation data
const data = {
  website: {
    name: "CodeChef VITC",
    logo: "/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: Users,
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: Coins,
    },
    {
      title: "Requests",
      url: "/dashboard/requests",
      icon: FileText,
    },
    {
      title: "Contributions",
      url: "/dashboard/contributions",
      icon: TrendingUp,
    },
    {
      title: "Leaderboard",
      url: "/dashboard/leaderboard",
      icon: Trophy,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  // Add keyboard shortcut for Ctrl + B
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  // Create user data from session
  const userData = session?.user
    ? {
        name: `${session.user.first_name} ${session.user.last_name}`,
        role: session.user.is_lead ? "Lead" : "Member",
        avatar: `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
          `${session.user.first_name?.trim() || ""}+${
            session.user.last_name?.trim() || ""
          }`
        )}`,
      }
    : null;

  const navItems = data.navMain.filter((item) => {
    if (
      !session?.user?.is_lead &&
      (item.title === "Members" ||
        item.title === "Tasks" ||
        item.title === "Requests")
    ) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader
          name="CodeChef-VITCC"
          Logo={
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt="Club Logo"
              className="p-1"
            />
          }
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            <SidebarMenuButton tooltip={"logout"}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* User Info */}
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
    </Sidebar>
  );
}
