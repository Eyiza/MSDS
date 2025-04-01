"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Truck, Joystick, Clock } from "lucide-react"

type ModeType = "mapping" | "delivery" | "manual" | "standby"

export function ModeSelector() {
  const [activeMode, setActiveMode] = useState<ModeType>("standby")

  const handleModeChange = (value: string) => {
    setActiveMode(value as ModeType)
    // In a real implementation, this would send a command to the robot
    console.log(`Switching to ${value} mode`)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="standby" onValueChange={handleModeChange}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="mapping" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Mapping</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Joystick className="h-4 w-4" />
              <span className="hidden sm:inline">Manual</span>
            </TabsTrigger>
            <TabsTrigger value="standby" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Standby</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="mapping" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Mapping mode: The robot will explore and create a map of the environment.
            </p>
          </TabsContent>
          <TabsContent value="delivery" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Delivery mode: The robot will deliver supplies to scheduled patients and recipients.
            </p>
          </TabsContent>
          <TabsContent value="manual" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Manual mode: You can control the robot manually using the control interface.
            </p>
          </TabsContent>
          <TabsContent value="standby" className="mt-4">
            <p className="text-sm text-muted-foreground">Standby mode: The robot is idle and waiting for commands.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

