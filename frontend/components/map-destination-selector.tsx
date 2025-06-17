"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface MapDestinationSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectDestination: (destination: { ward: string; room?: string }) => void
}

export function MapDestinationSelector({ open, onOpenChange, onSelectDestination }: MapDestinationSelectorProps) {
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const handleSelectDestination = () => {
    if (selectedWard) {
      onSelectDestination({
        ward: selectedWard,
        room: selectedRoom || undefined,
      })
      onOpenChange(false)
    }
  }

  // Sample data for the map
  const wards = [
    { id: "ward-a", name: "Ward A", position: { x: 20, y: 20 } },
    { id: "ward-b", name: "Ward B", position: { x: 20, y: 60 } },
    { id: "ward-c", name: "Ward C", position: { x: 60, y: 20 } },
  ]

  const rooms = {
    "ward-a": [
      { id: "room-101", name: "Room 101", position: { x: 30, y: 10 } },
      { id: "room-102", name: "Room 102", position: { x: 30, y: 20 } },
      { id: "room-103", name: "Room 103", position: { x: 30, y: 30 } },
    ],
    "ward-b": [
      { id: "room-201", name: "Room 201", position: { x: 10, y: 60 } },
      { id: "room-202", name: "Room 202", position: { x: 20, y: 60 } },
      { id: "room-203", name: "Room 203", position: { x: 30, y: 60 } },
    ],
    "ward-c": [
      { id: "room-301", name: "Room 301", position: { x: 60, y: 10 } },
      { id: "room-302", name: "Room 302", position: { x: 60, y: 20 } },
      { id: "room-303", name: "Room 303", position: { x: 60, y: 30 } },
    ],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Destination on Map</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-muted rounded-md overflow-hidden">
          {/* This would be replaced with an actual interactive map */}
          <div className="absolute inset-0 p-4">
            <div className="relative w-full h-full border border-border rounded-md">
              {/* Ward markers */}
              {wards.map((ward) => (
                <div
                  key={ward.id}
                  className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full cursor-pointer ${
                    selectedWard === ward.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 hover:bg-muted-foreground/30"
                  }`}
                  style={{ left: `${ward.position.x}%`, top: `${ward.position.y}%` }}
                  onClick={() => {
                    setSelectedWard(ward.id)
                    setSelectedRoom(null)
                  }}
                >
                  <span className="text-xs font-medium">{ward.name}</span>
                </div>
              ))}

              {/* Room markers */}
              {selectedWard &&
                rooms[selectedWard as keyof typeof rooms].map((room) => (
                  <div
                    key={room.id}
                    className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full cursor-pointer ${
                      selectedRoom === room.id ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
                    }`}
                    style={{ left: `${room.position.x}%`, top: `${room.position.y}%` }}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <span className="text-[10px]">{room.name.split(" ")[1]}</span>
                  </div>
                ))}

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded-md text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-muted-foreground/20 rounded-full"></div>
                  <span>Ward</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span>Room</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-md text-xs max-w-[200px]">
                <p>Click on a ward first, then select a room if needed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Selected:{" "}
            <span className="font-medium">
              {selectedWard ? wards.find((w) => w.id === selectedWard)?.name : "None"}
            </span>
            {selectedRoom && selectedWard
              ? ` - ${rooms[selectedWard as keyof typeof rooms].find((r) => r.id === selectedRoom)?.name}`
              : ""}
          </span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelectDestination} disabled={!selectedWard}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
