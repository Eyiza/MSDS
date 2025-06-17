"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { BotIcon as Robot, Tag, AlertTriangle, Users, Terminal, Activity } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EngineerSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const routes = [
    {
      label: "Robot Management",
      icon: Robot,
      href: "/robots",
      active: pathname === "/robots",
    },
    {
      label: "Tag Management",
      icon: Tag,
      href: "/tags",
      active: pathname === "/tags",
    },
    {
      label: "System Diagnostics",
      icon: Activity,
      href: "/diagnostics",
      active: pathname === "/diagnostics",
    },
    {
      label: "Issues & Complaints",
      icon: AlertTriangle,
      href: "/issues",
      active: pathname === "/issues",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/users",
      active: pathname === "/users",
    },
    {
      label: "Debug Console",
      icon: Terminal,
      href: "/console",
      active: pathname === "/console",
    },
  ]

  return (
    <div className={className}>
      <div className="space-y-1">
        {routes.map((route) => (
          <a
            key={route.href}
            href={route.href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
              route.active ? "bg-gray-100 dark:bg-gray-700 font-medium" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <route.icon className="h-4 w-4" />
            <span>{route.label}</span>
          </a>
        ))}
      </div>
      <div className="mt-6 px-4">
        <button
          onClick={() => signOut()}
          className="w-full py-2 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
