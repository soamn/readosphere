import {
  IceCream,
  Home,
  LayoutGrid,
  LogOut,
  DoorOpen,
  HandHeart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { verifyAuthToken } from "@/utils/auth";
import { cookies } from "next/headers";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "create",
    url: "/admin/editor",
    icon: IceCream,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: LayoutGrid,
  },
  {
    title: "Recommendations",
    url: "/admin/recommendations",
    icon: HandHeart,
  },
  {
    title: "Home Page",
    url: "/admin/home",
    icon: HandHeart,
  },
];

export function AppSidebar({ user }: { user: any }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg">
            {" "}
            {user?.name}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem key="logout">
                <SidebarMenuButton
                  asChild
                  className="text-red-500 hover:text-red-500"
                >
                  <a href="/api/auth/logout">
                    <DoorOpen />
                    <span>Logout</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
