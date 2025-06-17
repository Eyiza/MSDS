"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  TerminalIcon,
  Send,
  Download,
  Trash,
  Play,
  Pause,
  RotateCw,
  MapIcon,
  Compass,
  Wifi,
  Activity,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for robots
const mockRobots = [
  { id: "ROB-001", name: "Delivery Bot 1" },
  { id: "ROB-002", name: "Delivery Bot 2" },
  { id: "ROB-003", name: "Delivery Bot 3" },
  { id: "ROB-004", name: "Delivery Bot 4" },
  { id: "ROB-005", name: "Delivery Bot 5" },
]

// Mock commands
const mockCommands = [
  { command: "RESTART", description: "Restart the robot" },
  { command: "STATUS", description: "Get current robot status" },
  { command: "CLEAR_MAP", description: "Clear the robot's map data" },
  { command: "MOVE", description: "Move to coordinates (X,Y)" },
  { command: "PAUSE", description: "Pause current task" },
  { command: "RESUME", description: "Resume current task" },
  { command: "CANCEL", description: "Cancel current task" },
]

export default function DebugConsolePage() {
  const [selectedRobot, setSelectedRobot] = useState(mockRobots[0].id)
  const [command, setCommand] = useState("")
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "MSDS Debug Console v1.0",
    "Type 'help' for a list of commands",
    "-----------------------------------",
  ])
  const [imuData, setImuData] = useState({
    acceleration: { x: 0, y: 0, z: 9.8 },
    orientation: { roll: 0, pitch: 0, yaw: 0 },
  })
  const [rssiData, setRssiData] = useState([
    { id: "BLE-001", rssi: -75, name: "Hallway Junction 1" },
    { id: "BLE-002", rssi: -82, name: "Emergency Exit 2" },
    { id: "BLE-003", rssi: -68, name: "Elevator Lobby" },
  ])
  const consoleEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-scroll to bottom of console
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [consoleOutput])

  // Simulate sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update IMU data with small random changes
      setImuData({
        acceleration: {
          x: Math.sin(Date.now() / 1000) * 0.2,
          y: Math.cos(Date.now() / 1000) * 0.2,
          z: 9.8 + (Math.random() * 0.1 - 0.05),
        },
        orientation: {
          roll: Math.sin(Date.now() / 2000) * 2,
          pitch: Math.cos(Date.now() / 2000) * 2,
          yaw: (Date.now() / 10000) % 360,
        },
      })

      // Update RSSI data with small random changes
      setRssiData(
        rssiData.map((beacon) => ({
          ...beacon,
          rssi: beacon.rssi + (Math.random() * 4 - 2),
        })),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [rssiData])

  // Function to handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    // Add command to console
    setConsoleOutput([...consoleOutput, `> ${selectedRobot}: ${command}`])

    // Process command
    processCommand(command)

    // Clear command input
    setCommand("")
  }

  // Function to process commands
  const processCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase()

    // Simulate command responses
    setTimeout(() => {
      if (lowerCmd === "help") {
        setConsoleOutput((prev) => [
          ...prev,
          "Available commands:",
          ...mockCommands.map((c) => `  ${c.command}: ${c.description}`),
          "",
        ])
      } else if (lowerCmd === "restart") {
        setConsoleOutput((prev) => [
          ...prev,
          `Restarting ${selectedRobot}...`,
          "System shutting down...",
          "Initializing boot sequence...",
          "Robot restarted successfully.",
          "",
        ])
      } else if (lowerCmd === "status") {
        setConsoleOutput((prev) => [
          ...prev,
          `Status for ${selectedRobot}:`,
          "Battery: 85%",
          "Current Task: None",
          "Position: X=23.5, Y=45.2",
          "Status: Idle",
          "",
        ])
      } else if (lowerCmd === "clear_map") {
        setConsoleOutput((prev) => [
          ...prev,
          `Clearing map data for ${selectedRobot}...`,
          "Map data cleared successfully.",
          "",
        ])
      } else if (lowerCmd.startsWith("move")) {
        const coords = lowerCmd.replace("move", "").trim()
        setConsoleOutput((prev) => [
          ...prev,
          `Moving ${selectedRobot} to coordinates ${coords}...`,
          "Navigation started.",
          "",
        ])
      } else if (lowerCmd === "pause") {
        setConsoleOutput((prev) => [...prev, `Pausing current task for ${selectedRobot}...`, "Task paused.", ""])
      } else if (lowerCmd === "resume") {
        setConsoleOutput((prev) => [...prev, `Resuming task for ${selectedRobot}...`, "Task resumed.", ""])
      } else if (lowerCmd === "cancel") {
        setConsoleOutput((prev) => [...prev, `Cancelling current task for ${selectedRobot}...`, "Task cancelled.", ""])
      } else {
        setConsoleOutput((prev) => [...prev, `Unknown command: ${cmd}`, "Type 'help' for a list of commands.", ""])
      }
    }, 500)
  }

  // Function to clear console
  const clearConsole = () => {
    setConsoleOutput([
      "MSDS Debug Console v1.0",
      "Type 'help' for a list of commands",
      "-----------------------------------",
    ])
  }

  // Function to download console logs
  const downloadLogs = () => {
    const logText = consoleOutput.join("\n")
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `robot_console_logs_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Debug Console</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Terminal</CardTitle>
                  <CardDescription>Send commands to robots and view responses</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={clearConsole}>
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={downloadLogs}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-2 mb-4">
                <TerminalIcon className="h-5 w-5 text-primary" />
                <Select value={selectedRobot} onValueChange={setSelectedRobot}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select robot" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRobots.map((robot) => (
                      <SelectItem key={robot.id} value={robot.id}>
                        {robot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[400px] border rounded-md p-4 bg-black text-green-400 font-mono text-sm">
                {consoleOutput.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleCommandSubmit} className="w-full flex gap-2">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Enter command (type 'help' for commands)"
                  className="font-mono"
                />
                <Button type="submit">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="imu" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="imu" className="flex-1">
                IMU Data
              </TabsTrigger>
              <TabsTrigger value="rssi" className="flex-1">
                RSSI Levels
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex-1">
                Quick Commands
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imu">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">IMU Sensor Data</CardTitle>
                  <CardDescription>Real-time acceleration and orientation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Acceleration (m/s²)
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">X-Axis</div>
                            <div className="text-lg font-mono">{imuData.acceleration.x.toFixed(2)}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">Y-Axis</div>
                            <div className="text-lg font-mono">{imuData.acceleration.y.toFixed(2)}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">Z-Axis</div>
                            <div className="text-lg font-mono">{imuData.acceleration.z.toFixed(2)}</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        Orientation (degrees)
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">Roll</div>
                            <div className="text-lg font-mono">{imuData.orientation.roll.toFixed(2)}°</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">Pitch</div>
                            <div className="text-lg font-mono">{imuData.orientation.pitch.toFixed(2)}°</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">Yaw</div>
                            <div className="text-lg font-mono">{imuData.orientation.yaw.toFixed(2)}°</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rssi">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">BLE RSSI Levels</CardTitle>
                  <CardDescription>Signal strength from nearby beacons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rssiData.map((beacon) => (
                      <div key={beacon.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{beacon.name}</div>
                          <div className="text-xs text-muted-foreground">{beacon.id}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi
                            className={`h-4 w-4 ${beacon.rssi > -70 ? "text-green-500" : beacon.rssi > -80 ? "text-yellow-500" : "text-red-500"}`}
                          />
                          <span className="font-mono">{Math.round(beacon.rssi)} dBm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Commands</CardTitle>
                  <CardDescription>Common commands for robot control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setCommand("RESTART")
                        processCommand("RESTART")
                        setConsoleOutput((prev) => [...prev, `> ${selectedRobot}: RESTART`])
                      }}
                    >
                      <RotateCw className="mr-2 h-4 w-4" />
                      Restart
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setCommand("STATUS")
                        processCommand("STATUS")
                        setConsoleOutput((prev) => [...prev, `> ${selectedRobot}: STATUS`])
                      }}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Status
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setCommand("CLEAR_MAP")
                        processCommand("CLEAR_MAP")
                        setConsoleOutput((prev) => [...prev, `> ${selectedRobot}: CLEAR_MAP`])
                      }}
                    >
                      <MapIcon className="mr-2 h-4 w-4" />
                      Clear Map
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setCommand("MOVE 10,20")
                        processCommand("MOVE 10,20")
                        setConsoleOutput((prev) => [...prev, `> ${selectedRobot}: MOVE 10,20`])
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Move to 10,20
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setCommand("PAUSE")
                        processCommand("PAUSE")
                        setConsoleOutput((prev) => [...prev, `> ${selectedRobot}: PAUSE`])
                      }}
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Task
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setCommand("RESUME")
                        processCommand("RESUME")
                        setConsoleOutput((prev) => [...prev, `> ${selectedRobot}: RESUME`])
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Resume Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
