"use client"

import { useState } from "react"
import { UsersIcon, Search, MoreHorizontal, UserCheck, UserX, Clock, Shield, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for users
const mockUsers = [
  {
    id: "USR-001",
    name: "John Smith",
    email: "john.smith@hospital.org",
    role: "Admin",
    department: "IT",
    lastLogin: "2023-06-15T10:30:00",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@hospital.org",
    role: "Nurse",
    department: "Emergency",
    lastLogin: "2023-06-15T09:45:00",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Michael Brown",
    email: "michael.brown@hospital.org",
    role: "Engineer",
    department: "Robotics",
    lastLogin: "2023-06-15T08:15:00",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily.davis@hospital.org",
    role: "Nurse",
    department: "Pediatrics",
    lastLogin: "2023-06-14T16:20:00",
    status: "Inactive",
  },
  {
    id: "USR-005",
    name: "Robert Wilson",
    email: "robert.wilson@hospital.org",
    role: "Admin",
    department: "Management",
    lastLogin: "2023-06-15T11:10:00",
    status: "Active",
  },
  {
    id: "USR-006",
    name: "Jennifer Lee",
    email: "jennifer.lee@hospital.org",
    role: "Engineer",
    department: "Robotics",
    lastLogin: "2023-06-15T07:30:00",
    status: "Active",
  },
  {
    id: "USR-007",
    name: "David Miller",
    email: "david.miller@hospital.org",
    role: "Nurse",
    department: "Surgery",
    lastLogin: "2023-06-14T14:45:00",
    status: "Inactive",
  },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const router = useRouter()

  // Function to toggle user status
  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          status: user.status === "Active" ? "Inactive" : "Active",
        }
      }
      return user
    })
    setUsers(updatedUsers)
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Function to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "All" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Nurse">Nurse</SelectItem>
            <SelectItem value="Engineer">Engineer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {users.filter((u) => u.status === "Active").length} active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engineers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-primary mr-2" />
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "Engineer").length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Robotics engineering staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {
                  users.filter((u) => {
                    const loginDate = new Date(u.lastLogin)
                    const today = new Date()
                    return loginDate.toDateString() === today.toDateString()
                  }).length
                }
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Users logged in today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>Manage user accounts and access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                          alt={user.name}
                        />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "Admin"
                          ? "bg-purple-500"
                          : user.role === "Engineer"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>
                    <Badge className={user.status === "Active" ? "bg-green-500" : "bg-gray-500"}>{user.status}</Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          {user.status === "Active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Disable Account
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Enable Account
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
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
    </div>
  )
}
