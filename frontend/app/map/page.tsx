"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Upload, Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Location {
  id: string
  name: string
  x: number
  y: number
  description: string
  type: "ward" | "base" | "room"
  createdAt: string
  updatedAt?: string
}

export default function MapPage() {
  const [showRobot, setShowRobot] = useState(true)
  const [showWaypoints, setShowWaypoints] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [activeLayer, setActiveLayer] = useState("all")
  const [mapView, setMapView] = useState("live")
  const [cadFile, setCadFile] = useState<File | null>(null)
  const [showCadUpload, setShowCadUpload] = useState(false)
  const [showLocationSidebar, setShowLocationSidebar] = useState(true)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false)
  const [isDeleteLocationOpen, setIsDeleteLocationOpen] = useState(false)
  const [isViewLocationOpen, setIsViewLocationOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationSearchTerm, setLocationSearchTerm] = useState("")
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number; y: number } | null>(null)
  const [isSelectingFromMap, setIsSelectingFromMap] = useState(false)
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    x: 0,
    y: 0,
    description: "",
    type: "room" as "ward" | "base" | "room",
  })

  // Sample locations data
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "loc-001",
      name: "Ward A",
      x: 120.5,
      y: 85.2,
      description: "Main medical ward on the first floor",
      type: "ward",
      createdAt: "2023-06-10T14:30:00Z",
    },
    {
      id: "loc-002",
      name: "Room 101",
      x: 145.3,
      y: 90.7,
      description: "Patient room in Ward A",
      type: "room",
      createdAt: "2023-06-10T14:35:00Z",
    },
    {
      id: "loc-003",
      name: "Charging Base 1",
      x: 50.8,
      y: 50.1,
      description: "Primary robot charging station",
      type: "base",
      createdAt: "2023-06-10T14:40:00Z",
    },
    {
      id: "loc-004",
      name: "Ward B",
      x: 200.2,
      y: 150.9,
      description: "Surgical ward on the first floor",
      type: "ward",
      createdAt: "2023-06-11T09:15:00Z",
    },
    {
      id: "loc-005",
      name: "Room 201",
      x: 180.6,
      y: 120.4,
      description: "Patient room in Ward B",
      type: "room",
      createdAt: "2023-06-11T09:20:00Z",
    },
  ])

  // Filter locations based on search term
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      location.type.toLowerCase().includes(locationSearchTerm.toLowerCase()),
  )

  // Handle map click for coordinate selection
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingFromMap) return

    // Get click coordinates relative to the map container
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Number.parseFloat((e.clientX - rect.left).toFixed(1))
    const y = Number.parseFloat((e.clientY - rect.top).toFixed(1))

    setSelectedCoordinates({ x, y })
    setLocationFormData((prev) => ({ ...prev, x, y }))
    setIsSelectingFromMap(false)
  }

  // Handle adding a new location
  const handleAddLocation = () => {
    const newLocation: Location = {
      id: `loc-${String(locations.length + 1).padStart(3, "0")}`,
      name: locationFormData.name,
      x: locationFormData.x,
      y: locationFormData.y,
      description: locationFormData.description,
      type: locationFormData.type,
      createdAt: new Date().toISOString(),
    }

    setLocations([...locations, newLocation])
    setIsAddLocationOpen(false)
    resetLocationForm()
  }

  // Handle updating a location
  const handleUpdateLocation = () => {
    if (!selectedLocation) return

    const updatedLocations = locations.map((loc) =>
      loc.id === selectedLocation.id
        ? {
            ...loc,
            name: locationFormData.name,
            x: locationFormData.x,
            y: locationFormData.y,
            description: locationFormData.description,
            type: locationFormData.type,
            updatedAt: new Date().toISOString(),
          }
        : loc,
    )

    setLocations(updatedLocations)
    setIsEditLocationOpen(false)
    setSelectedLocation(null)
    resetLocationForm()
  }

  // Handle deleting a location
  const handleDeleteLocation = () => {
    if (!selectedLocation) return

    const updatedLocations = locations.filter((loc) => loc.id !== selectedLocation.id)
    setLocations(updatedLocations)
    setIsDeleteLocationOpen(false)
    setSelectedLocation(null)
  }

  // Reset location form
  const resetLocationForm = () => {
    setLocationFormData({
      name: "",
      x: 0,
      y: 0,
      description: "",
      type: "room",
    })
    setSelectedCoordinates(null)
  }

  // Open view location dialog
  const openViewLocation = (location: Location) => {
    setSelectedLocation(location)
    setIsViewLocationOpen(true)
  }

  // Open edit location dialog
  const openEditLocation = (location: Location) => {
    setSelectedLocation(location)
    setLocationFormData({
      name: location.name,
      x: location.x,
      y: location.y,
      description: location.description,
      type: location.type,
    })
    setIsEditLocationOpen(true)
  }

  // Open delete location dialog
  const openDeleteLocation = (location: Location) => {
    setSelectedLocation(location)
    setIsDeleteLocationOpen(true)
  }

  // Get location type badge color
  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "ward":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "base":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "room":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Facility Maps</h1>
            <p className="text-muted-foreground mt-1">View and manage facility maps and robot navigation</p>
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
            <TabsList className="grid grid-cols-3 w-96">
              <TabsTrigger value="live">
                <Navigation className="h-4 w-4 mr-2" />
                Robot Map
              </TabsTrigger>
              <TabsTrigger value="static">
                <MapPin className="h-4 w-4 mr-2" />
                Static Map
              </TabsTrigger>
              <TabsTrigger value="locations">
                <MapPin className="h-4 w-4 mr-2" />
                Locations
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
                      <div className="border-t my-3"></div>
                      <Button variant="outline" className="w-full" onClick={() => setShowCadUpload(!showCadUpload)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CAD File
                      </Button>

                      {showCadUpload && (
                        <div className="mt-3 space-y-2">
                          <Label htmlFor="cad-file">Select CAD File</Label>
                          <Input
                            id="cad-file"
                            type="file"
                            accept=".dxf,.dwg,.svg,.pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setCadFile(e.target.files[0])
                              }
                            }}
                          />
                          <p className="text-xs text-muted-foreground">Supported formats: DXF, DWG, SVG, PDF</p>
                          <Button size="sm" className="w-full" disabled={!cadFile}>
                            Process CAD File
                          </Button>
                        </div>
                      )}
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
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Static Facility Map</CardTitle>
                      <CardDescription className="mt-2">Fixed map of the hospital layout</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddLocationOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Location
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center relative cursor-crosshair"
                    onClick={handleMapClick}
                  >
                    {isSelectingFromMap && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                        <div className="bg-white p-4 rounded-md shadow-lg">
                          <p className="font-medium">Click on the map to select coordinates</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsSelectingFromMap(false)
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Map visualization with locations */}
                    <div className="relative w-full h-full">
                      <p className="text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Static facility map will appear here
                      </p>

                      {/* Render location markers */}
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{ left: `${location.x}px`, top: `${location.y}px` }}
                          onClick={(e) => {
                            e.stopPropagation()
                            openViewLocation(location)
                          }}
                        >
                          <div
                            className={`
                              w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold
                              ${
                                location.type === "ward"
                                  ? "bg-blue-500"
                                  : location.type === "base"
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                              }
                            `}
                            title={location.name}
                          >
                            {location.name.charAt(0)}
                          </div>
                        </div>
                      ))}

                      {/* Show selected coordinates */}
                      {selectedCoordinates && (
                        <div
                          className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full flex items-center justify-center text-white"
                          style={{ left: `${selectedCoordinates.x}px`, top: `${selectedCoordinates.y}px` }}
                        >
                          +
                        </div>
                      )}
                    </div>
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
                        <span className="text-sm">Wards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                        <span className="text-sm">Rooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                        <span className="text-sm">Charging Bases</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Location Management</CardTitle>
                    <CardDescription className="mt-2">View and manage all facility locations</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddLocationOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search locations..."
                      className="pl-8 w-[300px]"
                      value={locationSearchTerm}
                      onChange={(e) => setLocationSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Coordinates</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No locations found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLocations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">{location.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getLocationTypeColor(location.type)}>
                              {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            X: {location.x}, Y: {location.y}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{location.description}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openViewLocation(location)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#1A9CB0] text-white hover:bg-[#158799]"
                              onClick={() => openEditLocation(location)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => openDeleteLocation(location)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Location Dialog */}
      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>Create a new location on the facility map</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Location Name*</Label>
              <Input
                id="name"
                placeholder="Enter a unique name"
                value={locationFormData.name}
                onChange={(e) => setLocationFormData({ ...locationFormData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coordinates</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsAddLocationOpen(false)
                    setTimeout(() => {
                      setIsSelectingFromMap(true)
                    }, 300)
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Select from Map
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="x-coord">X</Label>
                  <Input
                    id="x-coord"
                    type="number"
                    step="0.1"
                    value={locationFormData.x}
                    onChange={(e) =>
                      setLocationFormData({ ...locationFormData, x: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y-coord">Y</Label>
                  <Input
                    id="y-coord"
                    type="number"
                    step="0.1"
                    value={locationFormData.y}
                    onChange={(e) =>
                      setLocationFormData({ ...locationFormData, y: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this location"
                value={locationFormData.description}
                onChange={(e) => setLocationFormData({ ...locationFormData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Location Type</Label>
              <RadioGroup
                defaultValue={locationFormData.type}
                onValueChange={(value) =>
                  setLocationFormData({ ...locationFormData, type: value as "ward" | "base" | "room" })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room" id="room" />
                  <Label htmlFor="room">Room</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ward" id="ward" />
                  <Label htmlFor="ward">Ward</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="base" id="base" />
                  <Label htmlFor="base">Base</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLocation} disabled={!locationFormData.name.trim()}>
              Create Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Location Dialog */}
      <Dialog open={isViewLocationOpen} onOpenChange={setIsViewLocationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
            <DialogDescription>View details for {selectedLocation?.name}</DialogDescription>
          </DialogHeader>

          {selectedLocation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedLocation.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge variant="outline" className={getLocationTypeColor(selectedLocation.type)}>
                    {selectedLocation.type.charAt(0).toUpperCase() + selectedLocation.type.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Coordinates</Label>
                  <p className="text-sm text-muted-foreground">
                    X: {selectedLocation.x}, Y: {selectedLocation.y}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedLocation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{selectedLocation.description}</p>
              </div>
              {selectedLocation.updatedAt && (
                <div>
                  <Label className="text-sm font-medium">Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedLocation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewLocationOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update location details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Location Name*</Label>
              <Input
                id="edit-name"
                placeholder="Enter a unique name"
                value={locationFormData.name}
                onChange={(e) => setLocationFormData({ ...locationFormData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coordinates</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsEditLocationOpen(false)
                    setTimeout(() => {
                      setIsSelectingFromMap(true)
                    }, 300)
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Select from Map
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-x-coord">X</Label>
                  <Input
                    id="edit-x-coord"
                    type="number"
                    step="0.1"
                    value={locationFormData.x}
                    onChange={(e) =>
                      setLocationFormData({ ...locationFormData, x: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-y-coord">Y</Label>
                  <Input
                    id="edit-y-coord"
                    type="number"
                    step="0.1"
                    value={locationFormData.y}
                    onChange={(e) =>
                      setLocationFormData({ ...locationFormData, y: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter a description for this location"
                value={locationFormData.description}
                onChange={(e) => setLocationFormData({ ...locationFormData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-type">Location Type</Label>
              <RadioGroup
                value={locationFormData.type}
                onValueChange={(value) =>
                  setLocationFormData({ ...locationFormData, type: value as "ward" | "base" | "room" })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room" id="edit-room" />
                  <Label htmlFor="edit-room">Room</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ward" id="edit-ward" />
                  <Label htmlFor="edit-ward">Ward</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="base" id="edit-base" />
                  <Label htmlFor="edit-base">Base</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLocation} disabled={!locationFormData.name.trim()}>
              Update Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Location Dialog */}
      <Dialog open={isDeleteLocationOpen} onOpenChange={setIsDeleteLocationOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedLocation && (
            <div className="py-4">
              <p className="font-medium">{selectedLocation.name}</p>
              <p className="text-sm text-muted-foreground">{selectedLocation.description}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteLocationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
