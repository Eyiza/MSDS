"use client"

import { useState } from "react"
import { RefreshCw, Download, Trash2, RotateCcw, AlertTriangle, Power } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsTabs } from "@/components/settings-tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdvancedSettingsPage() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [logLevel, setLogLevel] = useState("info")
  const [debugMode, setDebugMode] = useState(false)
  const [remoteAccess, setRemoteAccess] = useState(false)

  // Sample logs
  const [logs, setLogs] = useState([
    "[2023-03-26 10:15:32] INFO: System started",
    "[2023-03-26 10:15:35] INFO: ROS bridge connected",
    "[2023-03-26 10:15:40] INFO: Robot status: IDLE",
    "[2023-03-26 10:16:02] INFO: Battery level: 85%",
    "[2023-03-26 10:20:15] INFO: New delivery task scheduled",
    "[2023-03-26 10:20:18] INFO: Robot status: DELIVERING",
    "[2023-03-26 10:25:30] INFO: Delivery completed",
    "[2023-03-26 10:25:32] INFO: Robot status: RETURNING",
    "[2023-03-26 10:30:05] INFO: Robot status: IDLE",
    "[2023-03-26 10:45:12] INFO: Battery level: 80%",
  ])

  const handleRefreshLogs = async () => {
    setIsRefreshing(true)

    try {
      // In a real app, this would fetch new logs from your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add a new log entry
      const newLog = `[${new Date().toISOString().replace("T", " ").slice(0, 19)}] INFO: Logs refreshed`
      setLogs([...logs, newLog])

      toast({
        title: "Logs refreshed",
        description: "System logs have been updated",
      })
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh system logs",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDownloadLogs = async () => {
    setIsDownloading(true)

    try {
      // In a real app, this would download logs from your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a blob with the logs
      const blob = new Blob([logs.join("\n")], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      // Create a link and click it to download
      const a = document.createElement("a")
      a.href = url
      a.download = `msds_logs_${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast({
        title: "Logs downloaded",
        description: "System logs have been downloaded to your device",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download system logs",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClearLogs = () => {
    setLogs([`[${new Date().toISOString().replace("T", " ").slice(0, 19)}] INFO: Logs cleared`])

    toast({
      title: "Logs cleared",
      description: "System logs have been cleared",
    })
  }

  const handleRestartRobot = async () => {
    try {
      // In a real app, this would make an API call to restart the robot
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Robot restarting",
        description: "The robot is now restarting. This may take a few minutes.",
      })
    } catch (error) {
      toast({
        title: "Restart failed",
        description: "Could not restart the robot",
        variant: "destructive",
      })
    }
  }

  const handleClearMapCache = async () => {
    try {
      // In a real app, this would make an API call to clear the map cache
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Map cache cleared",
        description: "The robot's map cache has been cleared successfully",
      })
    } catch (error) {
      toast({
        title: "Operation failed",
        description: "Could not clear the map cache",
        variant: "destructive",
      })
    }
  }

  const handleFactoryReset = async () => {
    try {
      // In a real app, this would make an API call to reset the robot
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Factory reset complete",
        description: "The robot has been reset to factory settings",
      })
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Could not reset the robot to factory settings",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure advanced system settings</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status="idle" />
            <BatteryStatus level={85} />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 lg:w-72">
            <SettingsTabs />
          </div>

          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced system settings (use with caution)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable debug mode for additional logging and diagnostics
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="remote-access">Remote SSH Access</Label>
                    <Switch id="remote-access" checked={remoteAccess} onCheckedChange={setRemoteAccess} />
                  </div>
                  <p className="text-sm text-muted-foreground">Allow remote SSH access to the robot's Raspberry Pi</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger id="log-level">
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="trace">Trace</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Set the verbosity level for system logs</p>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">System Maintenance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Power className="h-4 w-4" />
                          Restart Robot
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restart Robot</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to restart the robot? This will interrupt any ongoing operations.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>
                            Cancel
                          </Button>
                          <Button onClick={handleRestartRobot}>Restart</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Clear Map Cache
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Clear Map Cache</DialogTitle>
                          <DialogDescription>
                            This will delete all saved maps. The robot will need to remap areas before it can navigate
                            autonomously.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>
                            Cancel
                          </Button>
                          <Button onClick={handleClearMapCache}>Clear Cache</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 col-span-full">
                          <AlertTriangle className="h-4 w-4" />
                          Reset to Factory
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Factory Reset</DialogTitle>
                          <DialogDescription>
                            This will reset all settings to factory defaults and erase all data. This action cannot be
                            undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleFactoryReset}>
                            Reset
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>View system and robot logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md h-[300px] overflow-auto font-mono text-xs">
                  {logs.map((log, index) => (
                    <p key={index}>{log}</p>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRefreshLogs} disabled={isRefreshing} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button variant="outline" onClick={handleDownloadLogs} disabled={isDownloading} className="gap-2">
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download Logs"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Clear Logs
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Clear System Logs</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to clear all system logs? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleClearLogs}>
                          Clear
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

