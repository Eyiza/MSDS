"use client"

import { usePathname, useRouter } from "next/navigation"
import { Bell, Shield, Settings, Wifi, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const settingsTabs = [
  {
    title: "Robot Settings",
    icon: Settings,
    href: "/settings/robot",
  },
  {
    title: "Network",
    icon: Wifi,
    href: "/settings/network",
  },
  {
    title: "Advanced",
    icon: AlertTriangle,
    href: "/settings/advanced",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/settings/notifications",
  },
  {
    title: "Security",
    icon: Shield,
    href: "/settings/security",
  },
]

export function SettingsTabs() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Card className="p-2">
      <div className="space-y-1">
        {settingsTabs.map((tab) => (
          <Button
            key={tab.href}
            variant={pathname === tab.href ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => router.push(tab.href)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.title}
          </Button>
        ))}
      </div>
    </Card>
  )
}
