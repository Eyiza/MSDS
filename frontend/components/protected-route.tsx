"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register", "/forgot-password"]

    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push("/login")
    }

    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.push("/")
    }
  }, [isAuthenticated, router, pathname])

  // If on a protected route and not authenticated, don't render children
  if (!isAuthenticated && !["/login", "/register", "/forgot-password"].includes(pathname)) {
    return null
  }

  return <>{children}</>
}
