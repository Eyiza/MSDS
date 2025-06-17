import { redirect } from "next/navigation"

export default function SettingsPage() {
  // Redirect to robot settings as the default view
  redirect("/settings/robot")
}
