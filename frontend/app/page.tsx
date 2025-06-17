"use client"

import { useAuth } from "@/hooks/use-auth"
import Dashboard from "./dashboard"
import EngineerDashboard from "./engineer-dashboard"

export default function HomePage() {
  const { isEngineer } = useAuth()

  return isEngineer ? <EngineerDashboard /> : <Dashboard />
}
