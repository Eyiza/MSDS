"use client"

import { useState } from "react"
import { MapPin, RefreshCw, Save, Upload, Download, Play, Home, Bed, Coffee, Utensils, Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for saved maps
const mockMaps = [
  { id: 1, name: "Main Floor", lastUpdated: "2023-06-01T09:00:00", zones: 12 },
  { id: 2, name: "Second Floor", lastUpdated: "2023-05-15T14:30:00", zones: 8 },
  { id: 3, name: "Basement", lastUpdated: "2023-06-10T11:15:00", zones: 5 },
]

// Mock data for zones
const mockZones = [
  { id: "ZONE-001", name: "Main Reception", type: "Reception", floor: "Main Floor" },
  { id: "ZONE-002", name: "Emergency Department", type: "Medical", floor: "Main Floor" },
  { id: "ZONE-003", name: "Cafeteria", type: "Dining", floor: "Main Floor" },
  { id: "ZONE-004", name: "Patient Wing A", type: "Patient", floor: "Second Floor" },
  { id: "ZONE-005", name: "Surgery Center", type: "Medical", floor: "Second Floor" },
]

export default function MappingToolsPage() {
  const [activeTab, setActiveTab] = useState("maps")
  const [selectedMap, setSelectedMap] = useState<any>(null)
  const [isEditingZone, setIsEditingZone] = useState(false)
  const [editingZone, setEditingZone] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const router = useRouter()

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Function to get zone type icon
  const getZoneTypeIcon = (type: string) => {
    switch (type) {
      case "Reception":
        return <Home className="h-4 w-4" />
      case "Patient":
        return <Bed className="h-4 w-4" />
      case "Dining":
        return <Utensils className="h-4 w-4" />
      case "Break":
        return <Coffee className="h-4 w-4" />
      case "Medical":
        return <Stethoscope className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  // Function to start simulation
  const startSimulation = () => {
    setIsSimulating(true)
    setSimulationProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSimulating(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Function to edit zone
  const startEditingZone = (zone: any) => {
    setEditingZone(zone)
    setIsEditingZone(true)
  }

  // Function to save zone edits
  const saveZoneEdits = () => {
    setIsEditingZone(false)
    setEditingZone(null)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manual Mapping & Simulation</h1>
      </div>

      <Tabs defaultValue="maps" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="maps">Map Management</TabsTrigger>
          <TabsTrigger value="zones">Zone Configuration</TabsTrigger>
          <TabsTrigger value="simulation">Task Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="maps">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Map Editor</CardTitle>
                  <CardDescription>Manage and edit facility maps</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-6">
                  {selectedMap ? (
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Editing: {selectedMap.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Last updated: {formatDate(selectedMap.lastUpdated)}
                      </p>
                      <div className="w-[300px] h-[300px] mx-auto bg-white dark:bg-gray-700 rounded-md border relative">
                        {/* Simplified map visualization */}
                        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500 rounded-full opacity-20"></div>
                        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-green-500 rounded-md opacity-20"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-yellow-500 rounded-md opacity-20"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-14 h-8 bg-purple-500 rounded-md opacity-20"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Map Selected</h3>
                      <p className="text-sm text-muted-foreground">Select a map from the list or create a new one</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="space-x-2">
                    <Button variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Map
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" disabled={!selectedMap}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button disabled={!selectedMap}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Saved Maps</CardTitle>
                  <CardDescription>Select a map to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMaps.map((map) => (
                      <div
                        key={map.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedMap?.id === map.id ? "border-primary" : ""}`}
                        onClick={() => setSelectedMap(map)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{map.name}</h3>
                          <Badge>{map.zones} zones</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last updated: {formatDate(map.lastUpdated)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Create New Map
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>SLAM Controls</CardTitle>
                  <CardDescription>Simultaneous Localization and Mapping</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Start SLAM</h3>
                        <p className="text-xs text-muted-foreground">Begin mapping with robot</p>
                      </div>
                      <Button variant="outline">
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Clear Current Data</h3>
                        <p className="text-xs text-muted-foreground">Reset mapping progress</p>
                      </div>
                      <Button variant="outline">Clear</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="zones">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Zone Editor</CardTitle>
                  <CardDescription>Configure and manage zones for robot navigation</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-md mb-6">
                  {isEditingZone ? (
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Editing Zone: {editingZone?.name}</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zone-id" className="text-right">
                            Zone ID
                          </Label>
                          <Input id="zone-id" value={editingZone?.id} className="col-span-3" readOnly />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zone-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="zone-name"
                            value={editingZone?.name}
                            onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zone-type" className="text-right">
                            Type
                          </Label>
                          <Select
                            defaultValue={editingZone?.type}
                            onValueChange={(value) => setEditingZone({ ...editingZone, type: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select zone type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reception">Reception</SelectItem>
                              <SelectItem value="Patient">Patient</SelectItem>
                              <SelectItem value="Medical">Medical</SelectItem>
                              <SelectItem value="Dining">Dining</SelectItem>
                              <SelectItem value="Break">Break</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zone-floor" className="text-right">
                            Floor
                          </Label>
                          <Select
                            defaultValue={editingZone?.floor}
                            onValueChange={(value) => setEditingZone({ ...editingZone, floor: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select floor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Main Floor">Main Floor</SelectItem>
                              <SelectItem value="Second Floor">Second Floor</SelectItem>
                              <SelectItem value="Basement">Basement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6 space-x-2">
                        <Button variant="outline" onClick={() => setIsEditingZone(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveZoneEdits}>Save Changes</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Zone Selected</h3>
                        <p className="text-sm text-muted-foreground">Select a zone from the list or create a new one</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Zone
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Zone List</CardTitle>
                  <CardDescription>Select a zone to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockZones.map((zone) => (
                      <div
                        key={zone.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${editingZone?.id === zone.id ? "border-primary" : ""}`}
                        onClick={() => startEditingZone(zone)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getZoneTypeIcon(zone.type)}
                            <h3 className="font-medium ml-2">{zone.name}</h3>
                          </div>
                          <Badge>{zone.floor}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Type: {zone.type}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Create New Zone
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Simulation</CardTitle>
                  <CardDescription>Simulate robot task execution and path planning</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-md mb-6">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 relative">
                      {/* Simplified simulation visualization */}
                      <div className="w-full h-full p-4">
                        <div className="w-[80%] h-[80%] mx-auto border border-dashed border-gray-300 dark:border-gray-600 rounded-md relative">
                          {/* Start point */}
                          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-500 rounded-full"></div>

                          {/* End point */}
                          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-red-500 rounded-full"></div>

                          {/* Path line */}
                          {isSimulating && (
                            <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-r border-b border-blue-500"></div>
                          )}

                          {/* Robot position */}
                          {isSimulating && (
                            <div
                              className="absolute w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                              style={{
                                top: `${25 + (simulationProgress / 100) * 50}%`,
                                left: `${25 + (simulationProgress / 100) * 50}%`,
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSimulating && (
                      <div className="p-4 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Simulation Progress</span>
                            <span>{simulationProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${simulationProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" disabled={isSimulating}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={startSimulation} disabled={isSimulating}>
                    <Play className="mr-2 h-4 w-4" />
                    {isSimulating ? "Simulating..." : "Start Simulation"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Parameters</CardTitle>
                  <CardDescription>Configure the task simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-zone">Start Zone</Label>
                      <Select defaultValue="ZONE-001">
                        <SelectTrigger id="start-zone">
                          <SelectValue placeholder="Select start zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockZones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-zone">Destination Zone</Label>
                      <Select defaultValue="ZONE-003">
                        <SelectTrigger id="end-zone">
                          <SelectValue placeholder="Select destination zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockZones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="robot-model">Robot Model</Label>
                      <Select defaultValue="MSDS-2000">
                        <SelectTrigger id="robot-model">
                          <SelectValue placeholder="Select robot model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MSDS-2000">MSDS-2000</SelectItem>
                          <SelectItem value="MSDS-2500">MSDS-2500</SelectItem>
                          <SelectItem value="MSDS-3000">MSDS-3000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sim-speed">Simulation Speed</Label>
                      <Select defaultValue="1x">
                        <SelectTrigger id="sim-speed">
                          <SelectValue placeholder="Select simulation speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5x">0.5x (Slow)</SelectItem>
                          <SelectItem value="1x">1x (Normal)</SelectItem>
                          <SelectItem value="2x">2x (Fast)</SelectItem>
                          <SelectItem value="5x">5x (Very Fast)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="obstacles">Add Obstacles</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="obstacles" />
                        <label
                          htmlFor="obstacles"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Simulate random obstacles
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Save Configuration
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Simulation Results</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span>Path Length:</span>
                      <span className="font-medium">32.5 meters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Time:</span>
                      <span className="font-medium">2 min 15 sec</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Usage:</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Path Efficiency:</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
