"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, X, Eye, Star } from "lucide-react"
import Image from "next/image"

const veterinarians = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "s.johnson@vetclinic.com",
    specialty: "Small Animal Medicine",
    experience: "10 years",
    education: "DVM from Cornell University",
    status: "approved",
    rating: 4.9,
    consultations: 156,
    joinDate: "2023-12-01",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "m.chen@animalhosp.com",
    specialty: "Emergency Care",
    experience: "8 years",
    education: "DVM from UC Davis",
    status: "approved",
    rating: 4.8,
    consultations: 134,
    joinDate: "2023-11-15",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "e.rodriguez@catcare.com",
    specialty: "Feline Medicine",
    experience: "12 years",
    education: "DVM from University of Pennsylvania",
    status: "pending",
    rating: 0,
    consultations: 0,
    joinDate: "2024-01-18",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Dr. Michael Thompson",
    email: "m.thompson@emergency.vet",
    specialty: "Emergency Medicine",
    experience: "8 years",
    education: "DVM from Texas A&M",
    status: "pending",
    rating: 0,
    consultations: 0,
    joinDate: "2024-01-17",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export default function AdminVeterinarians() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredVets = veterinarians.filter((vet) => {
    const matchesSearch =
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vet.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleApprove = (vetId: number) => {
    // In real app, this would call API to approve vet
    console.log("Approving vet:", vetId)
  }

  const handleReject = (vetId: number) => {
    // In real app, this would call API to reject vet
    console.log("Rejecting vet:", vetId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Veterinarian Management</h1>
        <p className="text-gray-600 mt-2">Review and manage veterinarian applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{veterinarians.length}</p>
              <p className="text-gray-600">Total Vets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{veterinarians.filter((v) => v.status === "approved").length}</p>
              <p className="text-gray-600">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {veterinarians.filter((v) => v.status === "pending").length}
              </p>
              <p className="text-gray-600">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {veterinarians.filter((v) => v.status === "approved").reduce((sum, v) => sum + v.consultations, 0)}
              </p>
              <p className="text-gray-600">Total Consultations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Veterinarians Table */}
      <Card>
        <CardHeader>
          <CardTitle>Veterinarians</CardTitle>
          <CardDescription>Review veterinarian applications and manage existing vets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search veterinarians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veterinarian</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVets.map((vet) => (
                  <TableRow key={vet.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={vet.image || "/placeholder.svg"}
                          alt={vet.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">{vet.name}</p>
                          <p className="text-sm text-gray-600">{vet.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vet.specialty}</p>
                        <p className="text-sm text-gray-600">{vet.education}</p>
                      </div>
                    </TableCell>
                    <TableCell>{vet.experience}</TableCell>
                    <TableCell>
                      {vet.status === "approved" ? (
                        <div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{vet.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600">{vet.consultations} consultations</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not active</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vet.status)}>{vet.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {vet.status === "pending" && (
                          <>
                            <Button size="sm" className="btn-primary" onClick={() => handleApprove(vet.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(vet.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
