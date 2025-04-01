"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsTabs } from "@/components/settings-tabs"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// FAQ data
const faqItems = [
  {
    question: "How does the robot navigate through the hospital?",
    answer:
      "The MSDS robot uses a combination of SLAM (Simultaneous Localization and Mapping) technology and LiDAR sensors to navigate through the hospital environment. It creates and maintains a map of the facility, detects obstacles in real-time, and plans optimal paths to delivery destinations.",
  },
  {
    question: "How does the robot know which patient to deliver to?",
    answer:
      "Each patient is assigned an RFID tag and a BLE beacon. The robot detects the nearest beacon and verifies delivery with an RFID scan.",
  },
  {
    question: "How long does the robot battery last?",
    answer:
      "The robot's battery typically lasts for 2-3 hours of continuous operation. The robot takes approximately 2 hours to fully charge from 0% to 100%.",
  },
  {
    question: "Can the robot avoid obstacles?",
    answer:
      "Yes! The robot continuously scans its environment and automatically avoids obstacles using LiDAR and IMU sensors.",
  },
  {
    question: "How do I schedule a delivery?",
    answer:
      "You can assign tasks via the web app by selecting the ward and patient. The robot will follow the schedule accordingly.",
  },
  {
    question: "What happens if a patient doesn't scan the RFID tag?",
    answer:
      "If the correct RFID tag is not scanned within a set time, the robot waits and plays a reminder message before moving to the next task.",
  },
  {
    question: "Can I manually control the robot?",
    answer:
      "Yes! The web app has a Manual Control Mode, allowing operators to control the robot using on-screen buttons or a joystick.",
  },
  {
    question: "Can the robot deliver to multiple locations in one trip?",
    answer:
      "Yes, the MSDS robot can be programmed to make multiple stops in a single trip. The system optimizes the delivery route to maximize efficiency. The robot's compartments can be configured to open selectively at each destination, ensuring that each recipient only receives their intended items.",
  },
  {
    question: "What are the different operating modes?",
    answer:
      "Mapping Mode: The robot scans and maps the environment. Delivery Mode: Executes scheduled deliveries. Manual Control Mode: Allows human control via the web app.Standby Mode: The robot remains idle or charges at the base.",
  },
  {
    question: "Can the robot be used in multiple hospital departments?",
    answer:
      "Yes! The robot can navigate across departments if they are included in its mapped environment.",
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter FAQ items based on search query
  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about the MSDS system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-6">
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try a different search term or browse all FAQs</p>
                  </div>
                )}

                {searchQuery && filteredFAQs.length < faqItems.length && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Still Have Questions?</CardTitle>
                <CardDescription>Contact our support team for further assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you couldn't find the answer you were looking for, our support team is ready to help. Visit the
                  Help & Support page to get in touch with us.
                </p>
                {/*
                <Button onClick={() => (window.location.href = "/settings/support")}>Contact Support</Button> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

