"use client"

import { SelectTrigger } from "@/components/ui/select"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { HelpCircle, MessageSquare, Phone, Book } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { MapPin } from "lucide-react"

const faqData = [
  {
    question: "How does the robot navigate through the hospital?",
    answer:
      "The robot uses a combination of SLAM (Simultaneous Localization and Mapping) technology, RFID tags, and BLE beacons to navigate. The system maintains a map of the facility and plans optimal routes for deliveries.",
  },
  {
    question: "How does the robot know which patient to deliver to?",
    answer:
      "The robot uses RFID tags and BLE beacons assigned to each patient to verify the correct delivery location. It also confirms the patient's identity using facial recognition technology.",
  },
  {
    question: "How long does the robot battery last?",
    answer:
      "The robot's battery lasts approximately 8 hours on a single charge. It will automatically return to its charging station when the battery level falls below a certain threshold.",
  },
  {
    question: "Can the robot avoid obstacles?",
    answer:
      "The robot is equipped with sensors to detect obstacles. It will attempt to navigate around static obstacles. If the path is completely blocked, the robot will pause and wait for the obstacle to be removed before continuing.",
  },
  {
    question: "How do I schedule a delivery?",
    answer:
      "Navigate to the Task Scheduling section, select the 'New Task' tab, and fill in the required information including destination, patient, and message. You can also select the destination directly from the map.",
  },
  {
    question: "What happens if a patient doesn't scan the RFID tag?",
    answer:
      "If the patient doesn't scan the RFID tag, the robot will prompt them to enter their patient ID manually. If the ID is not recognized, the robot will alert a staff member for assistance.",
  },
  {
    question: "Can I manually control the robot?",
    answer:
      "In situations where manual intervention is required, the Manual Control section provides a direct interface to control the robot's movement. This should only be used by authorized personnel in emergency situations.",
  },
  {
    question: "Can the robot deliver to multiple locations in one trip?",
    answer:
      "The robot is designed to deliver to one location per trip to ensure the safety and security of the medical supplies. Multi-drop deliveries are not supported at this time.",
  },
  {
    question: "What are the different operating modes?",
    answer:
      "The robot has several operating modes including autonomous delivery, manual control, and mapping mode. Each mode is designed for a specific purpose and can be selected from the dashboard.",
  },
  {
    question: "Can the robot be used in multiple hospital departments?",
    answer:
      "Yes, the robot can be used in multiple hospital departments as long as the facility map includes all relevant areas. You can create delivery tasks for any location on the map.",
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground mt-1">Get help with using the MSDS system</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status="idle" />
            <BatteryStatus level={85} />
            <div className="fixed z-50 top-6 right-6 md:static md:z-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Tabs defaultValue="manual">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="manual">
              <Book className="h-4 w-4 mr-2" />
              User Manual
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="support">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 mt-6">
            <Card >
              <CardHeader>
                <CardTitle>Medical Supply Delivery System - User Manual</CardTitle>
                <CardDescription>Comprehensive guide to using the MSDS system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  
                  <p>
                    The Autonomous Medical Supply Delivery System consists of a web-based application and a robot that
                    autonomously navigates hospital environments to deliver supplies. This manual guides users on how to
                    operate the system efficiently.
                  </p>
                  
                  <hr />
                  <h2>
                    <strong>WEB APPLICATION</strong>
                  </h2>

                  <h3>
                    <strong>Patient Registration</strong>
                  </h3>
                  <p>
                    When a patient is admitted, the user registers them on the platform by providing their name, ward,
                    room (selectable by name or map), RFID tag, BLE beacon, medical condition, contact information, and
                    additional notes. Users can view all RFID tags and BLE beacons in an overview page, categorized as
                    available or active.
                  </p>

                  <h3>
                    <strong>Task Scheduling & Delivery Management</strong>
                  </h3>
                  <p>
                    To schedule a delivery, users navigate to the task scheduling page and select the patient's location
                    on the map or by name, enter the patient's ID and name, and specify the message the robot will
                    announce upon arrival.
                  </p>

                  <p>The task management system is divided into five categories:</p>
                  <ul>
                    <li>
                      <i>To-Do:</i> All created tasks are stored here before they are scheduled.
                    </li>
                    <li>
                      <i>Queued</i>: Tasks awaiting execution by the robot.
                    </li>
                    <li>
                      <i>Active:</i> Tasks currently being executed.
                    </li>
                    <li>
                      <i>Completed:</i> Successfully delivered supplies.
                    </li>
                    <li>
                      <i>Missed:</i> Tasks that were not completed, along with failure reasons.
                    </li>
                  </ul>

                  <h3>
                    <strong>Patient & Device Management</strong>
                  </h3>
                  <p>
                    The patient list allows users to search for, edit, and view patient details, including ID, name,
                    ward, room, RFID tag, BLE beacon, admission date, medical condition, contact information, additional
                    notes, and delivery history. The RFID and BLE beacon pages provide an overview of all registered
                    tags, including tag codes, assigned locations, signal strength (RSSI), assignment history, last
                    scanned time, and usage history, with links to associated tasks.
                  </p>

                  <h3>
                    <strong>Dashboard</strong>
                  </h3>
                  <p>The dashboard provides real-time updates on deliveries and system status. Key features include:</p>
                  <ul>
                    <li>
                      Keypad mode-switching codes for the robot.
                    </li>
                    <li>
                      Live active deliveries and real-time navigation map.
                    </li>
                    <li>
                      System status, uptime, and weekly delivery statistics.
                    </li>
                  </ul>

                  <h3>
                    <strong>Live Map & Manual Control</strong>
                  </h3>
                  <p>
                    The live map page displays both the hospital's predefined map and the real-time map generated by the
                    robot. Users can save, load, and clear the map.
                  </p>

                  <p>
                    The manual control page provides joystick-based controls for manual navigation and speed adjustment,
                    used primarily for debugging or emergency situations.
                  </p>

                  <h3>
                    <strong>Help & Settings</strong>
                  </h3>
                  <p>
                    The help page includes a user manual, FAQ, and a contact form. The settings page allows users to
                    configure robot parameters, including:
                  </p>
                  <ul>
                    <li>Robot name, maximum speed, wait time at delivery, and delivery retry count.</li>
                    <li>Enabling/disabling RFID confirmation for deliveries.</li>
                    <li>Configuring WiFi and password settings.</li>
                    <li>Viewing system logs and debugging information.</li>
                    <li>Clearing map cache, restarting the robot, and performing a factory reset.</li>
                    <li>Changing user account passwords.</li>
                  </ul>

                  <hr />

                  <h2>
                    <strong>ROBOT OPERATION</strong>
                  </h2>

                  <h3>
                    <strong>Modes of Operation</strong>
                  </h3>
                  <p>The robot has four operational modes:</p>
                  <ul>
                    <li>
                      <i>Mapping Mode:</i> The robot explores and maps the hospital floor using SLAM, avoiding
                      stairs. Once mapping is complete, this mode exits automatically.
                    </li>
                    <li>
                      <i>Delivery Mode:</i> The robot follows the scheduled tasks, navigating to patient
                      locations, detecting the nearest BLE beacon, and announcing the pre-set message. It waits for an
                      RFID scan before and after delivery. If no or incorrect RFID is scanned, it waits for a predefined
                      time before moving on.
                    </li>
                    <li>
                      <i>Manual Control Mode:</i> Users can manually control the robot via the web app or
                      keypad.
                    </li>
                    <li>
                      <i>Standby/Charging Mode:</i> When no tasks are assigned, the robot remains idle at its
                      base station, charging if necessary.
                    </li>
                  </ul>

                  <h3>
                    <strong>Starting & Stopping the Robot</strong>
                  </h3>
                  <p>
                    To start the robot, power it on using the designated switch. Ensure the robot is in the correct mode
                    by using the mode-switching keypad codes available on the dashboard.
                  </p>
                  <p>
                    To stop the robot, either manually switch it to standby mode or use the emergency stop button
                    available in manual control.
                  </p>

                  <h3>
                    <strong>Troubleshooting</strong>
                  </h3>
                  <ul>
                    <li>
                      If the robot fails to map the environment correctly, restart the mapping process and ensure no
                      obstacles interfere.
                    </li>
                    <li>
                      If the robot does not recognize an RFID scan, check the tag's status on the RFID management page.
                    </li>
                    <li>
                      If delivery fails multiple times, verify that BLE beacons are functioning correctly and positioned
                      within range.
                    </li>
                    <li>For connectivity issues, check WiFi settings in the app and ensure the robot is online.</li>
                  </ul>

                  <p>For further assistance, refer to the help page or contact support through the web app.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about the MSDS system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Accordion type="single" collapsible>
                  {faqData
                    .filter((item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">Still Have Questions?</h3>
                    <p className="text-muted-foreground">Contact our support team for further assistance.</p>
                    <p className="text-muted-foreground">
                      If you couldn't find the answer you were looking for, our support team is ready to help. Visit the
                      Support page to get in touch with us.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="Your Email" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" />
                </div>
                <Button>Send Message</Button>
                <div className="mt-4">
                  <p className="text-muted-foreground">
                    <MapPin className="inline-block h-4 w-4 mr-1" /> msds.robotics@gmail.com
                  </p>
                  <p className="text-muted-foreground">
                    <Phone className="inline-block h-4 w-4 mr-1" /> +234 803 652 5904
                  </p>
                </div>
                <hr />
                <div>
                  <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">When our support team is available</p> 
                  <ul className="space-y-2">
                    <li>Monday - Friday: 9:00 AM - 6:00 PM (GMT+1)</li>
                    <li>Saturday: 10:00 AM - 4:00 PM (GMT+1)</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

