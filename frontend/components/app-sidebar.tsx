"use client"
import {
  Home,
  Map,
  Calendar,
  Users,
  Joystick,
  Settings,
  Battery,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Wrench,
  Tag,
  AlertTriangle,
  Terminal,
  MapPin,
  Shield,
  LayoutDashboard,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useSidebar } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menu items for regular users
const userItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Map",
    url: "/map",
    icon: Map,
  },
  {
    title: "Task Scheduling",
    url: "/tasks",
    icon: Calendar,
  },
  {
    title: "Patient Management",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Manual Control",
    url: "/control",
    icon: Joystick,
  },
  {
    title: "Settings",
    url: "/settings/robot",
    icon: Settings,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
]

// Menu items for engineers - keeping Dashboard
const engineerItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Robot Management",
    url: "/robots",
    icon: Battery,
  },
  {
    title: "Tag Management",
    url: "/tags",
    icon: Tag,
  },
  {
    title: "System Diagnostics",
    url: "/diagnostics",
    icon: Wrench,
  },
  {
    title: "Issue Reports",
    url: "/issues",
    icon: AlertTriangle,
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Debug Console",
    url: "/console",
    icon: Terminal,
  },
  {
    title: "Mapping Tools",
    url: "/mapping",
    icon: MapPin,
  },
  {
    title: "Access Control",
    url: "/access",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "/settings/robot",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated, isEngineer } = useAuth()
  const { open, setOpen } = useSidebar()

  // Don't render the sidebar on auth pages
  if (["/login", "/register", "/forgot-password"].includes(pathname)) {
    return null
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const toggleSidebar = () => {
    setOpen(!open)
  }

  // Select the appropriate menu items based on user role
  const items = isEngineer ? engineerItems : userItems

  return (
    <Sidebar collapsible="icon" className="sidebar-custom">
      <SidebarHeader className={`flex items-center ${open ? "px-4 py-4" : "p-4 flex-col gap-4"}`}>
        {open ? (
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-0">
              <PanelLeftClose className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {isEngineer ? (
                <>
                  <Wrench className="h-7 w-7 text-primary" />
                  <h1 className="text-xl font-bold">MSDS Admin</h1>
                </>
              ) : (
                <>
                  <Battery className="h-7 w-7 text-primary" />
                  <h1 className="text-xl font-bold">MSDS</h1>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {isEngineer ? (
              <Wrench className="h-7 w-7 text-primary mt-2" />
            ) : (
              <Battery className="h-7 w-7 text-primary mt-2" />
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          </>
        )}
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url || (item.url === "/settings/robot" && pathname.startsWith("/settings"))}
                tooltip={item.title}
                className="py-3"
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className={`p-4 ${!open ? "flex justify-start items-center" : ""}`}>
        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={open ? "w-full flex items-center justify-start gap-2 px-2" : "flex justify-start ml-0 pl-4"}
              >
                <Avatar className="h-8 w-8 bg-[#1A9CB0] text-white">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback className="bg-[#1A9CB0] text-white">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                {open && (
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    {isEngineer && (
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full mt-1">
                        Engineer
                      </span>
                    )}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
