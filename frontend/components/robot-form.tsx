"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface RobotFormProps {
  robot?: {
    id: string
    name: string
    model: string
    maxSpeed: number
    taskCapacity: number
    status: "active" | "out-of-order"
    assignedFloor: string
  }
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function RobotForm({ robot, onSubmit, onCancel }: RobotFormProps) {
  const [formData, setFormData] = useState({
    id: robot?.id || "",
    name: robot?.name || "",
    model: robot?.model || "MSD-1000",
    maxSpeed: robot?.maxSpeed || 1.2,
    taskCapacity: robot?.taskCapacity || 3,
    status: robot?.status || "active",
    assignedFloor: robot?.assignedFloor || "1",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "out-of-order" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{robot ? "Edit Robot" : "Add New Robot"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Robot ID</Label>
            <Input id="id" name="id" value={formData.id} onChange={handleChange} placeholder="e.g., ROB-001" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Robot Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Delivery Bot 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={formData.model} onValueChange={(value) => handleSelectChange("model", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MSD-1000">MSD-1000</SelectItem>
                <SelectItem value="MSD-2000">MSD-2000</SelectItem>
                <SelectItem value="MSD-3000">MSD-3000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSpeed">Max Speed (m/s)</Label>
            <Input
              id="maxSpeed"
              name="maxSpeed"
              type="number"
              step="0.1"
              min="0.1"
              max="2.0"
              value={formData.maxSpeed}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskCapacity">Task Capacity</Label>
            <Input
              id="taskCapacity"
              name="taskCapacity"
              type="number"
              min="1"
              max="10"
              value={formData.taskCapacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedFloor">Assigned Floor</Label>
            <Select
              value={formData.assignedFloor}
              onValueChange={(value) => handleSelectChange("assignedFloor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
                <SelectItem value="4">Floor 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="status" checked={formData.status === "active"} onCheckedChange={handleStatusChange} />
            <Label htmlFor="status">Active</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{robot ? "Update Robot" : "Add Robot"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
