"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BatteryStatus } from "@/components/battery-status"
import { RobotStatus } from "@/components/robot-status"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Search, Edit, User, MapPin, Calendar, Package, Tag, History, Save, EyeIcon } from "lucide-react"
import { MapDestinationSelector } from "@/components/map-destination-selector"

interface PatientType {
  id: string
  name: string
  ward: string
  room?: string
  rfidTag: string
  bleBeacon: string
  admissionDate: string
  medicalCondition: string
  contactInfo: string
  notes: string
}

interface TagType {
  id: string
  code: string
  assignedTo: string
  patientId: string
  location: string
  status: string
  assignedDate: string
  lastScanned: string
}

interface BeaconType {
  id: string
  code: string
  assignedTo: string
  patientId: string
  location: string
  status: string
  signalStrength: string
  assignedDate: string
  lastDetected: string
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)
  const [selectedBeacon, setSelectedBeacon] = useState<BeaconType | null>(null)
  const [tagSearchTerm, setTagSearchTerm] = useState("")
  const [beaconSearchTerm, setBeaconSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [wardFilter, setWardFilter] = useState("all")
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<{ ward: string; room?: string } | null>(null)
  const [isEditMapSelectorOpen, setIsEditMapSelectorOpen] = useState(false)
  const [registerWard, setRegisterWard] = useState("")
  const [registerRoom, setRegisterRoom] = useState("")

  // Form state for patient editing
  const [editedPatient, setEditedPatient] = useState<PatientType | null>(null)

  // Update editedPatient when selectedPatient changes
  useEffect(() => {
    if (selectedPatient) {
      setEditedPatient({ ...selectedPatient })
    }
  }, [selectedPatient])

  // Update form fields when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      if (selectedDestination.ward) {
        setRegisterWard(selectedDestination.ward.toLowerCase().replace(" ", "-"))
      }
      if (selectedDestination.room) {
        setRegisterRoom(selectedDestination.room.toLowerCase().replace(" ", "-"))
      }
    }
  }, [selectedDestination])

  // Handle form field changes
  const handlePatientChange = (field: keyof PatientType, value: string) => {
    if (editedPatient) {
      setEditedPatient({
        ...editedPatient,
        [field]: value,
      })
    }
  }

  // Handle save changes
  const handleSaveChanges = () => {
    // Here you would typically save to a database
    // For now, we'll just close the dialog
    setEditMode(false)
    setSelectedPatient(null)
  }

  // Handle selecting a destination from the map
  const handleSelectDestination = (destination: { ward: string; room?: string }) => {
    setSelectedDestination(destination)
    if (editMode && editedPatient) {
      handlePatientChange("ward", destination.ward)
      if (destination.room) {
        handlePatientChange("room", destination.room)
      }
    }
  }

  // Sample data
  const patients: PatientType[] = [
    {
      id: "P-1001",
      name: "John Doe",
      ward: "Ward A",
      room: "Room 105",
      rfidTag: "RFID-A1",
      bleBeacon: "BLE-001",
      admissionDate: "2023-03-15",
      medicalCondition: "Post-surgery recovery",
      contactInfo: "Next of kin: Jane Doe (555-1234)",
      notes: "Patient requires regular medication delivery",
    },
    {
      id: "P-1002",
      name: "Jane Smith",
      ward: "Ward B",
      room: "Room 210",
      rfidTag: "RFID-B2",
      bleBeacon: "BLE-002",
      admissionDate: "2023-03-18",
      medicalCondition: "Respiratory issues",
      contactInfo: "Next of kin: John Smith (555-5678)",
      notes: "Patient has mobility issues",
    },
    {
      id: "P-1003",
      name: "Robert Johnson",
      ward: "Ward C",
      room: "Room 315",
      rfidTag: "RFID-C3",
      bleBeacon: "BLE-003",
      admissionDate: "2023-03-20",
      medicalCondition: "Cardiac monitoring",
      contactInfo: "Next of kin: Mary Johnson (555-9012)",
      notes: "Patient requires assistance with medication",
    },
  ]

  const rfidTags: TagType[] = [
    {
      code: "RFID-A1",
      id: "A1-45678",
      assignedTo: "John Doe",
      patientId: "P-1001",
      location: "Ward A, Room 105",
      status: "Active",
      assignedDate: "2023-03-15",
      lastScanned: "2023-03-26 10:15 AM",
    },
    {
      code: "RFID-B2",
      id: "B2-56789",
      assignedTo: "Jane Smith",
      patientId: "P-1002",
      location: "Ward B, Room 210",
      status: "Active",
      assignedDate: "2023-03-18",
      lastScanned: "2023-03-26 09:30 AM",
    },
    {
      code: "RFID-C3",
      id: "C3-67890",
      assignedTo: "Robert Johnson",
      patientId: "P-1003",
      location: "Ward C, Room 315",
      status: "Active",
      assignedDate: "2023-03-20",
      lastScanned: "2023-03-26 11:45 AM",
    },
    {
      code: "RFID-D4",
      id: "D4-78901",
      assignedTo: "-",
      patientId: "",
      location: "Storage",
      status: "Available",
      assignedDate: "",
      lastScanned: "2023-03-25 15:30 PM",
    },
    {
      code: "RFID-E5",
      id: "E5-89012",
      assignedTo: "-",
      patientId: "",
      location: "Storage",
      status: "Available",
      assignedDate: "",
      lastScanned: "2023-03-25 16:00 PM",
    },
  ]

  const bleBeacons: BeaconType[] = [
    {
      code: "BLE-001",
      id: "BLE-45678",
      assignedTo: "John Doe",
      patientId: "P-1001",
      location: "Ward A, Room 105",
      status: "Active",
      signalStrength: "-65",
      assignedDate: "2023-03-15",
      lastDetected: "2023-03-26 10:20 AM",
    },
    {
      code: "BLE-002",
      id: "BLE-56789",
      assignedTo: "Jane Smith",
      patientId: "P-1002",
      location: "Ward B, Room 210",
      status: "Active",
      signalStrength: "-70",
      assignedDate: "2023-03-18",
      lastDetected: "2023-03-26 09:35 AM",
    },
    {
      code: "BLE-003",
      id: "BLE-67890",
      assignedTo: "Robert Johnson",
      patientId: "P-1003",
      location: "Ward C, Room 315",
      status: "Active",
      signalStrength: "-68",
      assignedDate: "2023-03-20",
      lastDetected: "2023-03-26 11:50 AM",
    },
    {
      code: "BLE-004",
      id: "BLE-78901",
      assignedTo: "-",
      patientId: "",
      location: "Storage",
      status: "Available",
      signalStrength: "-75",
      assignedDate: "",
      lastDetected: "2023-03-25 15:35 PM",
    },
    {
      code: "BLE-005",
      id: "BLE-89012",
      assignedTo: "-",
      patientId: "",
      location: "Storage",
      status: "Available",
      signalStrength: "-72",
      assignedDate: "",
      lastDetected: "2023-03-25 16:05 PM",
    },
  ]

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.room && patient.room.toLowerCase().includes(searchTerm.toLowerCase()))

    if (wardFilter === "all") return matchesSearch
    return matchesSearch && patient.ward.toLowerCase().includes(wardFilter.replace("-", " "))
  })

  // Filter RFID tags based on search term and status
  const filteredRfidTags = rfidTags.filter((tag) => {
    const matchesSearch =
      tag.id.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
      tag.code.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
      tag.assignedTo.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
      tag.location.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
      tag.status.toLowerCase().includes(tagSearchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && tag.status.toLowerCase() === statusFilter.toLowerCase()
  })

  // Filter BLE beacons based on search term and status
  const filteredBleBeacons = bleBeacons.filter((beacon) => {
    const matchesSearch =
      beacon.id.toLowerCase().includes(beaconSearchTerm.toLowerCase()) ||
      beacon.code.toLowerCase().includes(beaconSearchTerm.toLowerCase()) ||
      beacon.assignedTo.toLowerCase().includes(beaconSearchTerm.toLowerCase()) ||
      beacon.location.toLowerCase().includes(beaconSearchTerm.toLowerCase()) ||
      beacon.status.toLowerCase().includes(beaconSearchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && beacon.status.toLowerCase() === statusFilter.toLowerCase()
  })

  return (
    <div className="min-h-screen w-full p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground mt-1">Register patients and link them to RFID tags & BLE beacons</p>
          </div>
          <div className="flex items-center gap-2">
            <RobotStatus status="idle" />
            <BatteryStatus level={85} />
            <div className="fixed z-50 top-6 right-6 md:static md:z-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Tabs defaultValue="patients">
          <TabsList>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="rfid">RFID Tags</TabsTrigger>
            <TabsTrigger value="ble">BLE Beacons</TabsTrigger>
            <TabsTrigger value="register">Register New</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Patients</CardTitle>
                <CardDescription>View and manage all registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by ID, name, ward, room..."
                      className="pl-8 w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all" value={wardFilter} onValueChange={setWardFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wards</SelectItem>
                      <SelectItem value="ward-a">Ward A</SelectItem>
                      <SelectItem value="ward-b">Ward B</SelectItem>
                      <SelectItem value="ward-c">Ward C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>RFID Tag</TableHead>
                      <TableHead>BLE Beacon</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No patients found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.ward}</TableCell>
                          <TableCell>{patient.room || "-"}</TableCell>
                          <TableCell>{patient.rfidTag}</TableCell>
                          <TableCell>{patient.bleBeacon}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#1A9CB0] text-white hover:bg-[#158799]"
                              onClick={() => {
                                setSelectedPatient(patient)
                                setEditMode(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPatient(patient)
                                setEditMode(false)
                              }}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rfid" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>RFID Tags</CardTitle>
                <CardDescription>Manage RFID tags for patient identification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      className="pl-8 w-[300px]"
                      value={tagSearchTerm}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag Code</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRfidTags.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No RFID tags found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRfidTags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>{tag.code}</TableCell>
                          <TableCell>{tag.assignedTo}</TableCell>
                          <TableCell>{tag.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                tag.status === "Active"
                                  ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              }
                            >
                              {tag.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#1A9CB0] text-white hover:bg-[#158799]"
                              onClick={() => setSelectedTag(tag)}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ble" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>BLE Beacons</CardTitle>
                <CardDescription>Manage BLE beacons for patient location tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search beacons..."
                      className="pl-8 w-[300px]"
                      value={beaconSearchTerm}
                      onChange={(e) => setBeaconSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Beacon Code</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBleBeacons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No BLE beacons found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBleBeacons.map((beacon) => (
                        <TableRow key={beacon.id}>
                          <TableCell>{beacon.code}</TableCell>
                          <TableCell>{beacon.assignedTo}</TableCell>
                          <TableCell>{beacon.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                beacon.status === "Active"
                                  ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              }
                            >
                              {beacon.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#1A9CB0] text-white hover:bg-[#158799]"
                              onClick={() => setSelectedBeacon(beacon)}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Register New Patient</CardTitle>
                <CardDescription>Add a new patient and assign RFID tag & BLE beacon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input id="patient-name" placeholder="Patient's full name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward</Label>
                    <div className="flex gap-2">
                      <Select value={registerWard} onValueChange={setRegisterWard}>
                        <SelectTrigger id="ward" className="flex-1">
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ward-a">Ward A</SelectItem>
                          <SelectItem value="ward-b">Ward B</SelectItem>
                          <SelectItem value="ward-c">Ward C</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => setIsMapSelectorOpen(true)}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room (Optional)</Label>
                    <Select value={registerRoom} onValueChange={setRegisterRoom}>
                      <SelectTrigger id="room">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room-101">Room 101</SelectItem>
                        <SelectItem value="room-102">Room 102</SelectItem>
                        <SelectItem value="room-103">Room 103</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rfid-tag">RFID Tag</Label>
                    <Select>
                      <SelectTrigger id="rfid-tag">
                        <SelectValue placeholder="Select RFID tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rfid-d4">RFID-D4 (Available)</SelectItem>
                        <SelectItem value="rfid-e5">RFID-E5 (Available)</SelectItem>
                        <SelectItem value="rfid-f6">RFID-F6 (Available)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ble-beacon">BLE Beacon</Label>
                    <Select>
                      <SelectTrigger id="ble-beacon">
                        <SelectValue placeholder="Select BLE beacon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ble-004">BLE-004 (Available)</SelectItem>
                        <SelectItem value="ble-005">BLE-005 (Available)</SelectItem>
                        <SelectItem value="ble-006">BLE-006 (Available)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical-condition">Medical Condition</Label>
                    <Input id="medical-condition" placeholder="Patient's medical condition" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contact-info">Contact Information</Label>
                    <Input id="contact-info" placeholder="Next of kin contact details" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" placeholder="Any additional information" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Register Patient</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Patient Details/Edit Dialog */}
        {selectedPatient && (
          <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
            <DialogContent className="max-w-3xl p-6">
              <DialogHeader className="mb-4">
                <DialogTitle>{editMode ? "Edit Patient" : "Patient Details"}</DialogTitle>
                <DialogDescription>
                  {editMode
                    ? "Update patient information and assigned devices"
                    : `Viewing details for patient ${selectedPatient.id}`}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-6 py-2 px-2">
                  {!editMode && (
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-[#1A9CB0] flex items-center justify-center text-white text-xl font-semibold">
                        {selectedPatient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                        <p className="text-muted-foreground">{selectedPatient.id}</p>
                      </div>
                      {!editMode && (
                        <Button className="ml-auto" onClick={() => setEditMode(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Patient
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-patient-id">Patient ID</Label>
                      <Input id="edit-patient-id" value={editedPatient?.id || ""} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-patient-name">Full Name</Label>
                      <Input
                        id="edit-patient-name"
                        value={editedPatient?.name || ""}
                        onChange={(e) => handlePatientChange("name", e.target.value)}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-ward">Ward</Label>
                      {editMode ? (
                        <div className="flex gap-2">
                          <Select
                            defaultValue={selectedPatient.ward.toLowerCase().replace(" ", "-")}
                            onValueChange={(value) =>
                              handlePatientChange(
                                "ward",
                                value === "ward-a" ? "Ward A" : value === "ward-b" ? "Ward B" : "Ward C",
                              )
                            }
                          >
                            <SelectTrigger id="edit-ward" className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ward-a">Ward A</SelectItem>
                              <SelectItem value="ward-b">Ward B</SelectItem>
                              <SelectItem value="ward-c">Ward C</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon" onClick={() => setIsEditMapSelectorOpen(true)}>
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Input id="edit-ward" value={editedPatient?.ward || ""} disabled />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-room">Room (Optional)</Label>
                      {editMode ? (
                        <Select
                          defaultValue={selectedPatient.room?.toLowerCase().replace(" ", "-")}
                          onValueChange={(value) =>
                            handlePatientChange(
                              "room",
                              value === "room-101" ? "Room 101" : value === "room-102" ? "Room 102" : "Room 103",
                            )
                          }
                        >
                          <SelectTrigger id="edit-room">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="room-101">Room 101</SelectItem>
                            <SelectItem value="room-102">Room 102</SelectItem>
                            <SelectItem value="room-103">Room 103</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input id="edit-room" value={editedPatient?.room || "Not assigned"} disabled />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-rfid-tag">RFID Tag</Label>
                      {editMode ? (
                        <Select
                          defaultValue={selectedPatient.rfidTag.toLowerCase()}
                          onValueChange={(value) => handlePatientChange("rfidTag", value.toUpperCase())}
                        >
                          <SelectTrigger id="edit-rfid-tag">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedPatient.rfidTag.toLowerCase()}>
                              {selectedPatient.rfidTag} (Current)
                            </SelectItem>
                            <SelectItem value="rfid-d4">RFID-D4 (Available)</SelectItem>
                            <SelectItem value="rfid-e5">RFID-E5 (Available)</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input id="edit-rfid-tag" value={editedPatient?.rfidTag || ""} disabled />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-ble-beacon">BLE Beacon</Label>
                      {editMode ? (
                        <Select
                          defaultValue={selectedPatient.bleBeacon.toLowerCase()}
                          onValueChange={(value) => handlePatientChange("bleBeacon", value.toUpperCase())}
                        >
                          <SelectTrigger id="edit-ble-beacon">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedPatient.bleBeacon.toLowerCase()}>
                              {selectedPatient.bleBeacon} (Current)
                            </SelectItem>
                            <SelectItem value="ble-004">BLE-004 (Available)</SelectItem>
                            <SelectItem value="ble-005">BLE-005 (Available)</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input id="edit-ble-beacon" value={editedPatient?.bleBeacon || ""} disabled />
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-admission-date">Admission Date</Label>
                      <Input
                        id="edit-admission-date"
                        type="date"
                        value={editedPatient?.admissionDate || ""}
                        onChange={(e) => handlePatientChange("admissionDate", e.target.value)}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-medical-condition">Medical Condition</Label>
                      <Input
                        id="edit-medical-condition"
                        value={editedPatient?.medicalCondition || ""}
                        onChange={(e) => handlePatientChange("medicalCondition", e.target.value)}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-contact-info">Contact Information</Label>
                      <Input
                        id="edit-contact-info"
                        value={editedPatient?.contactInfo || ""}
                        onChange={(e) => handlePatientChange("contactInfo", e.target.value)}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-notes">Additional Notes</Label>
                      <Textarea
                        id="edit-notes"
                        value={editedPatient?.notes || ""}
                        onChange={(e) => handlePatientChange("notes", e.target.value)}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  {!editMode && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Delivery History</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-3 rounded-md border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">Medication Delivery</p>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Task ID: T-0998</p>
                            <p className="text-sm text-muted-foreground">Delivered: Yesterday, 4:30 PM</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-md border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">Medical Supplies</p>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Task ID: T-0990</p>
                            <p className="text-sm text-muted-foreground">Delivered: 2 days ago, 10:15 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="mt-6">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setSelectedPatient(null)}>Close</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* RFID Tag Details Dialog */}
        {selectedTag && (
          <Dialog open={!!selectedTag} onOpenChange={(open) => !open && setSelectedTag(null)}>
            <DialogContent className="max-w-lg p-6 max-h-[90vh]">
              <DialogHeader className="mb-2">
                <DialogTitle>RFID Tag Details</DialogTitle>
                <DialogDescription>Viewing details for RFID tag {selectedTag.id}</DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 py-2">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#1A9CB0] flex items-center justify-center text-white">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedTag.code}</h2>
                      <p className="text-muted-foreground">Tag ID: {selectedTag.id}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            selectedTag.status === "Active"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          }
                        >
                          {selectedTag.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTag.location}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned To</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTag.assignedTo !== "-" ? selectedTag.assignedTo : "Not assigned"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Scanned</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTag.lastScanned}</span>
                      </div>
                    </div>

                    {selectedTag.assignedDate && (
                      <div className="space-y-2">
                        <Label>Assigned Date</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedTag.assignedDate}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedTag.status === "Active" && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Usage History</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-4 p-3 rounded-md border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <History className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Scanned for delivery</p>
                            <p className="text-sm text-muted-foreground mt-1">Task ID: T-0998</p>
                            <p className="text-sm text-muted-foreground">Time: Yesterday, 4:30 PM</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-md border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <History className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Scanned for delivery</p>
                            <p className="text-sm text-muted-foreground mt-1">Task ID: T-0990</p>
                            <p className="text-sm text-muted-foreground">Time: 2 days ago, 10:15 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* BLE Beacon Details Dialog */}
        {selectedBeacon && (
          <Dialog open={!!selectedBeacon} onOpenChange={(open) => !open && setSelectedBeacon(null)}>
            <DialogContent className="max-w-lg p-6 max-h-[90vh]">
              <DialogHeader className="mb-2">
                <DialogTitle>BLE Beacon Details</DialogTitle>
                <DialogDescription>Viewing details for BLE beacon {selectedBeacon.id}</DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 py-2">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#1A9CB0] flex items-center justify-center text-white">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedBeacon.code}</h2>
                      <p className="text-muted-foreground">Beacon ID: {selectedBeacon.id}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            selectedBeacon.status === "Active"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          }
                        >
                          {selectedBeacon.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBeacon.location}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned To</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBeacon.assignedTo !== "-" ? selectedBeacon.assignedTo : "Not assigned"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Signal Strength (RSSI)</Label>
                      <div className="flex items-center gap-2">
                        <span>{selectedBeacon.signalStrength} dBm</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Detected</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBeacon.lastDetected}</span>
                      </div>
                    </div>

                    {selectedBeacon.assignedDate && (
                      <div className="space-y-2">
                        <Label>Assigned Date</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedBeacon.assignedDate}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedBeacon.status === "Active" && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Detection History</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-4 p-3 rounded-md border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <History className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Detected during delivery</p>
                            <p className="text-sm text-muted-foreground mt-1">Task ID: T-0998</p>
                            <p className="text-sm text-muted-foreground">Time: Yesterday, 4:30 PM</p>
                            <p className="text-sm text-muted-foreground">Signal: -65 dBm</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-md border">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <History className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Detected during delivery</p>
                            <p className="text-sm text-muted-foreground mt-1">Task ID: T-0990</p>
                            <p className="text-sm text-muted-foreground">Time: 2 days ago, 10:15 AM</p>
                            <p className="text-sm text-muted-foreground">Signal: -68 dBm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Map Destination Selector for Registration */}
        <MapDestinationSelector
          open={isMapSelectorOpen}
          onOpenChange={setIsMapSelectorOpen}
          onSelectDestination={handleSelectDestination}
        />

        {/* Map Destination Selector for Editing */}
        <MapDestinationSelector
          open={isEditMapSelectorOpen}
          onOpenChange={setIsEditMapSelectorOpen}
          onSelectDestination={handleSelectDestination}
        />
      </div>
    </div>
  )
}

