"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MapControls() {
  const [selectedMap, setSelectedMap] = useState("current")
  const [roomLabel, setRoomLabel] = useState("")
  const [roomCoords, setRoomCoords] = useState({ x: "0", y: "0" })

  const handleResetMap = () => {
    // Mock implementation
    alert("Map reset initiated")
  }

  const handleStartSLAM = () => {
    // Mock implementation
    alert("SLAM mapping started")
  }

  const handleLoadMap = () => {
    // Mock implementation
    alert(`Loading map: ${selectedMap}`)
  }

  const handleAddRoom = () => {
    // Mock implementation
    alert(`Adding room: ${roomLabel} at coordinates (${roomCoords.x}, ${roomCoords.y})`)
    setRoomLabel("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Map Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mapping">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
            <TabsTrigger value="labeling">Room Labeling</TabsTrigger>
          </TabsList>

          <TabsContent value="mapping" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Button onClick={handleResetMap} variant="destructive" className="w-full">
                Reset Current Map
              </Button>
            </div>

            <div className="space-y-2">
              <Button onClick={handleStartSLAM} className="w-full">
                Start SLAM Mapping
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Load Saved Map</Label>
              <div className="flex space-x-2">
                <Select value={selectedMap} onValueChange={setSelectedMap}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select map" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Map</SelectItem>
                    <SelectItem value="floor1">Floor 1 - Main</SelectItem>
                    <SelectItem value="floor2">Floor 2 - North Wing</SelectItem>
                    <SelectItem value="floor3">Floor 3 - South Wing</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleLoadMap}>Load</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="labeling" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="roomLabel">Room Label</Label>
              <Input
                id="roomLabel"
                value={roomLabel}
                onChange={(e) => setRoomLabel(e.target.value)}
                placeholder="e.g., Room 101, Hallway 2"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="x-coord">X Coordinate</Label>
                <Input
                  id="x-coord"
                  value={roomCoords.x}
                  onChange={(e) => setRoomCoords((prev) => ({ ...prev, x: e.target.value }))}
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="y-coord">Y Coordinate</Label>
                <Input
                  id="y-coord"
                  value={roomCoords.y}
                  onChange={(e) => setRoomCoords((prev) => ({ ...prev, y: e.target.value }))}
                  type="number"
                />
              </div>
            </div>

            <Button onClick={handleAddRoom} className="w-full">
              Add Room Label
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
