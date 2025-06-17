"use client"

import { useState } from "react"
import { Tag, Plus, Download, Upload, ToggleLeft, ToggleRight, Search, FileText, Wifi } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data for RFID tags
const mockRfidTags = [
  {
    id: "RFID-001",
    code: "A1B2C3D4",
    assignedTo: "Patient Room 101",
    lastScan: "2023-06-15T10:30:00",
    rssi: -65,
    status: "Active",
  },
  {
    id: "RFID-002",
    code: "E5F6G7H8",
    assignedTo: "Medication Cart 3",
    lastScan: "2023-06-15T09:45:00",
    rssi: -72,
    status: "Active",
  },
  {
    id: "RFID-003",
    code: "I9J0K1L2",
    assignedTo: "Supply Closet 2",
    lastScan: "2023-06-14T16:20:00",
    rssi: -58,
    status: "Inactive",
  },
  {
    id: "RFID-004",
    code: "M3N4O5P6",
    assignedTo: "Nurse Station 1",
    lastScan: "2023-06-15T11:10:00",
    rssi: -63,
    status: "Active",
  },
  {
    id: "RFID-005",
    code: "Q7R8S9T0",
    assignedTo: "Equipment Room",
    lastScan: "2023-06-15T08:30:00",
    rssi: -70,
    status: "Active",
  },
]

// Mock data for BLE beacons
const mockBleBeacons = [
  {
    id: "BLE-001",
    uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
    assignedTo: "Hallway Junction 1",
    lastRssi: -75,
    status: "Active",
  },
  {
    id: "BLE-002",
    uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893f",
    assignedTo: "Emergency Exit 2",
    lastRssi: -82,
    status: "Active",
  },
  {
    id: "BLE-003",
    uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0894a",
    assignedTo: "Elevator Lobby",
    lastRssi: -68,
    status: "Inactive",
  },
  {
    id: "BLE-004",
    uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0894b",
    assignedTo: "Cafeteria Entrance",
    lastRssi: -79,
    status: "Active",
  },
  {
    id: "BLE-005",
    uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0894c",
    assignedTo: "Main Reception",
    lastRssi: -65,
    status: "Active",
  },
]

// Mock data for tag history
const mockTagHistory = [
  {
    id: 1,
    tagId: "RFID-001",
    date: "2023-06-01T09:00:00",
    action: "Assigned",
    details: "Assigned to Patient Room 101",
  },
  {
    id: 2,
    tagId: "RFID-001",
    date: "2023-05-15T14:30:00",
    action: "Scanned",
    details: "Scanned by ROB-002 at Hallway Junction",
  },
  {
    id: 3,
    tagId: "RFID-001",
    date: "2023-05-10T11:15:00",
    action: "Activated",
    details: "Tag activated and added to system",
  },
  {
    id: 4,
    tagId: "RFID-001",
    date: "2023-05-01T08:45:00",
    action: "Registered",
    details: "Tag registered in database",
  },
]

