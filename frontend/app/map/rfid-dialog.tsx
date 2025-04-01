"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tag, History, RefreshCw } from "lucide-react"

interface RFIDTag {
  id: string
  name: string
  lastSeen: string
  status: "active" | "inactive"
  assignedTo?: string
  batteryLevel?: number
  usageHistory: {
    date: string
    action: string
    user: string
  }[]
}

interface RFIDDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: RFIDTag | null
}

export function RFIDDialog({ open, onOpenChange, tag }: RFIDDialogProps) {
  const [isReassigning, setIsReassigning] = useState(false)

  if (!tag) return null

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            RFID Tag Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4 p-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Tag ID</p>
                <p className="text-sm text-muted-foreground">{tag.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <Badge variant={tag.status === "active" ? "default" : "secondary"}>
                  {tag.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{tag.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Seen</p>
                <p className="text-sm text-muted-foreground">{tag.lastSeen}</p>
              </div>
              {tag.assignedTo && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-muted-foreground">{tag.assignedTo}</p>
                </div>
              )}
              {tag.batteryLevel !== undefined && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Battery Level</p>
                  <p className="text-sm text-muted-foreground">{tag.batteryLevel}%</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <h3 className="text-sm font-medium">Usage History</h3>
              </div>
              <div className="space-y-2">
                {tag.usageHistory.map((entry, i) => (
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

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={handleReassign} disabled={isReassigning}>
            {isReassigning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reassigning...
              </>
            ) : (
              "Reassign Tag"
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

