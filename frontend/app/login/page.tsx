"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Battery, Wrench, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState("user@msds.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [engineerEmail, setEngineerEmail] = useState("engineer@msds.com")
  const [engineerPassword, setEngineerPassword] = useState("engineer123")
  const [showEngineerPassword, setShowEngineerPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("user")
  const { toast } = useToast()
  const router = useRouter()
  const { login, loginAsEngineer } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would make an API call to your backend
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (activeTab === "engineer") {
        // Login as engineer with provided credentials
        loginAsEngineer({
          email: engineerEmail,
          password: engineerPassword,
        })
        toast({
          title: "Engineer login successful",
          description: "Welcome to the Robotics Admin Panel",
        })
      } else {
        // Regular user login
        login({
          email,
          name: email.split("@")[0],
          role: "user",
        })
        toast({
          title: "Login successful",
          description: "Welcome back to MSDS",
        })
      }

      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleEngineerPasswordVisibility = () => {
    setShowEngineerPassword(!showEngineerPassword)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center gradient-bg">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-3 rounded-full">
            <Battery className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">MSDS</h1>
          </div>
        </div>

        <Card className="auth-card w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Tabs defaultValue="user" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="engineer">Engineer</TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="engineer">
                  <div className="space-y-4 pt-4">
                    {/*
                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="flex flex-col items-center gap-2">
                        <Wrench className="h-12 w-12 text-primary" />
                        <p className="text-sm text-center">Login as a Robotics Engineer to access the admin panel</p>
                      </div>
                    </div>
                    */}

                    <div className="space-y-2">
                      <Label htmlFor="engineer-email">Engineer Email</Label>
                      <Input
                        id="engineer-email"
                        type="email"
                        placeholder="engineer@msds.com"
                        value={engineerEmail}
                        onChange={(e) => setEngineerEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineer-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="engineer-password"
                          type={showEngineerPassword ? "text" : "password"}
                          value={engineerPassword}
                          onChange={(e) => setEngineerPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={toggleEngineerPasswordVisibility}
                        >
                          {showEngineerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
