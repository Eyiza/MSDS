"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Battery, Tag, Wifi, AlertTriangle, Users, Activity, Cpu, HardDrive, Database } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Sample data for the charts and statistics
const robotStatusData = [
  { name: "Active", value: 12, color: "#10b981" },
  { name: "Idle", value: 5, color: "#3b82f6" },
  { name: "Charging", value: 3, color: "#f59e0b" },
  { name: "Maintenance", value: 2, color: "#ef4444" },
]

const tagTypeData = [
  { name: "RFID Tags", value: 156, color: "#8b5cf6" },
  { name: "BLE Beacons", value: 87, color: "#ec4899" },
]

const issueData = [
  { day: "Mon", issues: 3 },
  { day: "Tue", issues: 5 },
  { day: "Wed", issues: 2 },
  { day: "Thu", issues: 7 },
  { day: "Fri", issues: 4 },
  { day: "Sat", issues: 1 },
  { day: "Sun", issues: 0 },
]

const recentIssues = [
  {
    id: "ISS-1234",
    user: "Sarah Johnson",
    type: "Navigation Error",
    robot: "RBT-003",
    status: "Open",
    date: "2023-05-16",
  },
  {
    id: "ISS-1233",
    user: "Michael Chen",
    type: "Delivery Failure",
    robot: "RBT-007",
    status: "In Progress",
    date: "2023-05-15",
  },
  {
    id: "ISS-1232",
    user: "Emily Rodriguez",
    type: "Battery Issue",
    robot: "RBT-002",
    status: "Resolved",
    date: "2023-05-14",
  },
  {
    id: "ISS-1231",
    user: "David Kim",
    type: "Sensor Malfunction",
    robot: "RBT-005",
    status: "Open",
    date: "2023-05-14",
  },
]

const systemMetrics = [
  { name: "CPU Usage", value: "32%", icon: Cpu, status: "normal" },
  { name: "Memory Usage", value: "45%", icon: HardDrive, status: "normal" },
  { name: "Database Size", value: "1.2 GB", icon: Database, status: "normal" },
  { name: "Network Latency", value: "24ms", icon: Wifi, status: "normal" },
]

export default function EngineerDashboard() {
  const [activeRobots, setActiveRobots] = useState(12)
  const [totalRobots, setTotalRobots] = useState(22)
  const [rfidTags, setRfidTags] = useState(156)
  const [bleBeacons, setBleBeacons] = useState(87)
  const [activeUsers, setActiveUsers] = useState(34)
  const [openIssues, setOpenIssues] = useState(8)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate values slightly to simulate real-time changes
      setActiveRobots((prev) => Math.max(10, Math.min(15, prev + Math.floor(Math.random() * 3) - 1)))
      setRfidTags((prev) => prev + (Math.random() > 0.8 ? 1 : 0))
      setBleBeacons((prev) => prev + (Math.random() > 0.9 ? 1 : 0))
      setActiveUsers((prev) => Math.max(30, Math.min(40, prev + Math.floor(Math.random() * 3) - 1)))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Engineer Dashboard</h1>
            <p className="text-muted-foreground mt-1">System overview and administration</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1"
            >
              <Activity className="h-4 w-4 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Robots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Battery className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-2xl font-bold">
                      {activeRobots}/{totalRobots}
                    </div>
                    <p className="text-xs text-muted-foreground">Active/Total</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {Math.round((activeRobots / totalRobots) * 100)}% Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Identification Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-2xl font-bold">{rfidTags + bleBeacons}</div>
                    <p className="text-xs text-muted-foreground">
                      {rfidTags} RFID, {bleBeacons} BLE
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {Math.round((rfidTags / (rfidTags + bleBeacons)) * 100)}% RFID
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                >
                  8 Engineers
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-2xl font-bold">{openIssues}</div>
                    <p className="text-xs text-muted-foreground">3 Critical</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                >
                  Attention Needed
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Info */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle>Robot Status</CardTitle>
              <CardDescription>Current status of all robots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={robotStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {robotStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle>Tag Distribution</CardTitle>
              <CardDescription>RFID tags vs BLE beacons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tagTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {tagTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle>Weekly Issues</CardTitle>
              <CardDescription>Number of reported issues per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={issueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="issues" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Current system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{metric.name}</p>
                    <div className="flex items-center">
                      <p className="font-bold">{metric.value}</p>
                      <Badge
                        variant="outline"
                        className="ml-2 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        Normal
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
            <CardDescription>Latest reported problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">ID</th>
                    <th className="text-left py-3 px-2 font-medium">User</th>
                    <th className="text-left py-3 px-2 font-medium">Type</th>
                    <th className="text-left py-3 px-2 font-medium">Robot</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue) => (
                    <tr key={issue.id} className="border-b">
                      <td className="py-3 px-2 font-mono text-sm">{issue.id}</td>
                      <td className="py-3 px-2">{issue.user}</td>
                      <td className="py-3 px-2">{issue.type}</td>
                      <td className="py-3 px-2 font-mono text-sm">{issue.robot}</td>
                      <td className="py-3 px-2">{issue.date}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant="outline"
                          className={
                            issue.status === "Open"
                              ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : issue.status === "In Progress"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          }
                        >
                          {issue.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
