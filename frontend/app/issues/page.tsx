"use client"

import { useState } from "react"
import { Search, CheckCircle, ArrowUpRight, MessageSquare, MoreHorizontal, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

// Mock data for complaints
const mockComplaints = [
  {
    id: "COMP-001",
    user: "Sarah Johnson",
    date: "2023-06-15T10:30:00",
    issueType: "Delivery Failure",
    robotId: "ROB-001",
    taskId: "TASK-123",
    status: "Open",
    description:
      "Robot failed to deliver supplies to Room 302. It stopped in the hallway and reported an obstacle, but the hallway was clear.",
    notes: [],
  },
  {
    id: "COMP-002",
    user: "Michael Brown",
    date: "2023-06-15T09:45:00",
    issueType: "Navigation Error",
    robotId: "ROB-002",
    taskId: "TASK-124",
    status: "In Progress",
    description: "Robot took a wrong turn and ended up in the wrong department. Had to be manually redirected.",
    notes: [
      {
        author: "Jennifer Lee",
        date: "2023-06-15T11:30:00",
        text: "Investigating navigation issue. Initial analysis suggests a mapping problem in the north corridor.",
      },
    ],
  },
  {
    id: "COMP-003",
    user: "Emily Davis",
    date: "2023-06-14T16:20:00",
    issueType: "Battery Issue",
    robotId: "ROB-003",
    taskId: "TASK-120",
    status: "Resolved",
    description:
      "Robot reported low battery mid-delivery and had to return to charging station, leaving delivery incomplete.",
    notes: [
      {
        author: "Robert Wilson",
        date: "2023-06-14T17:15:00",
        text: "Checked battery health. Battery is showing signs of degradation and needs replacement.",
      },
      {
        author: "Jennifer Lee",
        date: "2023-06-15T09:00:00",
        text: "Battery replaced. Robot is back in service with full capacity.",
      },
    ],
  },
  {
    id: "COMP-004",
    user: "John Smith",
    date: "2023-06-15T08:30:00",
    issueType: "Software Crash",
    robotId: "ROB-004",
    taskId: "TASK-125",
    status: "Escalated",
    description: "Robot UI froze during task assignment and had to be manually restarted.",
    notes: [
      {
        author: "Jennifer Lee",
        date: "2023-06-15T09:30:00",
        text: "Initial investigation shows a potential memory leak in the UI module. Escalating to software team.",
      },
    ],
  },
  {
    id: "COMP-005",
    user: "David Miller",
    date: "2023-06-14T14:45:00",
    issueType: "Collision",
    robotId: "ROB-005",
    taskId: "TASK-119",
    status: "Resolved",
    description: "Robot bumped into a cart that was left in the hallway. No damage, but delivery was delayed.",
    notes: [
      {
        author: "Michael Brown",
        date: "2023-06-14T15:30:00",
        text: "Checked robot sensors and bumpers. All functioning normally. This appears to be an environmental issue rather than a robot malfunction.",
      },
      {
        author: "Robert Wilson",
        date: "2023-06-14T16:00:00",
        text: "Spoke with department about keeping hallways clear. Issue resolved.",
      },
    ],
  },
]

export default function IssueReportsPage() {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const router = useRouter()

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-yellow-500">{status}</Badge>
      case "In Progress":
        return <Badge className="bg-blue-500">{status}</Badge>
      case "Resolved":
        return <Badge className="bg-green-500">{status}</Badge>
      case "Escalated":
        return <Badge className="bg-red-500">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Function to view complaint details
  const viewComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
    setIsDetailDialogOpen(true)
  }

  // Function to add a note to a complaint
  const addNote = () => {
    if (!newNote.trim()) return

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === selectedComplaint.id) {
        const updatedComplaint = {
          ...complaint,
          notes: [
            ...complaint.notes,
            {
              author: "Jennifer Lee", // Current engineer
              date: new Date().toISOString(),
              text: newNote,
            },
          ],
        }
        setSelectedComplaint(updatedComplaint)
        return updatedComplaint
      }
      return complaint
    })

    setComplaints(updatedComplaints)
    setNewNote("")
  }

  // Function to update complaint status
  const updateComplaintStatus = (id: string, newStatus: string) => {
    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === id) {
        const updatedComplaint = {
          ...complaint,
          status: newStatus,
        }
        if (selectedComplaint && selectedComplaint.id === id) {
          setSelectedComplaint(updatedComplaint)
        }
        return updatedComplaint
      }
      return complaint
    })

    setComplaints(updatedComplaints)
  }

  // Filter complaints based on search query and status filter
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.robotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "All" || complaint.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Complaints & Issue Reports</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {complaints.filter((c) => c.status === "Open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {complaints.filter((c) => c.status === "In Progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {complaints.filter((c) => c.status === "Resolved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Reports</CardTitle>
          <CardDescription>Manage and respond to user-reported issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Robot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>{complaint.user}</TableCell>
                  <TableCell>{formatDate(complaint.date)}</TableCell>
                  <TableCell>{complaint.issueType}</TableCell>
                  <TableCell>{complaint.robotId}</TableCell>
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => viewComplaintDetails(complaint)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {complaint.status !== "In Progress" && (
                            <DropdownMenuItem onClick={() => updateComplaintStatus(complaint.id, "In Progress")}>
                              <Clock className="mr-2 h-4 w-4" />
                              Mark In Progress
                            </DropdownMenuItem>
                          )}
                          {complaint.status !== "Resolved" && (
                            <DropdownMenuItem onClick={() => updateComplaintStatus(complaint.id, "Resolved")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Resolved
                            </DropdownMenuItem>
                          )}
                          {complaint.status !== "Escalated" && (
                            <DropdownMenuItem onClick={() => updateComplaintStatus(complaint.id, "Escalated")}>
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              Escalate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Complaint Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
            <DialogDescription>
              {selectedComplaint?.id} - {selectedComplaint?.issueType}
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Reported By</h3>
                  <p>{selectedComplaint.user}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Date</h3>
                  <p>{formatDate(selectedComplaint.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Robot</h3>
                  <p>{selectedComplaint.robotId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Task</h3>
                  <p>{selectedComplaint.taskId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <div>{getStatusBadge(selectedComplaint.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Issue Type</h3>
                  <p>{selectedComplaint.issueType}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Engineer Notes</h3>
                {selectedComplaint.notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notes yet</p>
                ) : (
                  <div className="space-y-3 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {selectedComplaint.notes.map((note: any, index: number) => (
                      <div key={index} className="text-sm border-b pb-2 last:border-0">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{note.author}</span>
                          <span>{formatDate(note.date)}</span>
                        </div>
                        <p>{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Add Note</h3>
                <Textarea
                  placeholder="Enter your notes here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button
                    variant={selectedComplaint.status === "In Progress" ? "secondary" : "outline"}
                    onClick={() => updateComplaintStatus(selectedComplaint.id, "In Progress")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    In Progress
                  </Button>
                  <Button
                    variant={selectedComplaint.status === "Resolved" ? "secondary" : "outline"}
                    onClick={() => updateComplaintStatus(selectedComplaint.id, "Resolved")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Resolved
                  </Button>
                  <Button
                    variant={selectedComplaint.status === "Escalated" ? "secondary" : "outline"}
                    onClick={() => updateComplaintStatus(selectedComplaint.id, "Escalated")}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Escalate
                  </Button>
                </div>
                <Button onClick={addNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
