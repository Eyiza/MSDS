"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface TagFormProps {
  tag?: {
    id: string
    code: string
    type: "RFID" | "BLE"
    assignedTo: string
    location: string
    status: "active" | "inactive"
  }
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TagForm({ tag, onSubmit, onCancel }: TagFormProps) {
  const [formData, setFormData] = useState({
    id: tag?.id || "",
    code: tag?.code || "",
    type: tag?.type || "RFID",
    assignedTo: tag?.assignedTo || "",
    location: tag?.location || "",
    status: tag?.status || "active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{tag ? "Edit Tag" : "Add New Tag"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Tag Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder={formData.type === "RFID" ? "e.g., 0A1B2C3D" : "e.g., 00112233-4455-6677-8899-AABBCCDDEEFF"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tag Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value as "RFID" | "BLE")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RFID">RFID</SelectItem>
                <SelectItem value="BLE">BLE Beacon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="e.g., Room 101, Hallway 2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Floor 1, North Wing"
              required
            />
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
          <Button type="submit">{tag ? "Update Tag" : "Add Tag"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
