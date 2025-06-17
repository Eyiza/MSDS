"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowRight, Package, Navigation } from "lucide-react"

interface DeliveryTask {
  id: string
  patient: string
  ward: string
  room?: string
  status: string
  message: string
  created: string
  completed?: string
  failReason?: string
  from?: string
  to?: string
  estimatedTime?: string
  items?: string[]
}

interface TrackProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: DeliveryTask | null
}

export function TrackProgressDialog({ open, onOpenChange, task }: TrackProgressDialogProps) {
  const [progress, setProgress] = useState(30)
  const [currentLocation, setCurrentLocation] = useState("Floor 2, Corridor B")
  const [remainingTime, setRemainingTime] = useState("8 minutes")
  const [remainingDistance, setRemainingDistance] = useState("120 meters")

  useEffect(() => {
    if (!open) return

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })

      // Update location based on progress
      if (progress < 40) {
        setCurrentLocation("Floor 2, Corridor B")
      } else if (progress < 70) {
        setCurrentLocation("Floor 2, Main Hall")
      } else {
        setCurrentLocation("Floor 2, Ward C Approach")
      }

      // Update remaining time
      const timeLeft = Math.max(0, 8 - Math.floor(progress / 12.5))
      setRemainingTime(`${timeLeft} minute${timeLeft !== 1 ? "s" : ""}`)

      // Update remaining distance
      const distanceLeft = Math.max(0, 120 - Math.floor(progress * 1.2))
      setRemainingDistance(`${distanceLeft} meters`)
    }, 2000)

    return () => clearInterval(interval)
  }, [open, progress])

  if (!task) return null

  // Default values for task properties
  const taskItems = task.items || ["Medication package", "Patient chart", "Medical supplies"]

  const taskFrom = task.from || "Medical Storage"
  const taskTo = task.to || `${task.ward}${task.room ? ` - ${task.room}` : ""}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Track Delivery Progress
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] overflow-auto pr-4">
          <div className="space-y-4 p-1">
            <div className="flex justify-between items-center text-sm">
              <div className="font-medium">Task #{task.id}</div>
              <Badge>{task.status}</Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-sm font-medium">{taskFrom}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="text-sm font-medium">{taskTo}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border rounded-md p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                  <p className="text-sm font-medium">{remainingTime} remaining</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Current Location</p>
                  <p className="text-sm font-medium">{currentLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Distance Remaining</p>
                  <p className="text-sm font-medium">{remainingDistance}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Items Being Delivered</p>
              <div className="space-y-2">
                {taskItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 border rounded-md p-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple map visualization */}
            <div className="border rounded-md p-3 space-y-2">
              <p className="text-sm font-medium">Delivery Route</p>
              <div className="bg-muted h-32 rounded-md relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                  Map visualization would appear here
                </div>
                <div
                  className="absolute left-0 bottom-0 h-2 bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute w-3 h-3 bg-primary rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    left: `${progress}%`,
                    bottom: "4px",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
