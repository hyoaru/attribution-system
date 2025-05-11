import * as React from "react";
import { useContext } from "react";
import {
    BookOpen,
    BookText,
    BookUser,
    Frame,
    Map,
    PieChart,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarContext,
} from "@/components/ui/sidebar";
import GadLogo from "../assets/gad.jpg";

const data = {
    user: {
        name: "Apol Capuno",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Attributed Program",
            url: "#",
            icon: BookText,
            isActive: true,
            items: [
                {
                    title: "Agriculture and Agrarian Reform Projects",
                    url: "#",
                },
                {
                    title: "Natural Resource Management Projects",
                    url: "#",
                },
                {
                    title: "Private Sector Development Projects",
                    url: "#",
                },
                {
                    title: "Health Projects",
                    url: "#",
                },
                {
                    title: "Housing and Settlement Projects",
                    url: "#",
                },
                {
                    title: "Women in Areas Under Armed Conflict",
                    url: "#",
                },
                {
                    title: "Justice Projects",
                    url: "#",
                },
                {
                    title: "ICT Projects",
                    url: "#",
                },
                {
                    title: "Micro Finance Projects",
                    url: "#",
                },
                {
                    title: "Employment and Work Related Projects",
                    url: "#",
                },
                {
                    title: "Child Labor Projects",
                    url: "#",
                },
                {
                    title: " Labor Migration Projects",
                    url: "#",
                },
                {
                    title: " Energy Sector",
                    url: "#",
                },
            ],
        },
        {
            title: "Client Focused Programs",
            url: "#",
            icon: BookUser,
            items: [
                {
                    title: "Agriculture and Agrarian Reform Projects",
                    url: "#",
                },
                {
                    title: "Natural Resource Management Projects",
                    url: "#",
                },
                {
                    title: "Private Sector Development Projects",
                    url: "#",
                },
                {
                    title: "Health Projects",
                    url: "#",
                },
                {
                    title: "Housing and Settlement Projects",
                    url: "#",
                },
                {
                    title: "Women in Areas Under Armed Conflict",
                    url: "#",
                },
                {
                    title: "Justice Projects",
                    url: "#",
                },
                {
                    title: "ICT Projects",
                    url: "#",
                },
                {
                    title: "Micro Finance Projects",
                    url: "#",
                },
                {
                    title: "Employment and Work Related Projects",
                    url: "#",
                },
                {
                    title: "Child Labor Projects",
                    url: "#",
                },
                {
                    title: " Labor Migration Projects",
                    url: "#",
                },
                {
                    title: " Energy Sector",
                    url: "#",
                },
            ],
        },
        {
            title: "Organization Focused Programs",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Agriculture and Agrarian Reform Projects",
                    url: "#",
                },
                {
                    title: "Natural Resource Management Projects",
                    url: "#",
                },
                {
                    title: "Private Sector Development Projects",
                    url: "#",
                },
                {
                    title: "Health Projects",
                    url: "#",
                },
                {
                    title: "Housing and Settlement Projects",
                    url: "#",
                },
                {
                    title: "Women in Areas Under Armed Conflict",
                    url: "#",
                },
                {
                    title: "Justice Projects",
                    url: "#",
                },
                {
                    title: "ICT Projects",
                    url: "#",
                },
                {
                    title: "Micro Finance Projects",
                    url: "#",
                },
                {
                    title: "Employment and Work Related Projects",
                    url: "#",
                },
                {
                    title: "Child Labor Projects",
                    url: "#",
                },
                {
                    title: " Labor Migration Projects",
                    url: "#",
                },
                {
                    title: " Energy Sector",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("AppSidebar must be used within a SidebarProvider");
    }

    const { open } = context;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <img
                    src={GadLogo}
                    alt="Logo"
                    className={` ${
                        !open ? "ml-0 mt-2 mr-0 mb-0" : "ml-6 mt-2 mr-6 mb-0"
                    }`}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
