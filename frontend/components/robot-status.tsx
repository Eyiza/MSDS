import { Circle, Truck, Clock, BatteryCharging, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type StatusType = "idle" | "delivering" | "charging" | "mapping" | "error" | "standby"

interface RobotStatusProps {
  status: StatusType
  className?: string
}

export function RobotStatus({ status, className }: RobotStatusProps) {
  const statusConfig = {
    idle: {
      label: "Idle",
      icon: Circle,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    delivering: {
      label: "Delivering",
      icon: Truck,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-300",
    },
    charging: {
      label: "Charging",
      icon: BatteryCharging,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    mapping: {
      label: "Mapping",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    error: {
      label: "Error",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-300",
    },
    standby: {
      label: "Standby",
      icon: Circle,
      color: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-700 dark:text-gray-300",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5 py-1.5 px-3", config.bgColor, config.textColor, className)}
    >
      <Icon className={cn("h-3.5 w-3.5", config.color)} />
      <span>{config.label}</span>
    </Badge>
  )
}
