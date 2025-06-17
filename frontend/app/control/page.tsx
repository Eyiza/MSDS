"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  StopCircle,
  AlertTriangle,
  RotateCcw,
  RotateCw,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownLeft,
  ArrowDownRight,
} from "lucide-react"
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

                {/* Movement Controls with Diagonal Buttons */}
                <div className="grid grid-cols-5 gap-2 max-w-[300px] mx-auto">
                  {/* Top Row - Top Left, Up, Top Right */}
                  <div className="col-start-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("top-left")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowUpLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="col-start-3">
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
                  <div className="col-start-5">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("top-right")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowUpRight className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Middle Row - Left, Stop, Right */}
                  <div className="col-start-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("left")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="col-start-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleStop()}
                      disabled={isEmergencyStop}
                    >
                      <StopCircle className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="col-start-5">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("right")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Bottom Row - Bottom Left, Down, Bottom Right */}
                  <div className="col-start-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("bottom-left")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowDownLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="col-start-3">
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
                  <div className="col-start-5">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full aspect-square"
                      onClick={() => handleMove("bottom-right")}
                      disabled={isEmergencyStop}
                    >
                      <ArrowDownRight className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Rotation/Steering Controls */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleMove("rotate-left")}
                    disabled={isEmergencyStop}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Turn Left
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleMove("rotate-right")}
                    disabled={isEmergencyStop}
                  >
                    <RotateCw className="mr-2 h-5 w-5" />
                    Turn Right
                  </Button>
                </div>

                <Button variant="destructive" className="w-full py-6 text-lg font-bold" onClick={handleEmergencyStop}>
                  <AlertTriangle className="mr-2 h-6 w-6" />
                  EMERGENCY STOP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
