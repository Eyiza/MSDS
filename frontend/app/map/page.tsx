"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation } from "lucide-react"

export default function MapPage() {
  const [showRobot, setShowRobot] = useState(true)
  const [showWaypoints, setShowWaypoints] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [activeLayer, setActiveLayer] = useState("all")
  const [mapView, setMapView] = useState("live")

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Facility Maps</h1>
            <p className="text-muted-foreground mt-1">View static facility map and live robot location</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status="mapping" />
            <BatteryStatus level={85} />
            <div className="fixed z-50 top-6 right-6 md:static md:z-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Tabs defaultValue="live" value={mapView} onValueChange={setMapView}>
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-2 w-64">
              <TabsTrigger value="live">
                <Navigation className="h-4 w-4 mr-2" />
                Live Map
              </TabsTrigger>
              <TabsTrigger value="static">
                <MapPin className="h-4 w-4 mr-2" />
                Static Map
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="live" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-3 shadow-sm">
                <CardHeader>
                  <CardTitle>Live Robot Map</CardTitle>
                  <CardDescription>Real-time map with robot position and obstacles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Live map visualization will appear here</p>
                    {/* This will be replaced with actual ROS map visualization */}
                    {/* We would conditionally render different map elements based on the state */}
                    {/* For example: {showRobot && <RobotMarker />} */}
                    {/* {activeLayer === "obstacles" && <ObstaclesLayer />} */}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Map Controls</CardTitle>
                  </CardHeader>
                  <div className="border-t my-3"></div>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        Start Mapping
                      </Button>
                      <Button variant="outline" className="w-full">
                        Save Map
                      </Button>
                      <Button variant="outline" className="w-full">
                        Load Map
                      </Button>
                      <Button variant="outline" className="w-full">
                        Clear Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Map Layers</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="all" value={activeLayer} onValueChange={setActiveLayer}>
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="obstacles">Obstacles</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="mt-6 space-y-4">
                      {activeLayer === "all" && (
                        <>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-robot" className="text-sm">
                              Show Robot
                            </Label>
                            <Switch id="show-robot" checked={showRobot} onCheckedChange={setShowRobot} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-waypoints" className="text-sm">
                              Show Waypoints
                            </Label>
                            <Switch id="show-waypoints" checked={showWaypoints} onCheckedChange={setShowWaypoints} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-grid" className="text-sm">
                              Show Grid
                            </Label>
                            <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                          </div>
                        </>
                      )}

                      {activeLayer === "obstacles" && (
                        <>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-walls" className="text-sm">
                              Show Walls
                            </Label>
                            <Switch id="show-walls" checked={true} onCheckedChange={() => {}} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-dynamic" className="text-sm">
                              Show Dynamic Obstacles
                            </Label>
                            <Switch id="show-dynamic" checked={true} onCheckedChange={() => {}} />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="static" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-3 shadow-sm">
                <CardHeader>
                  <CardTitle>Static Facility Map</CardTitle>
                  <CardDescription>Fixed map of the hospital layout</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Static facility map will appear here</p>
                    {/* This will be replaced with the static facility map */}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Map Legend</CardTitle>
                  </CardHeader>
                  <div className="border-t my-3 pt-3"></div>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        <span className="text-sm">Patient Rooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                        <span className="text-sm">Nursing Stations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                        <span className="text-sm">Supply Rooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                        <span className="text-sm">Restricted Areas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                        <span className="text-sm">Elevators</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
                        <span className="text-sm">Hallways</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/*
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Floor Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        Ground Floor
                      </Button>
                      <Button variant="outline" className="w-full">
                        First Floor
                      </Button>
                      <Button variant="outline" className="w-full">
                        Second Floor
                      </Button>
                      <Button variant="outline" className="w-full">
                        Third Floor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

