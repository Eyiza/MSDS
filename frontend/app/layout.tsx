import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MSDS - Medical Supply Delivery System",
  description: "Medical Supply Delivery System Dashboard",
  icons: {
    icon: "/images/msds-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://cdn.jsdelivr.net/npm/eventemitter2@6/lib/eventemitter2.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/roslib@1/build/roslib.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/easeljs@1/lib/easeljs.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/ros2d@0/build/ros2d.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/nipplejs/0.9.0/nipplejs.min.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProtectedRoute>
              <SidebarProvider defaultOpen={true}>
                <div className="flex h-screen w-full overflow-hidden">
                  <AppSidebar />
                  <main className="flex-1 overflow-auto w-full">{children}</main>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
