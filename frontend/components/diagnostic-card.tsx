"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface DiagnosticCardProps {
  title: string
  description: string
  onRun: () => Promise<boolean>
}

type Status = "idle" | "running" | "success" | "failed"

export function DiagnosticCard({ title, description, onRun }: DiagnosticCardProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<string>("")

  const handleRun = async () => {
    setStatus("running")
    setResult("Running diagnostic...")

    try {
      const success = await onRun()
      setStatus(success ? "success" : "failed")
      setResult(success ? "Diagnostic completed successfully." : "Diagnostic failed.")
    } catch (error) {
      setStatus("failed")
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {status === "idle" ? null : status === "running" ? (
            <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
          ) : status === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        {status !== "idle" && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              status === "running"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                : status === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {result}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleRun}
          disabled={status === "running"}
          variant={status === "success" ? "outline" : "default"}
          className="w-full"
        >
          {status === "idle"
            ? "Run Diagnostic"
            : status === "running"
              ? "Running..."
              : status === "success"
                ? "Run Again"
                : "Retry"}
        </Button>
      </CardFooter>
    </Card>
  )
}
