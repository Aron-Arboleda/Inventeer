import {
  AudioWaveform,
  Boxes,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  NotepadText,
  Settings,
  ShoppingCart,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { StoreSwitcher } from "~/components/store-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

// This is sample data.
const data = {
  stores: [
    {
      name: "Trackerteer",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Trackerteer Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Trackerteer Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Generator",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Bulk Generator",
      url: "/dashboard/bulk-generator",
      icon: Boxes,
    },
    // {
    //   title: "Orders",
    //   url: "/dashboard/orders",
    //   icon: ShoppingCart,
    // },
    // {
    //   title: "Reports",
    //   url: "#",
    //   icon: NotepadText,
    //   items: [
    //     {
    //       title: "Overview",
    //       url: "#",
    //     },
    //     {
    //       title: "Sales",
    //       url: "#",
    //     },
    //     {
    //       title: "Refunds",
    //       url: "#",
    //     },
    //     {
    //       title: "Inventory",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Appearance",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <StoreSwitcher stores={data.stores} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
