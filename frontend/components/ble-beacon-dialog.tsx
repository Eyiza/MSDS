"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Radio, History } from "lucide-react"

interface BLEBeacon {
  id: string
  name: string
  lastSeen: string
  status: "active" | "inactive"
  assignedTo?: string
  batteryLevel?: number
  signalStrength?: number
  usageHistory: {
    date: string
    action: string
    user: string
  }[]
}

interface BLEBeaconDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  beacon: BLEBeacon | null
}

export function BLEBeaconDialog({ open, onOpenChange, beacon }: BLEBeaconDialogProps) {
  const [isReassigning, setIsReassigning] = useState(false)

  if (!beacon) return null

  const handleReassign = () => {
    setIsReassigning(true)
    // In a real app, you would implement the reassignment logic here
    setTimeout(() => {
      setIsReassigning(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            BLE Beacon Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(60vh-80px)]">
            <div className="space-y-4 p-1 pr-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Beacon ID</p>
                  <p className="text-sm text-muted-foreground">{beacon.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={beacon.status === "active" ? "default" : "secondary"}>
                    {beacon.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{beacon.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Seen</p>
                  <p className="text-sm text-muted-foreground">{beacon.lastSeen}</p>
                </div>
                {beacon.assignedTo && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">{beacon.assignedTo}</p>
                  </div>
                )}
                {beacon.batteryLevel !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Battery Level</p>
                    <p className="text-sm text-muted-foreground">{beacon.batteryLevel}%</p>
                  </div>
                )}
                {beacon.signalStrength !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Signal Strength</p>
                    <p className="text-sm text-muted-foreground">{beacon.signalStrength} dBm</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Usage History</h3>
                </div>
                <div className="space-y-2">
                  {beacon.usageHistory.map((entry, i) => (
                    <div key={i} className="border rounded-md p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{entry.action}</span>
                        <span className="text-muted-foreground">{entry.date}</span>
                      </div>
                      <p className="text-muted-foreground">By: {entry.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-end items-center mt-4">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
