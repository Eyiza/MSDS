"use client"

import { useState } from "react"
import {
  Wrench,
  Download,
  Play,
  Volume2,
  Compass,
  Wifi,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  Tag,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for system logs
const mockSystemLogs = [
  {
    id: 1,
    type: "System Boot",
    timestamp: "2023-06-15T08:00:00",
    robotId: "ROB-001",
    message: "System initialized successfully",
    level: "info",
  },
  {
    id: 2,
    type: "Error",
    timestamp: "2023-06-15T09:30:00",
    robotId: "ROB-002",
    message: "Navigation error: Unable to locate position",
    level: "error",
  },
  {
    id: 3,
    type: "Delivery Failure",
    timestamp: "2023-06-15T10:15:00",
    robotId: "ROB-003",
    message: "Delivery failed: Destination unreachable",
    level: "warning",
  },
  {
    id: 4,
    type: "System Boot",
    timestamp: "2023-06-15T07:45:00",
    robotId: "ROB-004",
    message: "System initialized successfully",
    level: "info",
  },
  {
    id: 5,
    type: "Error",
    timestamp: "2023-06-14T16:20:00",
    robotId: "ROB-003",
    message: "Battery critical: Emergency shutdown initiated",
    level: "error",
  },
]

export default function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState("logs")
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, string>>({})
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // Function to run a diagnostic test
  const runDiagnostic = (testName: string) => {
    setIsRunningDiagnostic({ ...isRunningDiagnostic, [testName]: true })
    setDiagnosticResults({ ...diagnosticResults, [testName]: "In Progress" })

    // Simulate diagnostic test
    setTimeout(() => {
      // Randomly determine if test passes or fails (80% pass rate)
      const result = Math.random() > 0.2 ? "Success" : "Failed"
      setDiagnosticResults({ ...diagnosticResults, [testName]: result })
      setIsRunningDiagnostic({ ...isRunningDiagnostic, [testName]: false })
    }, 2000)
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Function to get log level badge
  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  // Function to get diagnostic result badge
  const getDiagnosticBadge = (result: string) => {
    switch (result) {
      case "Success":
        return <Badge className="bg-green-500">Success</Badge>
      case "Failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "In Progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      default:
        return <Badge className="bg-gray-500">Not Run</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Diagnostics & Logs</h1>
      </div>

      <Tabs defaultValue="logs" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="diagnostics">Run Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Boots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {mockSystemLogs.filter((log) => log.type === "System Boot").length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {mockSystemLogs.filter((log) => log.type === "Error").length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Delivery Failures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {mockSystemLogs.filter((log) => log.type === "Delivery Failure").length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>View and download system logs</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Robot</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSystemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>{log.robotId}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hardware Diagnostics</CardTitle>
                <CardDescription>Run tests on robot hardware components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Test Motors</h3>
                      <p className="text-sm text-muted-foreground">Verify motor functionality and calibration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRunningDiagnostic["motors"] ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <Progress value={45} className="w-20" />
                      </div>
                    ) : (
                      getDiagnosticBadge(diagnosticResults["motors"] || "Not Run")
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRunningDiagnostic["motors"]}
                      onClick={() => runDiagnostic("motors")}
                    >
                      Run Test
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Play Audio</h3>
                      <p className="text-sm text-muted-foreground">Test speaker and audio system</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRunningDiagnostic["audio"] ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <Progress value={45} className="w-20" />
                      </div>
                    ) : (
                      getDiagnosticBadge(diagnosticResults["audio"] || "Not Run")
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRunningDiagnostic["audio"]}
                      onClick={() => runDiagnostic("audio")}
                    >
                      Run Test
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Compass className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">IMU Check</h3>
                      <p className="text-sm text-muted-foreground">Verify IMU calibration and readings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRunningDiagnostic["imu"] ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <Progress value={45} className="w-20" />
                      </div>
                    ) : (
                      getDiagnosticBadge(diagnosticResults["imu"] || "Not Run")
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRunningDiagnostic["imu"]}
                      onClick={() => runDiagnostic("imu")}
                    >
                      Run Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sensor Diagnostics</CardTitle>
                <CardDescription>Run tests on robot sensors and scanners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">RFID Scanner Check</h3>
                      <p className="text-sm text-muted-foreground">Verify RFID scanner functionality</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRunningDiagnostic["rfid"] ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <Progress value={45} className="w-20" />
                      </div>
                    ) : (
                      getDiagnosticBadge(diagnosticResults["rfid"] || "Not Run")
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRunningDiagnostic["rfid"]}
                      onClick={() => runDiagnostic("rfid")}
                    >
                      Run Test
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">BLE Scanner Check</h3>
                      <p className="text-sm text-muted-foreground">Verify BLE scanner functionality</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRunningDiagnostic["ble"] ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <Progress value={45} className="w-20" />
                      </div>
                    ) : (
                      getDiagnosticBadge(diagnosticResults["ble"] || "Not Run")
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRunningDiagnostic["ble"]}
                      onClick={() => runDiagnostic("ble")}
                    >
                      Run Test
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Full System Check</h3>
                      <p className="text-sm text-muted-foreground">Run comprehensive diagnostics on all systems</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRunningDiagnostic["full"] ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <Progress value={45} className="w-20" />
                      </div>
                    ) : (
                      getDiagnosticBadge(diagnosticResults["full"] || "Not Run")
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRunningDiagnostic["full"]}
                      onClick={() => runDiagnostic("full")}
                    >
                      Run Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Diagnostic Results</CardTitle>
                <CardDescription>View detailed results from diagnostic tests</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(diagnosticResults).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Diagnostics Run</h3>
                    <p className="text-sm text-muted-foreground">Run a diagnostic test to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(diagnosticResults).map(([test, result]) => (
                      <div key={test} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium capitalize">{test} Test</h3>
                          {getDiagnosticBadge(result)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result === "Success"
                            ? `${test} test completed successfully. All systems functioning normally.`
                            : result === "Failed"
                              ? `${test} test failed. Please check hardware connections and try again.`
                              : `${test} test is currently running...`}
                        </p>
                        {result === "Success" && (
                          <div className="mt-2 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Verified at {new Date().toLocaleString()}
                          </div>
                        )}
                        {result === "Failed" && (
                          <div className="mt-2 text-xs text-red-600">
                            <XCircle className="h-3 w-3 inline mr-1" />
                            Error code: E{Math.floor(Math.random() * 1000)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
