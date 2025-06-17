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
import {
  MapPin,
  User,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Edit,
  Search,
  Filter,
  Package,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { TrackProgressDialog } from "@/components/track-progress-dialog"
import { MapDestinationSelector } from "@/components/map-destination-selector"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DeliveryTask {
  id: string
  patient: string
  location: string
  deliveryItem: string
  status: "todo" | "queued" | "in-progress" | "completed" | "failed"
  message: string
  created: string
  completed?: string
  failReason?: string
}

interface TaskCardProps {
  id: string
  patient: string
  location: string
  deliveryItem: string
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

// Sample locations data
const locations = [
  { id: "loc-001", name: "Ward A", type: "ward" },
  { id: "loc-002", name: "Room 101", type: "room" },
  { id: "loc-003", name: "Charging Base 1", type: "base" },
  { id: "loc-004", name: "Ward B", type: "ward" },
  { id: "loc-005", name: "Room 201", type: "room" },
]

function TaskCard({
  id,
  patient,
  location,
  deliveryItem,
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
          <CardTitle>{location}</CardTitle>
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
            <span className="text-sm text-muted-foreground">Item</span>
            <span className="font-medium">{deliveryItem}</span>
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
                  location,
                  deliveryItem,
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
                  location,
                  deliveryItem,
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
                location,
                deliveryItem,
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
                location,
                deliveryItem,
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
                location,
                deliveryItem,
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

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<TaskCardProps | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [editTask, setEditTask] = useState<TaskCardProps | null>(null)
  const [editedMessage, setEditedMessage] = useState("")
  const [editedDeliveryItem, setEditedDeliveryItem] = useState("")
  const [trackingTask, setTrackingTask] = useState<DeliveryTask | null>(null)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<{ ward: string; room?: string } | null>(null)
  const [isEditMapSelectorOpen, setIsEditMapSelectorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState<"id" | "location" | "patient">("id")
  const [taskToDelete, setTaskToDelete] = useState<TaskCardProps | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form state for new task creation
  const [deliveryItem, setDeliveryItem] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [taskMessage, setTaskMessage] = useState("")
  const [taskPriority, setTaskPriority] = useState("normal")

  // Sample data for todo tasks - updated with delivery items
  const todoTasks = [
    {
      id: "T-1004",
      patient: "Michael Brown",
      location: "Ward A",
      deliveryItem: "Medication",
      status: "todo" as const,
      message: "Your medication has arrived.",
      created: "Today, 9:30 AM",
    },
    {
      id: "T-1005",
      patient: "Sarah Wilson",
      location: "Room 201",
      deliveryItem: "Medical Supplies",
      status: "todo" as const,
      message: "Here's your scheduled medication.",
      created: "Today, 10:15 AM",
    },
    {
      id: "T-1006",
      patient: "David Miller",
      location: "Ward B",
      deliveryItem: "Documents",
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
      location: "Room 101",
      deliveryItem: "Medication",
      status: "queued" as const,
      message: "Your medication has arrived.",
      created: "Today, 8:45 AM",
    },
    {
      id: "T-1003",
      patient: "Robert Johnson",
      location: "Ward B",
      deliveryItem: "Meal",
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
      location: "Ward A",
      deliveryItem: "Equipment",
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
      location: "Room 101",
      deliveryItem: "Medication",
      status: "completed" as const,
      message: "Your medication has arrived.",
      created: "Yesterday, 4:15 PM",
      completed: "Yesterday, 4:30 PM",
    },
    {
      id: "T-0999",
      patient: "Michael Wilson",
      location: "Ward B",
      deliveryItem: "Medical Supplies",
      status: "completed" as const,
      message: "Here's your scheduled medication.",
      created: "Yesterday, 4:45 PM",
      completed: "Yesterday, 5:00 PM",
    },
    {
      id: "T-1000",
      patient: "Sarah Brown",
      location: "Room 201",
      deliveryItem: "Documents",
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
      location: "Ward A",
      deliveryItem: "Medication",
      status: "failed" as const,
      message: "Your medication has arrived.",
      created: "Yesterday, 3:15 PM",
      failReason: "Patient not found in room",
    },
    {
      id: "T-0997",
      patient: "Lisa Johnson",
      location: "Room 101",
      deliveryItem: "Equipment",
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
          return task.location.toLowerCase().includes(searchLower)
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
    setEditedDeliveryItem(task.deliveryItem)
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
      location: task.location,
      deliveryItem: task.deliveryItem,
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

  // Create a new task
  const handleCreateTask = () => {
    // Validate form
    if (!selectedPatient || !selectedLocation || !deliveryItem || !taskMessage) {
      alert("Please fill in all required fields")
      return
    }

    // Here you would typically save to a database
    alert(`Task created for patient ${selectedPatient} to location ${selectedLocation} with item ${deliveryItem}`)

    // Reset form
    setSelectedPatient("")
    setSelectedLocation("")
    setDeliveryItem("")
    setTaskMessage("")
    setTaskPriority("normal")
  }

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
                        <CardTitle>{task.location}</CardTitle>
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
                        <span className="text-sm text-muted-foreground">Item</span>
                        <span className="font-medium">{task.deliveryItem}</span>
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
                  location={task.location}
                  deliveryItem={task.deliveryItem}
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
                  location={task.location}
                  deliveryItem={task.deliveryItem}
                  status={task.status}
                  message={task.message}
                  created={task.created}
                  onViewDetails={(task) => setSelectedTask(task)}
                  onTrackProgress={handleTrackProgress}
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
                  location={task.location}
                  deliveryItem={task.deliveryItem}
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
                  location={task.location}
                  deliveryItem={task.deliveryItem}
                  status={task.status}
                  message={task.message}
                  created={task.created}
                  failReason={task.failReason}
                  onViewDetails={(task) => setSelectedTask(task)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Delivery Task</CardTitle>
                <CardDescription>Schedule a new delivery task for the robot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient">Patient</Label>
                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                            <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                            <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                            <SelectItem value="David Miller">David Miller</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="use-patient-location">Use Patient Location from Database</Label>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            Always On
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Automatically uses the patient's stored location
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={true}>
                        <SelectTrigger>
                          <SelectValue placeholder="Using patient location from database" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name} ({location.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-item">Delivery Item</Label>
                      <Input
                        id="delivery-item"
                        placeholder="Enter item to deliver (e.g., Medication, Medical supplies, etc.)"
                        value={deliveryItem}
                        onChange={(e) => setDeliveryItem(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Input
                        id="message"
                        placeholder="Enter a message for the patient"
                        value={taskMessage}
                        onChange={(e) => setTaskMessage(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={taskPriority} onValueChange={setTaskPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Task Details Dialog */}
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>View details for task {selectedTask?.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                <Badge
                  variant={
                    selectedTask?.status === "completed"
                      ? "outline"
                      : selectedTask?.status === "failed"
                        ? "outline"
                        : "default"
                  }
                  className={
                    selectedTask?.status === "completed"
                      ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : selectedTask?.status === "failed"
                        ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : ""
                  }
                >
                  {selectedTask?.status === "completed"
                    ? "Completed"
                    : selectedTask?.status === "failed"
                      ? "Failed"
                      : selectedTask?.status === "in-progress"
                        ? "In Progress"
                        : selectedTask?.status === "queued"
                          ? "Queued"
                          : "To Do"}
                </Badge>
              </div>
              <div className="border-t my-3"></div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Patient:</span>
                <span>{selectedTask?.patient}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span>{selectedTask?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Delivery Item:</span>
                <span>{selectedTask?.deliveryItem}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Message:</span>
                <span>{selectedTask?.message}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span>{selectedTask?.created}</span>
              </div>
              {selectedTask?.completed && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Completed:</span>
                  <span>{selectedTask.completed}</span>
                </div>
              )}
              {selectedTask?.failReason && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Failure Reason:</span>
                  <span>{selectedTask.failReason}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedTask?.status === "failed" && (
                <Button onClick={() => handleRetryDelivery(selectedTask)}>Retry Delivery</Button>
              )}
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update details for task {editTask?.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patient">Patient</Label>
                <Select defaultValue={editTask?.patient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                    <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="David Miller">David Miller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-use-patient-location">Use Patient Location from Database</Label>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Always On
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Automatically uses the patient's stored location</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select defaultValue={editTask?.location} disabled={true}>
                  <SelectTrigger>
                    <SelectValue placeholder="Using patient location from database" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name} ({location.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-delivery-item">Delivery Item</Label>
                <Input
                  id="edit-delivery-item"
                  value={editedDeliveryItem}
                  onChange={(e) => setEditedDeliveryItem(e.target.value)}
                  placeholder="Enter item to deliver"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-message">Message</Label>
                <Input
                  id="edit-message"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  placeholder="Enter a message for the patient"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTask(null)}>
                Cancel
              </Button>
              <Button onClick={saveEditedTask}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Task Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Task ID: <span className="font-medium">{taskToDelete?.id}</span>
              </p>
              <p>
                Patient: <span className="font-medium">{taskToDelete?.patient}</span>
              </p>
              <p>
                Location: <span className="font-medium">{taskToDelete?.location}</span>
              </p>
              <p>
                Item: <span className="font-medium">{taskToDelete?.deliveryItem}</span>
              </p>
            </div>
            <DialogFooter>
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
          onSelect={handleSelectDestination}
        />
      </div>
    </div>
  )
}
