"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, StopCircle, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ControlPage() {
  const [speed, setSpeed] = useState(50)
  const [isEmergencyStop, setIsEmergencyStop] = useState(false)

  const handleMove = (direction: string) => {
    console.log(`Moving robot ${direction} at speed ${speed}%`)
    // In a real implementation, this would send a command to the robot
  }

  const handleStop = () => {
    console.log("Stopping robot")
    // In a real implementation, this would send a stop command to the robot
  }

  const handleEmergencyStop = () => {
    setIsEmergencyStop(true)
    console.log("EMERGENCY STOP ACTIVATED")
    // In a real implementation, this would send an emergency stop command to the robot

    // Reset after 3 seconds
    setTimeout(() => {
      setIsEmergencyStop(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manual Control</h1>
            <p className="text-muted-foreground mt-1">Manually control the robot's movement</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status={isEmergencyStop ? "error" : "idle"} />
            <BatteryStatus level={85} />
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Robot Camera Feed</CardTitle>
              <CardDescription>Live camera feed from the robot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Camera feed will appear here</p>
                {/* This will be replaced with actual camera feed */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Control Panel</CardTitle>
              <CardDescription>Use the controls to move the robot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Speed Control</span>
                    <span className="font-medium">{speed}%</span>
                  </div>
                  <Slider
                    value={[speed]}
                    min={10}
                    max={100}
                    step={10}
                    onValueChange={(value) => setSpeed(value[0])}
                    disabled={isEmergencyStop}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                  <div className="col-start-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("forward")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowUp className="h-6 w-6" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full aspect-square"
                    onClick={() => handleMove("left")}
                    disabled={isEmergencyStop}
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full aspect-square"
                    onClick={() => handleStop}
                    disabled={isEmergencyStop}
                  >
                    <StopCircle className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full aspect-square"
                    onClick={() => handleMove("right")}
                    disabled={isEmergencyStop}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                  <div className="col-start-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("backward")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowDown className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                <Button variant="destructive" className="w-full py-6 text-lg font-bold" onClick={handleEmergencyStop}>
                  <AlertTriangle className="mr-2 h-6 w-6" />
                  EMERGENCY STOP
                </Button>
              </div>
            </CardContent>
          </Card>

          {/*
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Sensor Data</CardTitle>
              <CardDescription>Real-time sensor readings from the robot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Distance Sensors</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Front</span>
                      <span>120 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Left</span>
                      <span>85 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Right</span>
                      <span>95 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rear</span>
                      <span>150 cm</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Motion Data</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Speed</span>
                      <span>0.2 m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direction</span>
                      <span>Forward</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rotation</span>
                      <span>0°/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Acceleration</span>
                      <span>0 m/s²</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">System Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>CPU Usage</span>
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory</span>
                      <span>512MB / 2GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature</span>
                      <span>42°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span>3h 45m</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          */}
        </div>
      </div>
    </div>
  )
}

