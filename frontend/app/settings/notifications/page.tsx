"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsTabs } from "@/components/settings-tabs"

export default function NotificationsSettingsPage() {
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [deliveryAlerts, setDeliveryAlerts] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)

  // Load saved notification settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("notification_settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setEmailNotifications(settings.email)
      setPushNotifications(settings.push)
      setDeliveryAlerts(settings.delivery)
      setSystemAlerts(settings.system)
    }
  }, [])

  const handleSaveNotifications = async () => {
    setIsSaving(true)

    try {
      // Save settings to localStorage
      const settings = {
        email: emailNotifications,
        push: pushNotifications,
        delivery: deliveryAlerts,
        system: systemAlerts,
      }

      localStorage.setItem("notification_settings", JSON.stringify(settings))

      // In a real app, this would make an API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was a problem saving your notification settings",
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
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="delivery-alerts">Delivery Alerts</Label>
                        <p className="text-xs text-muted-foreground">Notifications about delivery status changes</p>
                      </div>
                      <Switch id="delivery-alerts" checked={deliveryAlerts} onCheckedChange={setDeliveryAlerts} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system-alerts">System Alerts</Label>
                        <p className="text-xs text-muted-foreground">Notifications about system status and errors</p>
                      </div>
                      <Switch id="system-alerts" checked={systemAlerts} onCheckedChange={setSystemAlerts} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications} disabled={isSaving} className="gap-2">
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
