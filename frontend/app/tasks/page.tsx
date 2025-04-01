"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, User, MessageSquare, Calendar, AlertTriangle, CheckCircle, Edit, Search, Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { TrackProgressDialog } from "@/components/track-progress-dialog"
import { MapDestinationSelector } from "@/components/map-destination-selector"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DeliveryTask {
  id: string
  patient: string
  ward: string
  room?: string
  status: "todo" | "queued" | "in-progress" | "completed" | "failed"
  message: string
  created: string
  completed?: string
  failReason?: string
}

interface TaskCardProps {
  id: string
  patient: string
  ward: string
  room?: string
  status: "todo" | "queued" | "in-progress" | "completed" | "failed"
  message: string
  created: string
  completed?: string
  failReason?: string
  onViewDetails: (task: TaskCardProps) => void
  onTrackProgress?: (task: TaskCardProps) => void
  onCancelTask?: (task: TaskCardProps) => void
  onDeleteTask?: (task: TaskCardProps) => void
}

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<TaskCardProps | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [editTask, setEditTask] = useState<TaskCardProps | null>(null)
  const [editedMessage, setEditedMessage] = useState("")
  const [trackingTask, setTrackingTask] = useState<DeliveryTask | null>(null)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<{ ward: string; room?: string } | null>(null)
  const [isEditMapSelectorOpen, setIsEditMapSelectorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState<"id" | "location" | "patient">("id")
  const [taskToDelete, setTaskToDelete] = useState<TaskCardProps | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Sample data for todo tasks
  const todoTasks = [
    {
      id: "T-1004",
      patient: "Michael Brown",
      ward: "Ward A",
      room: "Room 110",
      status: "todo" as const,
      message: "Your medication has arrived.",
      created: "Today, 9:30 AM",
    },
    {
      id: "T-1005",
      patient: "Sarah Wilson",
      ward: "Ward B",
      room: "Room 215",
      status: "todo" as const,
      message: "Here's your scheduled medication.",
      created: "Today, 10:15 AM",
    },
    {
      id: "T-1006",
      patient: "David Miller",
      ward: "Ward C",
      room: "Room 320",
      status: "todo" as const,
      message: "Medical supplies delivery.",
      created: "Today, 11:00 AM",
    },
  ]

  // Sample data for queued tasks
  const queuedTasks = [
    {
      id: "T-1002",
      patient: "Jane Smith",
      ward: "Ward B",
      room: "Room 210",
      status: "queued" as const,
      message: "Your medication has arrived.",
      created: "Today, 8:45 AM",
    },
    {
      id: "T-1003",
      patient: "Robert Johnson",
      ward: "Ward C",
      room: "Room 315",
      status: "queued" as const,
      message: "Here's your scheduled medication.",
      created: "Today, 9:00 AM",
    },
  ]

  // Sample data for active tasks
  const activeTasks = [
    {
      id: "T-1001",
      patient: "John Doe",
      ward: "Ward A",
      room: "Room 105",
      status: "in-progress" as const,
      message: "Your medication has arrived.",
      created: "Today, 8:30 AM",
    },
  ]

  // Sample data for completed tasks
  const completedTasks = [
    {
      id: "T-0998",
      patient: "Emily Davis",
      ward: "Ward A",
      room: "Room 102",
      status: "completed" as const,
      message: "Your medication has arrived.",
      created: "Yesterday, 4:15 PM",
      completed: "Yesterday, 4:30 PM",
    },
    {
      id: "T-0999",
      patient: "Michael Wilson",
      ward: "Ward B",
      room: "Room 205",
      status: "completed" as const,
      message: "Here's your scheduled medication.",
      created: "Yesterday, 4:45 PM",
      completed: "Yesterday, 5:00 PM",
    },
    {
      id: "T-1000",
      patient: "Sarah Brown",
      ward: "Ward C",
      room: "Room 310",
      status: "completed" as const,
      message: "Medical supplies delivery.",
      created: "Yesterday, 5:15 PM",
      completed: "Yesterday, 5:30 PM",
    },
  ]

  // Sample data for missed tasks
  const missedTasks = [
    {
      id: "T-0996",
      patient: "Thomas Anderson",
      ward: "Ward A",
      room: "Room 108",
      status: "failed" as const,
      message: "Your medication has arrived.",
      created: "Yesterday, 3:15 PM",
      failReason: "Patient not found in room",
    },
    {
      id: "T-0997",
      patient: "Lisa Johnson",
      ward: "Ward B",
      room: "Room 212",
      status: "failed" as const,
      message: "Here's your scheduled medication.",
      created: "Yesterday, 3:45 PM",
      failReason: "RFID tag not detected",
    },
  ]

  // Filter tasks based on search term and filter type
  const filterTasks = (tasks: any[]) => {
    if (!searchTerm) return tasks

    return tasks.filter((task) => {
      const searchLower = searchTerm.toLowerCase()

      switch (searchFilter) {
        case "id":
          return task.id.toLowerCase().includes(searchLower)
        case "location":
          const location = `${task.ward} ${task.room || ""}`.toLowerCase()
          return location.includes(searchLower)
        case "patient":
          return task.patient.toLowerCase().includes(searchLower)
        default:
          return true
      }
    })
  }

  // Handle cancel task
  const handleCancelTask = (task: TaskCardProps) => {
    // Here you would typically update your database
    // For now, we'll just show an alert
    alert(`Task ${task.id} has been moved back to To Do`)
  }

  // Handle delete task
  const handleDeleteTask = (task: TaskCardProps) => {
    setTaskToDelete(task)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete task
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      // Here you would typically update your database
      alert(`Task ${taskToDelete.id} has been deleted`)
      // In a real app, you would remove the task from the database
      setIsDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  // Handle task selection
  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  // Queue selected tasks
  const queueSelectedTasks = () => {
    // Here you would typically update your database
    // For now, we'll just clear the selection
    setSelectedTasks([])
    // Show a success message or notification
    alert(`Queued ${selectedTasks.length} tasks`)
  }

  // Handle retry delivery
  const handleRetryDelivery = (task: TaskCardProps) => {
    // Here you would typically update your database
    // For now, we'll just close the dialog
    setSelectedTask(null)
    // Show a success message or notification
    alert(`Task ${task.id} has been added to the queue`)
  }

  // Handle edit task
  const handleEditTask = (task: TaskCardProps) => {
    setEditTask(task)
    setEditedMessage(task.message)
  }

  // Save edited task
  const saveEditedTask = () => {
    // Here you would typically update your database
    // For now, we'll just close the dialog
    setEditTask(null)
    // Show a success message or notification
    alert(`Task ${editTask?.id} has been updated`)
  }

  // Handle track progress
  const handleTrackProgress = (task: TaskCardProps) => {
    // Convert TaskCardProps to DeliveryTask
    const deliveryTask: DeliveryTask = {
      id: task.id,
      patient: task.patient,
      ward: task.ward,
      room: task.room,
      status: task.status,
      message: task.message,
      created: task.created,
      completed: task.completed,
      failReason: task.failReason,
    }

    setTrackingTask(deliveryTask)
    setIsTrackingOpen(true)
  }

  const handleSelectDestination = (destination: { ward: string; room?: string }) => {
    setSelectedDestination(destination)
  }

  const handleOpenMapSelector = useCallback(() => {
    setIsMapSelectorOpen(true)
  }, [setIsMapSelectorOpen])

  // Update form fields when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      // This would update the form fields in a real app
      console.log("Selected destination:", selectedDestination)
    }
  }, [selectedDestination])

  // Render search bar
  const renderSearchBar = () => (
    <div className="flex items-center gap-2 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search tasks by ${searchFilter}...`}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSearchFilter("id")}>
            Search by ID {searchFilter === "id" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSearchFilter("location")}>
            Search by Location {searchFilter === "location" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSearchFilter("patient")}>
            Search by Patient {searchFilter === "patient" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Scheduling</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage delivery tasks for the robot</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status="idle" />
            <BatteryStatus level={85} />
            <div className="fixed z-50 top-6 right-6 md:static md:z-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="queued">Queued</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
            <TabsTrigger value="new">New Task</TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              {renderSearchBar()}
              <div className="flex items-center gap-4 ml-auto mr-4">
                <h2 className="text-lg font-medium">Pending Tasks ({selectedTasks.length} selected)</h2>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedTasks.length === todoTasks.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTasks(todoTasks.map((task) => task.id))
                      } else {
                        setSelectedTasks([])
                      }
                    }}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    Select All
                  </Label>
                </div>
              </div>
              <Button size="sm" onClick={queueSelectedTasks} disabled={selectedTasks.length === 0}>
                Queue Selected
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterTasks(todoTasks).map((task) => (
                <Card key={task.id} className={selectedTasks.includes(task.id) ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`select-${task.id}`}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskSelection(task.id)}
                        />
                        <CardTitle>
                          {task.ward}
                          {task.room ? ` - ${task.room}` : ""}
                        </CardTitle>
                      </div>
                      <Badge variant="outline">To Do</Badge>
                    </div>
                    <CardDescription className="mb-3">Task ID: {task.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-t my-3 pt-3"></div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Patient</span>
                        <span className="font-medium">{task.patient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span>{task.created}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Message</span>
                        <span className="text-right max-w-[60%]">{task.message}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTask(task)}
                      >
                        Delete
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" onClick={() => handleTaskSelection(task.id)}>
                        {selectedTasks.includes(task.id) ? "Deselect" : "Select"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="queued" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Queued Tasks</h2>
              {renderSearchBar()}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterTasks(queuedTasks).map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  patient={task.patient}
                  ward={task.ward}
                  room={task.room}
                  status={task.status}
                  message={task.message}
                  created={task.created}
                  onViewDetails={(task) => setSelectedTask(task)}
                  onCancelTask={handleCancelTask}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Active Tasks</h2>
              {renderSearchBar()}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterTasks(activeTasks).map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  patient={task.patient}
                  ward={task.ward}
                  room={task.room}
                  status={task.status}
                  message={task.message}
                  created={task.created}
                  onViewDetails={(task) => setSelectedTask(task)}
                  onTrackProgress={(task) => handleTrackProgress(task)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Completed Tasks</h2>
              {renderSearchBar()}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterTasks(completedTasks).map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  patient={task.patient}
                  ward={task.ward}
                  room={task.room}
                  status={task.status}
                  message={task.message}
                  created={task.created}
                  completed={task.completed}
                  onViewDetails={(task) => setSelectedTask(task)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="missed" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Missed Tasks</h2>
              {renderSearchBar()}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterTasks(missedTasks).map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  patient={task.patient}
                  ward={task.ward}
                  room={task.room}
                  status={task.status}
                  message={task.message}
                  created={task.created}
                  failReason={task.failReason}
                  onViewDetails={(task) => setSelectedTask(task)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Delivery Task</CardTitle>
                <CardDescription>Schedule a new delivery task for the robot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedDestination?.ward}
                        onValueChange={(value) => setSelectedDestination({ ...selectedDestination, ward: value })}
                      >
                        <SelectTrigger id="ward" className="flex-1">
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ward-a">Ward A</SelectItem>
                          <SelectItem value="ward-b">Ward B</SelectItem>
                          <SelectItem value="ward-c">Ward C</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => setIsMapSelectorOpen(true)}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room (Optional)</Label>
                    <Select
                      value={selectedDestination?.room}
                      onValueChange={(value) => setSelectedDestination({ ...selectedDestination, room: value })}
                    >
                      <SelectTrigger id="room">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room-101">Room 101</SelectItem>
                        <SelectItem value="room-102">Room 102</SelectItem>
                        <SelectItem value="room-103">Room 103</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger id="patient">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient-1">John Doe</SelectItem>
                        <SelectItem value="patient-2">Jane Smith</SelectItem>
                        <SelectItem value="patient-3">Robert Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Message to Patient</Label>
                    <Input id="notes" placeholder="Message the robot will speak to the patient" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Task</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Task Details Dialog */}
        {selectedTask && (
          <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
            <DialogContent className="max-w-md p-6">
              <DialogHeader className="mb-4">
                <DialogTitle>Task Details</DialogTitle>
                <DialogDescription>Detailed information about delivery task {selectedTask.id}</DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 py-2 px-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        selectedTask.status === "completed"
                          ? "outline"
                          : selectedTask.status === "failed"
                            ? "destructive"
                            : "default"
                      }
                      className={
                        selectedTask.status === "completed"
                          ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : ""
                      }
                    >
                      {selectedTask.status === "in-progress"
                        ? "In Progress"
                        : selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">ID: {selectedTask.id}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Patient</p>
                        <p className="text-sm text-muted-foreground">{selectedTask.patient}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTask.ward}
                          {selectedTask.room ? ` - ${selectedTask.room}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Message</p>
                        <p className="text-sm text-muted-foreground">{selectedTask.message}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm text-muted-foreground">{selectedTask.created}</p>
                      </div>
                    </div>

                    {selectedTask.completed && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Completed</p>
                          <p className="text-sm text-muted-foreground">{selectedTask.completed}</p>
                        </div>
                      </div>
                    )}

                    {selectedTask.status === "failed" && selectedTask.failReason && (
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Failure Reason</p>
                          <p className="text-sm text-muted-foreground">{selectedTask.failReason}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <h4 className="font-medium mb-2">Delivery Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-medium">Task Created</p>
                            <p className="text-xs text-muted-foreground">{selectedTask.created}</p>
                          </div>
                        </div>

                        {selectedTask.status !== "todo" && (
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              2
                            </div>
                            <div>
                              <p className="text-sm font-medium">Queued for Delivery</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedTask.created && selectedTask.created.includes(",")
                                  ? new Date(
                                      new Date(selectedTask.created.split(",")[1]).getTime() + 15 * 60000,
                                    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  : "Unknown time"}
                              </p>
                            </div>
                          </div>
                        )}

                        {(selectedTask.status === "in-progress" ||
                          selectedTask.status === "completed" ||
                          selectedTask.status === "failed") && (
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              3
                            </div>
                            <div>
                              <p className="text-sm font-medium">Delivery Started</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedTask.created && selectedTask.created.includes(",")
                                  ? new Date(
                                      new Date(selectedTask.created.split(",")[1]).getTime() + 30 * 60000,
                                    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  : "Unknown time"}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedTask.status === "completed" && (
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                            <div>
                              <p className="text-sm font-medium">Delivery Completed</p>
                              <p className="text-xs text-muted-foreground">{selectedTask.completed}</p>
                            </div>
                          </div>
                        )}

                        {selectedTask.status === "failed" && (
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                              !
                            </div>
                            <div>
                              <p className="text-sm font-medium">Delivery Failed</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedTask.created && selectedTask.created.includes(",")
                                  ? new Date(
                                      new Date(selectedTask.created.split(",")[1]).getTime() + 45 * 60000,
                                    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  : "Unknown time"}
                              </p>
                              <p className="text-xs text-red-500 mt-1">{selectedTask.failReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="mt-6">
                {selectedTask.status === "failed" && (
                  <Button variant="outline" className="mr-auto" onClick={() => handleRetryDelivery(selectedTask)}>
                    Retry Delivery
                  </Button>
                )}
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Task Dialog */}
        {editTask && (
          <Dialog open={!!editTask} onOpenChange={(open) => !open && setEditTask(null)}>
            <DialogContent className="max-w-md p-6">
              <DialogHeader className="mb-4">
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>Update delivery task {editTask.id}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-patient">Patient</Label>
                  <Input id="edit-patient" value={editTask.patient} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-location">Destination</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-location"
                      value={`${editTask?.ward}${editTask?.room ? ` - ${editTask.room}` : ""}`}
                      disabled
                    />
                    <Button variant="outline" size="icon" onClick={() => setIsEditMapSelectorOpen(true)}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-message">Message to Patient</Label>
                  <Input
                    id="edit-message"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    placeholder="Message the robot will speak to the patient"
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setEditTask(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedTask}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md p-6">
            <DialogHeader className="mb-4">
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete task {taskToDelete?.id}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteTask}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Track Progress Dialog */}
        <TrackProgressDialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen} task={trackingTask} />

        {/* Map Destination Selector */}
        <MapDestinationSelector
          open={isMapSelectorOpen}
          onOpenChange={setIsMapSelectorOpen}
          onSelectDestination={handleSelectDestination}
        />

        {/* Map Destination Selector for Editing */}
        <MapDestinationSelector
          open={isEditMapSelectorOpen}
          onOpenChange={setIsEditMapSelectorOpen}
          onSelectDestination={(destination) => {
            if (editTask) {
              setEditTask({
                ...editTask,
                ward: destination.ward,
                room: destination.room,
              })
            }
          }}
        />
      </div>
    </div>
  )
}

function TaskCard({
  id,
  patient,
  ward,
  room,
  status,
  message,
  created,
  completed,
  failReason,
  onViewDetails,
  onTrackProgress,
  onCancelTask,
  onDeleteTask,
}: TaskCardProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [editTask, setEditTask] = useState<TaskCardProps | null>(null)
  const handleEditTask = (task: TaskCardProps) => {
    setEditTask(task)
  }
  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }
  const statusConfig = {
    todo: {
      label: "To Do",
      variant: "outline" as const,
    },
    queued: {
      label: "Queued",
      variant: "outline" as const,
    },
    "in-progress": {
      label: "In Progress",
      variant: "default" as const,
    },
    completed: {
      label: "Completed",
      variant: "outline" as const,
      className: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    failed: {
      label: "Failed",
      variant: "outline" as const,
      className: "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
  }

  const config = statusConfig[status]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>
            {ward}
            {room ? ` - ${room}` : ""}
          </CardTitle>
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        </div>
        <CardDescription className="mb-3">Task ID: {id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-t my-3 pt-3"></div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Patient</span>
            <span className="font-medium">{patient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span>{created}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Message</span>
            <span className="text-right max-w-[60%]">{message}</span>
          </div>
          {status === "failed" && failReason && (
            <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{failReason}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        {status === "todo" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onDeleteTask &&
                onDeleteTask({
                  id,
                  patient,
                  ward,
                  room,
                  status,
                  message,
                  created,
                  completed,
                  failReason,
                  onViewDetails,
                  onTrackProgress,
                  onCancelTask,
                  onDeleteTask,
                })
              }
            >
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleEditTask({
                  id,
                  patient,
                  ward,
                  room,
                  status,
                  message,
                  created,
                  completed,
                  failReason,
                  onViewDetails,
                  onTrackProgress,
                  onCancelTask,
                  onDeleteTask,
                })
              }
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" onClick={() => handleTaskSelection(id)}>
              {selectedTasks.includes(id) ? "Deselect" : "Select"}
            </Button>
          </>
        )}
        {status === "queued" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onCancelTask &&
              onCancelTask({
                id,
                patient,
                ward,
                room,
                status,
                message,
                created,
                completed,
                failReason,
                onViewDetails,
                onTrackProgress,
                onCancelTask,
                onDeleteTask,
              })
            }
          >
            Cancel
          </Button>
        )}
        {status === "in-progress" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onTrackProgress &&
              onTrackProgress({
                id,
                patient,
                ward,
                room,
                status,
                message,
                created,
                completed,
                failReason,
                onViewDetails,
                onTrackProgress,
                onCancelTask,
                onDeleteTask,
              })
            }
          >
            Track Progress
          </Button>
        )}
        {(status === "completed" || status === "failed") && (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onViewDetails({
                id,
                patient,
                ward,
                room,
                status,
                message,
                created,
                completed,
                failReason,
                onViewDetails,
                onTrackProgress,
                onCancelTask,
                onDeleteTask,
              })
            }
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

