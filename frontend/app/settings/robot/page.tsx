"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsTabs } from "@/components/settings-tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function RobotSettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Robot settings
  const [robotName, setRobotName] = useState("MSDS-Bot-01")
  const [maxSpeed, setMaxSpeed] = useState(0.5)
  const [speedUnit, setSpeedUnit] = useState("m/s") // Add speed unit state
  const [autoReturn, setAutoReturn] = useState(true)
  const [defaultMessage, setDefaultMessage] = useState(
    "Hello, I have a delivery for you. Please scan your RFID tag to confirm.",
  ) // Add default message

  // Delivery settings
  const [waitTime, setWaitTime] = useState(30)
  const [retryCount, setRetryCount] = useState(3)
  const [rfidConfirmation, setRfidConfirmation] = useState(true)

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would make an API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Robot settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was a problem saving your robot settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure robot settings and parameters</p>
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
                <CardTitle>Robot Configuration</CardTitle>
                <CardDescription>Configure robot behavior and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="robot-name">Robot Name</Label>
                    <Input id="robot-name" value={robotName} onChange={(e) => setRobotName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-speed">Maximum Speed</Label>
                    <div className="flex gap-2">
                      <Input
                        id="max-speed"
                        type="number"
                        value={maxSpeed}
                        onChange={(e) => setMaxSpeed(Number.parseFloat(e.target.value))}
                        min="0.1"
                        max={speedUnit === "m/s" ? "2.0" : "100"}
                        step={speedUnit === "m/s" ? "0.1" : "5"}
                        className="flex-1"
                      />
                      <Select value={speedUnit} onValueChange={setSpeedUnit}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="m/s">m/s</SelectItem>
                          <SelectItem value="%">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-return">Auto Return to Base</Label>
                    <Switch id="auto-return" checked={autoReturn} onCheckedChange={setAutoReturn} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically return to base on map after delivery or inactivity
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-message">Default Delivery Message</Label>
                  <Textarea
                    id="default-message"
                    value={defaultMessage}
                    onChange={(e) => setDefaultMessage(e.target.value)}
                    placeholder="Message the robot will announce upon arrival"
                    className="resize-none"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    This message will be used when no specific message is provided for a delivery task
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
                <CardDescription>Configure delivery behavior and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wait-time">Wait Time at Delivery (seconds)</Label>
                    <Input
                      id="wait-time"
                      type="number"
                      value={waitTime}
                      onChange={(e) => setWaitTime(Number.parseInt(e.target.value))}
                      min="10"
                      max="300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retry-count">Delivery Retry Count</Label>
                    <Input
                      id="retry-count"
                      type="number"
                      value={retryCount}
                      onChange={(e) => setRetryCount(Number.parseInt(e.target.value))}
                      min="0"
                      max="10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rfid-confirmation">Require RFID Confirmation</Label>
                    <Switch id="rfid-confirmation" checked={rfidConfirmation} onCheckedChange={setRfidConfirmation} />
                  </div>
                  <p className="text-sm text-muted-foreground">Require RFID tag scan to confirm delivery</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
