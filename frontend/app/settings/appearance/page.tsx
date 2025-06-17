"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Monitor, Save } from "lucide-react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsTabs } from "@/components/settings-tabs"

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [selectedTheme, setSelectedTheme] = useState(theme || "system")
  const [isSaving, setIsSaving] = useState(false)

  // Update selected theme when theme changes
  useEffect(() => {
    if (theme) {
      setSelectedTheme(theme)
    }
  }, [theme])

  const handleSaveAppearance = async () => {
    setIsSaving(true)
    try {
      // Set the theme
      setTheme(selectedTheme)

      // In a real app, this would save other preferences to your backend
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Appearance settings saved",
        description: "Your appearance preferences have been updated",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was a problem saving your appearance settings",
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
            <p className="text-muted-foreground mt-1">Customize your application preferences</p>
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
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Select your preferred color theme</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedTheme}
                  onValueChange={setSelectedTheme}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Monitor className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAppearance} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
