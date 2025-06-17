"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface IssueDetailProps {
  issue: {
    id: string
    user: string
    date: string
    type: string
    robot: string
    taskId: string
    description: string
    status: "open" | "resolved" | "escalated"
    notes?: string
  }
  onUpdate: (id: string, data: any) => void
  onClose: () => void
}

export function IssueDetail({ issue, onUpdate, onClose }: IssueDetailProps) {
  const [status, setStatus] = useState(issue.status)
  const [notes, setNotes] = useState(issue.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(issue.id, { status, notes })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Issue #{issue.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Reported By</Label>
            <p>{issue.user}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Date</Label>
            <p>{issue.date}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Issue Type</Label>
            <p>{issue.type}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Robot</Label>
            <p>{issue.robot}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Task ID</Label>
            <p>{issue.taskId}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <p
              className={`font-medium ${
                status === "open" ? "text-yellow-500" : status === "resolved" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Description</Label>
          <p className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">{issue.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Update Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Engineer Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSubmit}>Update Issue</Button>
      </CardFooter>
    </Card>
  )
}
