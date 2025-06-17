"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { PlusCircle, Search, Shield, Users, Clock, Edit, Trash, CheckCircle, XCircle } from "lucide-react"

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState("engineers")

  // Mock data for engineers
  const engineers = [
    {
      id: "eng-001",
      name: "John Smith",
      email: "john.smith@msds.com",
      role: "Senior Engineer",
      lastLogin: "2023-05-15 09:30",
      status: "active",
    },
    {
      id: "eng-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@msds.com",
      role: "Junior Engineer",
      lastLogin: "2023-05-14 14:45",
      status: "active",
    },
    {
      id: "eng-003",
      name: "Michael Chen",
      email: "michael.chen@msds.com",
      role: "Senior Engineer",
      lastLogin: "2023-05-10 11:20",
      status: "inactive",
    },
    {
      id: "eng-004",
      name: "Emily Davis",
      email: "emily.davis@msds.com",
      role: "Junior Engineer",
      lastLogin: "2023-05-13 16:05",
      status: "active",
    },
  ]

  // Mock data for roles
  const roles = [
    {
      id: "role-001",
      name: "Senior Engineer",
      permissions: ["manage_robots", "manage_tags", "manage_users", "system_diagnostics", "debug_console", "mapping"],
      users: 2,
    },
    {
      id: "role-002",
      name: "Junior Engineer",
      permissions: ["view_robots", "view_tags", "system_diagnostics"],
      users: 2,
    },
    {
      id: "role-003",
      name: "Administrator",
      permissions: [
        "manage_robots",
        "manage_tags",
        "manage_users",
        "system_diagnostics",
        "debug_console",
        "mapping",
        "manage_roles",
      ],
      users: 1,
    },
  ]

  // Mock data for audit logs
  const auditLogs = [
    {
      id: "log-001",
      user: "John Smith",
      action: "Updated robot settings",
      timestamp: "2023-05-15 10:15",
      details: "Changed max speed from 1.2 m/s to 1.5 m/s for Robot-001",
    },
    {
      id: "log-002",
      user: "Sarah Johnson",
      action: "Added new RFID tag",
      timestamp: "2023-05-14 15:30",
      details: "Added RFID tag RF-2345 to the system",
    },
    {
      id: "log-003",
      user: "System",
      action: "Automatic backup",
      timestamp: "2023-05-14 00:00",
      details: "Daily system backup completed successfully",
    },
    {
      id: "log-004",
      user: "Michael Chen",
      action: "User role change",
      timestamp: "2023-05-13 09:45",
      details: "Changed Emily Davis role from Trainee to Junior Engineer",
    },
    {
      id: "log-005",
      user: "John Smith",
      action: "System restart",
      timestamp: "2023-05-12 14:20",
      details: "Initiated system restart after software update",
    },
  ]

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
            <p className="text-muted-foreground mt-1">Manage user access and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        <Tabs defaultValue="engineers" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="engineers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Engineers</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Roles & Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Audit Log</span>
            </TabsTrigger>
          </TabsList>

          {/* Engineers Tab */}
          <TabsContent value="engineers" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search engineers..." className="pl-8" />
              </div>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Engineer</span>
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Engineers</CardTitle>
                <CardDescription>Manage engineer accounts and access</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {engineers.map((engineer) => (
                      <TableRow key={engineer.id}>
                        <TableCell className="font-medium">{engineer.name}</TableCell>
                        <TableCell>{engineer.email}</TableCell>
                        <TableCell>{engineer.role}</TableCell>
                        <TableCell>{engineer.lastLogin}</TableCell>
                        <TableCell>
                          {engineer.status === "active" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              {engineer.status === "active" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-end">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Create Role</span>
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Configure role-based access control</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission, index) => (
                              <Badge key={index} variant="secondary" className="capitalize">
                                {permission.replace("_", " ")}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline">+{role.permissions.length - 3} more</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Export Logs</Button>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Track system changes and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
