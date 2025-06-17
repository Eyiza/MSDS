"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConsoleTerminalProps {
  onSendCommand: (command: string) => void
}

export function ConsoleTerminal({ onSendCommand }: ConsoleTerminalProps) {
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [logs, setLogs] = useState<{ type: "input" | "output" | "error"; content: string }[]>([
    { type: "output", content: "MSDS Robot Debug Console v1.0" },
    { type: "output", content: 'Type "help" for available commands' },
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    // Add command to logs
    setLogs((prev) => [...prev, { type: "input", content: `> ${command}` }])

    // Process command
    processCommand(command)

    // Add to history and clear input
    setHistory((prev) => [...prev, command])
    setCommand("")
  }

  const processCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim()

    // Mock command processing
    if (lowerCmd === "help") {
      setLogs((prev) => [
        ...prev,
        {
          type: "output",
          content: `Available commands:
  RESTART - Restart the robot
  CLEAR_MAP - Clear the current map
  MOVE X,Y - Move to coordinates X,Y
  PAUSE - Pause current task
  STATUS - Get robot status
  SENSORS - Get sensor readings
  HELP - Show this help message`,
        },
      ])
    } else if (lowerCmd === "restart") {
      setLogs((prev) => [...prev, { type: "output", content: "Initiating robot restart sequence..." }])
      setTimeout(() => {
        setLogs((prev) => [...prev, { type: "output", content: "Robot restarted successfully." }])
      }, 2000)
    } else if (lowerCmd === "clear_map") {
      setLogs((prev) => [...prev, { type: "output", content: "Clearing map data..." }])
      setTimeout(() => {
        setLogs((prev) => [...prev, { type: "output", content: "Map data cleared." }])
      }, 1500)
    } else if (lowerCmd.startsWith("move")) {
      const coords = lowerCmd.replace("move", "").trim()
      setLogs((prev) => [...prev, { type: "output", content: `Moving to coordinates ${coords}...` }])
      setTimeout(() => {
        setLogs((prev) => [...prev, { type: "output", content: `Reached destination ${coords}.` }])
      }, 3000)
    } else if (lowerCmd === "pause") {
      setLogs((prev) => [...prev, { type: "output", content: "Robot paused." }])
    } else if (lowerCmd === "status") {
      setLogs((prev) => [
        ...prev,
        {
          type: "output",
          content: `Robot Status:
  Name: Delivery Bot 1
  Status: IDLE
  Battery: 87%
  Position: X:23.5, Y:45.2
  Current Task: None
  Last Error: None`,
        },
      ])
    } else if (lowerCmd === "sensors") {
      setLogs((prev) => [
        ...prev,
        {
          type: "output",
          content: `Sensor Readings:
  IMU: Accel X:0.02 Y:0.01 Z:9.81 m/s²
  Orientation: Roll:0.5° Pitch:0.3° Yaw:182.4°
  Proximity: Front:1.2m Left:0.8m Right:2.5m Rear:3.0m
  Battery Voltage: 24.7V
  Motor Current: L:0.4A R:0.4A
  Temperature: 35.2°C`,
        },
      ])
    } else {
      setLogs((prev) => [
        ...prev,
        { type: "error", content: `Unknown command: ${cmd}. Type "help" for available commands.` },
      ])
    }

    // Also call the external handler
    onSendCommand(cmd)
  }

  return (
    <div className="flex flex-col h-full border rounded-md bg-black text-green-400 font-mono">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.type === "input" ? "text-white" : log.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {log.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-800 flex">
        <span className="mr-2 pt-2">{">"}</span>
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Type command..."
        />
        <Button
          type="submit"
          variant="outline"
          className="ml-2 bg-transparent border-green-600 text-green-400 hover:bg-green-900 hover:text-green-300"
        >
          Send
        </Button>
      </form>
    </div>
  )
}
