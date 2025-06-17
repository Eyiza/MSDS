"use client"

import { useState } from "react"
import { Battery, Plus, Edit, Trash, CheckCircle, MoreHorizontal, Clock, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Mock data for robots
const mockRobots = [
  {
    id: "ROB-001",
    name: "Delivery Bot 1",
    model: "MSDS-2000",
    status: "Active",
    lastActive: "2023-06-15T10:30:00",
    battery: 85,
    tasksCompleted: 12,
    maxSpeed: 1.5,
    taskCapacity: 3,
    floor: "1st Floor",
  },
  {
    id: "ROB-002",
    name: "Delivery Bot 2",
    model: "MSDS-2000",
    status: "Delivering",
    lastActive: "2023-06-15T11:45:00",
    battery: 62,
    tasksCompleted: 8,
    maxSpeed: 1.5,
    taskCapacity: 3,
    floor: "2nd Floor",
  },
  {
    id: "ROB-003",
    name: "Delivery Bot 3",
    model: "MSDS-3000",
    status: "Out of Order",
    lastActive: "2023-06-14T16:20:00",
    battery: 0,
    tasksCompleted: 0,
    maxSpeed: 2.0,
    taskCapacity: 4,
    floor: "3rd Floor",
  },
  {
    id: "ROB-004",
    name: "Delivery Bot 4",
    model: "MSDS-3000",
    status: "Idle",
    lastActive: "2023-06-15T09:15:00",
    battery: 95,
    tasksCompleted: 5,
    maxSpeed: 2.0,
    taskCapacity: 4,
    floor: "1st Floor",
  },
  {
    id: "ROB-005",
    name: "Delivery Bot 5",
    model: "MSDS-2500",
    status: "Charging",
    lastActive: "2023-06-15T08:30:00",
    battery: 30,
    tasksCompleted: 7,
    maxSpeed: 1.8,
    taskCapacity: 3,
    floor: "2nd Floor",
  },
]

// Mock data for robot activity logs
const mockActivityLogs = [
  {
    id: 1,
    robotId: "ROB-001",
    timestamp: "2023-06-15T10:30:00",
    action: "Task Completed",
    details: "Delivered supplies to Room 302",
  },
  {
    id: 2,
    robotId: "ROB-001",
    timestamp: "2023-06-15T10:15:00",
    action: "Task Started",
    details: "Picking up supplies for Room 302",
  },
  {
    id: 3,
    robotId: "ROB-001",
    timestamp: "2023-06-15T09:45:00",
    action: "Charging Complete",
    details: "Battery at 100%",
  },
  {
    id: 4,
    robotId: "ROB-001",
    timestamp: "2023-06-15T08:30:00",
    action: "Charging Started",
    details: "Battery at 20%",
  },
  {
    id: 5,
    robotId: "ROB-001",
    timestamp: "2023-06-15T08:00:00",
    action: "System Boot",
    details: "Robot initialized successfully",
  },
]

export default function RobotManagementPage() {
  const [robots, setRobots] = useState(mockRobots)
  const [selectedRobot, setSelectedRobot] = useState(mockRobots[0])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newRobot, setNewRobot] = useState({
    id: "",
    name: "",
    model: "MSDS-2000",
    maxSpeed: 1.5,
    taskCapacity: 3,
    status: "Active",
    floor: "1st Floor",
    maintenanceSchedule: "Monthly",
    lastMaintenance: new Date().toISOString(),
    notes: "",
  })
  const router = useRouter()

  // Function to handle adding a new robot
  const handleAddRobot = () => {
    const robotToAdd = {
      ...newRobot,
      lastActive: new Date().toISOString(),
      battery: 100,
      tasksCompleted: 0,
      lastMaintenance: newRobot.lastMaintenance || new Date().toISOString(),
    }
    setRobots([...robots, robotToAdd])
    setIsAddDialogOpen(false)
    setNewRobot({
      id: "",
      name: "",
      model: "MSDS-2000",
      maxSpeed: 1.5,
      taskCapacity: 3,
      status: "Active",
      floor: "1st Floor",
      maintenanceSchedule: "Monthly",
      lastMaintenance: new Date().toISOString(),
      notes: "",
    })
  }

  // Function to handle editing a robot
  const handleEditRobot = () => {
    const updatedRobots = robots.map((robot) => (robot.id === selectedRobot.id ? selectedRobot : robot))
    setRobots(updatedRobots)
    setIsEditDialogOpen(false)
  }

  // Function to handle deleting a robot
  const handleDeleteRobot = (id: string) => {
    const updatedRobots = robots.filter((robot) => robot.id !== id)
    setRobots(updatedRobots)
  }

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">{status}</Badge>
      case "Delivering":
        return <Badge className="bg-blue-500">{status}</Badge>
      case "Out of Order":
        return <Badge className="bg-red-500">{status}</Badge>
      case "Idle":
        return <Badge className="bg-yellow-500">{status}</Badge>
      case "Charging":
        return <Badge className="bg-purple-500">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Robot Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Robot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Robot</DialogTitle>
              <DialogDescription>Enter the details for the new robot.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-id" className="text-right">
                  Robot ID
                </Label>
                <Input
                  id="robot-id"
                  value={newRobot.id}
                  onChange={(e) => setNewRobot({ ...newRobot, id: e.target.value })}
                  className="col-span-3"
                  placeholder="ROB-XXX"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="robot-name"
                  value={newRobot.name}
                  onChange={(e) => setNewRobot({ ...newRobot, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Delivery Bot X"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-model" className="text-right">
                  Model
                </Label>
                <Select
                  defaultValue={newRobot.model}
                  onValueChange={(value) => setNewRobot({ ...newRobot, model: value })}
                >
                  <SelectTrigger id="robot-model" className="col-span-3">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MSDS-2000">MSDS-2000</SelectItem>
                    <SelectItem value="MSDS-2500">MSDS-2500</SelectItem>
                    <SelectItem value="MSDS-3000">MSDS-3000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-speed" className="text-right">
                  Max Speed (m/s)
                </Label>
                <Input
                  id="robot-speed"
                  type="number"
                  value={newRobot.maxSpeed}
                  onChange={(e) => setNewRobot({ ...newRobot, maxSpeed: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                  step="0.1"
                  min="0.5"
                  max="3.0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-capacity" className="text-right">
                  Task Capacity
                </Label>
                <Input
                  id="robot-capacity"
                  type="number"
                  value={newRobot.taskCapacity}
                  onChange={(e) => setNewRobot({ ...newRobot, taskCapacity: Number.parseInt(e.target.value) })}
                  className="col-span-3"
                  min="1"
                  max="10"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-status" className="text-right">
                  Status
                </Label>
                <Select
                  defaultValue={newRobot.status}
                  onValueChange={(value) => setNewRobot({ ...newRobot, status: value })}
                >
                  <SelectTrigger id="robot-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Idle">Idle</SelectItem>
                    <SelectItem value="Out of Order">Out of Order</SelectItem>
                    <SelectItem value="Charging">Charging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-floor" className="text-right">
                  Assigned Floor
                </Label>
                <Select
                  defaultValue={newRobot.floor}
                  onValueChange={(value) => setNewRobot({ ...newRobot, floor: value })}
                >
                  <SelectTrigger id="robot-floor" className="col-span-3">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                    <SelectItem value="Basement">Basement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="robot-maintenance" className="text-right">
                  Maintenance
                </Label>
                <Select
                  defaultValue={newRobot.maintenanceSchedule}
                  onValueChange={(value) => setNewRobot({ ...newRobot, maintenanceSchedule: value })}
                >
                  <SelectTrigger id="robot-maintenance" className="col-span-3">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="robot-notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="robot-notes"
                  value={newRobot.notes}
                  onChange={(e) => setNewRobot({ ...newRobot, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="Additional information about this robot"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRobot}>Add Robot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Robot Fleet</CardTitle>
              <CardDescription>Manage and monitor your robot fleet from this dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Tasks Today</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {robots.map((robot) => (
                    <TableRow key={robot.id}>
                      <TableCell className="font-medium">{robot.id}</TableCell>
                      <TableCell>{robot.name}</TableCell>
                      <TableCell>{getStatusBadge(robot.status)}</TableCell>
                      <TableCell>{formatDate(robot.lastActive)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Battery className={`h-4 w-4 ${robot.battery < 20 ? "text-red-500" : "text-green-500"}`} />
                          <span>{robot.battery}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{robot.tasksCompleted}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRobot(robot)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRobot(robot.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">98.7%</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last 30 days average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Robots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {robots.filter((r) => r.status !== "Out of Order").length}/{robots.length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Robots currently in service</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {robots.reduce((acc, robot) => acc + robot.tasksCompleted, 0)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Completed today</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent robot activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Robot</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActivityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>{log.robotId}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Robot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Robot</DialogTitle>
            <DialogDescription>Update the details for {selectedRobot?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-id" className="text-right">
                Robot ID
              </Label>
              <Input id="edit-robot-id" value={selectedRobot?.id} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-robot-name"
                value={selectedRobot?.name}
                onChange={(e) => setSelectedRobot({ ...selectedRobot, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-model" className="text-right">
                Model
              </Label>
              <Input
                id="edit-robot-model"
                value={selectedRobot?.model}
                onChange={(e) => setSelectedRobot({ ...selectedRobot, model: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-speed" className="text-right">
                Max Speed (m/s)
              </Label>
              <Input
                id="edit-robot-speed"
                type="number"
                value={selectedRobot?.maxSpeed}
                onChange={(e) => setSelectedRobot({ ...selectedRobot, maxSpeed: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-capacity" className="text-right">
                Task Capacity
              </Label>
              <Input
                id="edit-robot-capacity"
                type="number"
                value={selectedRobot?.taskCapacity}
                onChange={(e) => setSelectedRobot({ ...selectedRobot, taskCapacity: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => setSelectedRobot({ ...selectedRobot, status: value })}
                defaultValue={selectedRobot?.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Out of Order">Out of Order</SelectItem>
                  <SelectItem value="Idle">Idle</SelectItem>
                  <SelectItem value="Charging">Charging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-robot-floor" className="text-right">
                Assigned Floor
              </Label>
              <Input
                id="edit-robot-floor"
                value={selectedRobot?.floor}
                onChange={(e) => setSelectedRobot({ ...selectedRobot, floor: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRobot}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
