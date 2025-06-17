import { Battery, BatteryCharging, BatteryWarning } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BatteryStatusProps {
  level: number
  isCharging?: boolean
  className?: string
}

export function BatteryStatus({ level, isCharging = false, className }: BatteryStatusProps) {
  let color = "text-green-500"
  let icon = Battery
  let status = "Good"

  if (level <= 20) {
    color = "text-red-500"
    icon = BatteryWarning
    status = "Critical"
  } else if (level <= 40) {
    color = "text-amber-500"
    status = "Low"
  }

  if (isCharging) {
    icon = BatteryCharging
    status = "Charging"
  }

  const Icon = icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border", className)}>
            <Icon className={cn("h-4 w-4", color)} />
            <span className="font-medium">{level}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Battery Status: {status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