export default function TagManagementPage() {
  const [rfidTags, setRfidTags] = useState(mockRfidTags)
  const [bleBeacons, setBleBeacons] = useState(mockBleBeacons)
  const [selectedTag, setSelectedTag] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState({
    type: "rfid",
    id: "",
    code: "",
    uuid: "",
    assignedTo: "",
    status: "Active",
  })
  const router = useRouter()

  // Function to handle adding a new tag
  const handleAddTag = () => {
    if (newTag.type === "rfid") {
      const rfidToAdd = {
        id: newTag.id,
        code: newTag.code,
        assignedTo: newTag.assignedTo,
        lastScan: new Date().toISOString(),
        rssi: -70,
        status: newTag.status,
      }
      setRfidTags([...rfidTags, rfidToAdd])
    } else {
      const bleToAdd = {
        id: newTag.id,
        uuid: newTag.uuid,
        assignedTo: newTag.assignedTo,
        lastRssi: -75,
        status: newTag.status,
      }
      setBleBeacons([...bleBeacons, bleToAdd])
    }
    setIsAddDialogOpen(false)
    setNewTag({
      type: "rfid",
      id: "",
      code: "",
      uuid: "",
      assignedTo: "",
      status: "Active",
    })
  }

  // Function to toggle tag status
  const toggleTagStatus = (id: string, type: string) => {
    if (type === "rfid") {
      const updatedTags = rfidTags.map((tag) => {
        if (tag.id === id) {
          return {
            ...tag,
            status: tag.status === "Active" ? "Inactive" : "Active",
          }
        }
        return tag
      })
      setRfidTags(updatedTags)
    } else {
      const updatedBeacons = bleBeacons.map((beacon) => {
        if (beacon.id === id) {
          return {
            ...beacon,
            status: beacon.status === "Active" ? "Inactive" : "Active",
          }
        }
        return beacon
      })
      setBleBeacons(updatedBeacons)
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Function to view tag details
  const viewTagDetails = (tag: any, type: string) => {
    setSelectedTag({ ...tag, type })
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tag Management</h1>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tag</DialogTitle>
                <DialogDescription>Enter the details for the new identification tag.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag-type" className="text-right">
                    Tag Type
                  </Label>
                  <Select onValueChange={(value) => setNewTag({ ...newTag, type: value })} defaultValue={newTag.type}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select tag type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfid">RFID Tag</SelectItem>
                      <SelectItem value="ble">BLE Beacon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag-id" className="text-right">
                    Tag ID
                  </Label>
                  <Input
                    id="tag-id"
                    value={newTag.id}
                    onChange={(e) => setNewTag({ ...newTag, id: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                {newTag.type === "rfid" ? (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tag-code" className="text-right">
                      RFID Code
                    </Label>
                    <Input
                      id="tag-code"
                      value={newTag.code}
                      onChange={(e) => setNewTag({ ...newTag, code: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tag-uuid" className="text-right">
                      BLE UUID
                    </Label>
                    <Input
                      id="tag-uuid"
                      value={newTag.uuid}
                      onChange={(e) => setNewTag({ ...newTag, uuid: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag-assigned" className="text-right">
                    Assigned To
                  </Label>
                  <Input
                    id="tag-assigned"
                    value={newTag.assignedTo}
                    onChange={(e) => setNewTag({ ...newTag, assignedTo: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewTag({ ...newTag, status: value })}
                    defaultValue={newTag.status}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTag}>Add Tag</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tags..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="rfid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rfid">RFID Tags</TabsTrigger>
          <TabsTrigger value="ble">BLE Beacons</TabsTrigger>
        </TabsList>

        <TabsContent value="rfid">
          <Card>
            <CardHeader>
              <CardTitle>RFID Tags</CardTitle>
              <CardDescription>Manage RFID tags used throughout the facility</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tag Code</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>RSSI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfidTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.id}</TableCell>
                      <TableCell>{tag.code}</TableCell>
                      <TableCell>{tag.assignedTo}</TableCell>
                      <TableCell>{formatDate(tag.lastScan)}</TableCell>
                      <TableCell>{tag.rssi} dBm</TableCell>
                      <TableCell>
                        <Badge className={tag.status === "Active" ? "bg-green-500" : "bg-gray-500"}>{tag.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => toggleTagStatus(tag.id, "rfid")}>
                            {tag.status === "Active" ? (
                              <ToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => viewTagDetails(tag, "rfid")}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ble">
          <Card>
            <CardHeader>
              <CardTitle>BLE Beacons</CardTitle>
              <CardDescription>Manage Bluetooth Low Energy beacons used for indoor positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>UUID</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Last RSSI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bleBeacons.map((beacon) => (
                    <TableRow key={beacon.id}>
                      <TableCell className="font-medium">{beacon.id}</TableCell>
                      <TableCell className="font-mono text-xs">{beacon.uuid}</TableCell>
                      <TableCell>{beacon.assignedTo}</TableCell>
                      <TableCell>{beacon.lastRssi} dBm</TableCell>
                      <TableCell>
                        <Badge className={beacon.status === "Active" ? "bg-green-500" : "bg-gray-500"}>
                          {beacon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => toggleTagStatus(beacon.id, "ble")}>
                            {beacon.status === "Active" ? (
                              <ToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => viewTagDetails(beacon, "ble")}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tag Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tag Details</DialogTitle>
            <DialogDescription>Detailed information and history for {selectedTag?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tag Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedTag?.type === "rfid" ? (
                      <Tag className="h-5 w-5 text-primary" />
                    ) : (
                      <Wifi className="h-5 w-5 text-primary" />
                    )}
                    <span className="font-medium">{selectedTag?.type === "rfid" ? "RFID Tag" : "BLE Beacon"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedTag?.id}</div>

                    {selectedTag?.type === "rfid" ? (
                      <>
                        <div className="font-medium">Tag Code:</div>
                        <div className="col-span-2">{selectedTag?.code}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">UUID:</div>
                        <div className="col-span-2 font-mono text-xs">{selectedTag?.uuid}</div>
                      </>
                    )}

                    <div className="font-medium">Assigned To:</div>
                    <div className="col-span-2">{selectedTag?.assignedTo}</div>

                    <div className="font-medium">Status:</div>
                    <div className="col-span-2">
                      <Badge className={selectedTag?.status === "Active" ? "bg-green-500" : "bg-gray-500"}>
                        {selectedTag?.status}
                      </Badge>
                    </div>

                    {selectedTag?.type === "rfid" ? (
                      <>
                        <div className="font-medium">Last Scan:</div>
                        <div className="col-span-2">{selectedTag && formatDate(selectedTag.lastScan)}</div>
                        <div className="font-medium">RSSI:</div>
                        <div className="col-span-2">{selectedTag?.rssi} dBm</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">Last RSSI:</div>
                        <div className="col-span-2">{selectedTag?.lastRssi} dBm</div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTagHistory.map((history) => (
                    <div key={history.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{history.action}</span>
                        <span className="text-muted-foreground">{formatDate(history.date)}</span>
                      </div>
                      <p className="text-sm mt-1">{history.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
