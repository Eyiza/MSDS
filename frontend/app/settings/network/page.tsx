"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Save, Wifi, Globe, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsTabs } from "@/components/settings-tabs"

export default function NetworkSettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Network settings
  const [wifiSsid, setWifiSsid] = useState("Hospital_Network")
  const [wifiPassword, setWifiPassword] = useState("********")
  const [useStaticIp, setUseStaticIp] = useState(false)
  const [ipAddress, setIpAddress] = useState("192.168.1.100")
  const [subnetMask, setSubnetMask] = useState("255.255.255.0")
  const [gateway, setGateway] = useState("192.168.1.1")
  const [rosBridgeUrl, setRosBridgeUrl] = useState("ws://192.168.1.101:9090")

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would make an API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Network settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was a problem saving your network settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleConnectWifi = async () => {
    setIsConnecting(true)

    try {
      // In a real app, this would make an API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Connected",
        description: `Successfully connected to ${wifiSsid}`,
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to the WiFi network",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure network settings for the robot</p>
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
            <Card>
              <CardHeader>
                <CardTitle>WiFi Configuration</CardTitle>
                <CardDescription>Configure wireless network settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wifi-ssid">Wi-Fi SSID</Label>
                    <Input id="wifi-ssid" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wifi-password">Wi-Fi Password</Label>
                    <div className="relative">
                      <Input
                        id="wifi-password"
                        type={showPassword ? "text" : "password"}
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleConnectWifi} disabled={isConnecting} variant="outline" className="gap-2">
                    <Wifi className="h-4 w-4" />
                    {isConnecting ? "Connecting..." : "Connect to WiFi"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IP Configuration</CardTitle>
                <CardDescription>Configure IP address settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="static-ip">Use Static IP</Label>
                    <Switch id="static-ip" checked={useStaticIp} onCheckedChange={setUseStaticIp} />
                  </div>
                  <p className="text-sm text-muted-foreground">Enable to manually configure IP address settings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip-address">IP Address</Label>
                    <Input
                      id="ip-address"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      disabled={!useStaticIp}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subnet-mask">Subnet Mask</Label>
                    <Input
                      id="subnet-mask"
                      value={subnetMask}
                      onChange={(e) => setSubnetMask(e.target.value)}
                      disabled={!useStaticIp}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gateway">Default Gateway</Label>
                    <Input
                      id="gateway"
                      value={gateway}
                      onChange={(e) => setGateway(e.target.value)}
                      disabled={!useStaticIp}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROS Bridge Configuration</CardTitle>
                <CardDescription>Configure ROS bridge connection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ros-bridge">ROS Bridge WebSocket URL</Label>
                  <Input id="ros-bridge" value={rosBridgeUrl} onChange={(e) => setRosBridgeUrl(e.target.value)} />
                  <p className="text-sm text-muted-foreground">WebSocket URL for connecting to the ROS bridge server</p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Testing connection",
                        description: "Attempting to connect to ROS bridge...",
                      })
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save All Network Settings"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
