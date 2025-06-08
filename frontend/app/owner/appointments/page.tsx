"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  X,
  MessageCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"

type RendezVous = {
  id: number
  date: string
  heure: string
  motif: string
  type: string
  statut: string
  notes?: string
  veterinaire: {
    nom: string
    prenom: string
    email: string
  }
  animaux: {
    animal: {
      nom: string
    }
  }[]
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Confirmation"
    case "confirmed":
      return "Confirmed"
    case "completed":
      return "Completed"
    case "canceled":
      return "Cancelled"
    default:
      return "Unknown"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "canceled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MyAppointments() {
  const { user, token } = useAuth()
  const [appointments, setAppointments] = useState<RendezVous[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    fetch(`http://localhost:3001/rendezvous/proprietaire/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erreur chargement rendez-vous:", err)
        setLoading(false)
      })
  }, [user?.id, token])

  const handleCancel = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/rendezvous/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw new Error("Failed to cancel appointment")

      setAppointments((prev) =>
        prev.map((rdv) =>
          rdv.id === id ? { ...rdv, statut: "canceled" } : rdv
        )
      )
    } catch (error) {
      console.error("Erreur lors de l’annulation :", error)
      alert("Failed to cancel the appointment.")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-2">
          View and manage your veterinary appointments
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const typeLabel =
              appointment.type === "online" ? "Online" : "In-person"
            const vetFullName = `Dr. ${appointment.veterinaire.prenom} ${appointment.veterinaire.nom}`
            const petNames = appointment.animaux
              .map((a) => a.animal.nom)
              .join(", ")

            return (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vetFullName}</CardTitle>
                      <CardDescription>
                        Appointment for {petNames}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(appointment.statut)}>
                      {getStatusLabel(appointment.statut)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{appointment.heure}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.type === "online" ? (
                        appointment.notes?.toLowerCase().includes("chat") ? (
                          <MessageCircle className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Video className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm">{typeLabel}</span>
                    </div>
                  </div>

<div className="flex flex-wrap gap-2">
                    {appointment.statut === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}

  {appointment.statut === "confirmed" && (
    <>
      {appointment.type === "online" &&
        appointment.notes?.toLowerCase().includes("video") && (
          <Button size="sm" className="btn-primary">
            <Video className="h-4 w-4 mr-1" />
            Join Video Call
          </Button>
        )}

      {appointment.type === "online" &&
        appointment.notes?.toLowerCase().includes("chat") && (
          <Button size="sm" className="btn-primary">
            <MessageCircle className="h-4 w-4 mr-1" />
            Open Chat
          </Button>
        )}

    <Button
      variant="outline"
      size="sm"
      className="text-green-600 hover:text-green-700"
    >      Proceed to payement
    </Button>
    </>
  )}
</div>

                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
