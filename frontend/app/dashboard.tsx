import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ModeSelector } from "@/components/mode-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the delivery statistics
const deliveryData = [
  { day: "Mon", deliveries: 12 },
  { day: "Tue", deliveries: 19 },
  { day: "Wed", deliveries: 15 },
  { day: "Thu", deliveries: 21 },
  { day: "Fri", deliveries: 18 },
  { day: "Sat", deliveries: 9 },
  { day: "Sun", deliveries: 5 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor and control your medical supply delivery robot</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status="idle" />
            <BatteryStatus level={85} />
            <div className="fixed z-50 top-6 right-6 md:static md:z-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <ModeSelector />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Commented out Active Delivery Map
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Active Delivery Map</CardTitle>
              <CardDescription>Current robot location and delivery path</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Live delivery map will appear here</p>
              </div>
            </CardContent>
          </Card>
          */}

          {/* Temporary notice about the map being under development */}
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Active Delivery Map</CardTitle>
              <CardDescription>Current robot location and delivery path</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] bg-muted rounded-md flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-2">Map visualization is currently under development</p>
                  <p className="text-sm text-muted-foreground">Check back soon for live delivery tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Active Deliveries</CardTitle>
              <CardDescription>Currently scheduled deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-t my-3 pt-3"></div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Ward A - Room 105</p>
                    <p className="text-sm text-muted-foreground">Patient: John Doe</p>
                  </div>
                  <Badge>In Progress</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Ward B - Room 210</p>
                    <p className="text-sm text-muted-foreground">Patient: Jane Smith</p>
                  </div>
                  <Badge variant="outline">Queued</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-t my-3 pt-3"></div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Robot Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wi-Fi Signal</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Strong
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>WebSockets</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Connected
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Keypad Codes</CardTitle>
              <CardDescription>Quick reference for robot operation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-t my-3 pt-3"></div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mapping Mode</span>
                  <Badge variant="outline" className="font-mono">
                    111
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Delivery Mode</span>
                  <Badge variant="outline" className="font-mono">
                    121
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Manual Mode</span>
                  <Badge variant="outline" className="font-mono">
                    131
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Standby Mode</span>
                  <Badge variant="outline" className="font-mono">
                    141
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>System Uptime</CardTitle>
              <CardDescription>Operational statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-t my-3 pt-3"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active for</p>
                  <p className="font-medium text-lg">3 days, 7 hours</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between items-center mb-1">
                  <span>Last restart</span>
                  <span className="font-medium">March 26, 2023 - 08:15 AM</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span>Total deliveries</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success rate</span>
                  <span className="font-medium">98.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Delivery Statistics</CardTitle>
            <CardDescription>Number of deliveries completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deliveryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deliveries" fill="#1A9CB0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
