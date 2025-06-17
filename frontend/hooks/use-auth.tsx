"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "user" | "admin" | "engineer"

type User = {
  email: string
  name: string
  staffId?: string
  department?: string
  role: UserRole
}

type EngineerLoginParams = {
  email: string
  password: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isEngineer: boolean
  login: (user: User) => void
  loginAsEngineer: (params: EngineerLoginParams) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("msds_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    // Set default role if not provided
    const userWithRole = {
      ...userData,
      role: userData.role || "user",
    }
    setUser(userWithRole)
    localStorage.setItem("msds_user", JSON.stringify(userWithRole))
  }

  const loginAsEngineer = ({ email, password }: EngineerLoginParams) => {
    // In a real app, you would validate the engineer credentials
    // For demo purposes, we'll create an engineer user with the provided email
    const engineerUser = {
      email: email,
      name: email.split("@")[0],
      staffId: "ENG-" + Math.floor(1000 + Math.random() * 9000),
      department: "Engineering",
      role: "engineer" as UserRole,
    }
    setUser(engineerUser)
    localStorage.setItem("msds_user", JSON.stringify(engineerUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("msds_user")
    router.push("/login")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isEngineer: user?.role === "engineer",
    login,
    loginAsEngineer,
    logout,
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
