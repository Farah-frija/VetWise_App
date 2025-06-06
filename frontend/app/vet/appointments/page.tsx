"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User, Phone, Mail, Check, X } from "lucide-react"

const appointments = [
  {
    id: 1,
    date: "2024-04-22",
    time: "09:00",
    owner: "Jean Dupont",
    phone: "06 12 34 56 78",
    email: "jean.dupont@email.com",
    animal: "Max",
    species: "Chien",
    breed: "Golden Retriever",
    type: "Consultation générale",
    mode: "En présentiel",
    status: "En attente",
    notes: "Premier rendez-vous, vaccination à vérifier",
  },
  {
    id: 2,
    date: "2024-04-22",
    time: "10:30",
    owner: "Marie Martin",
    phone: "06 98 76 54 32",
    email: "marie.martin@email.com",
    animal: "Luna",
    species: "Chat",
    breed: "Persan",
    type: "Vaccination",
    mode: "En présentiel",
    status: "Confirmé",
    notes: "Rappel vaccin annuel",
  },
  {
    id: 3,
    date: "2024-04-22",
    time: "14:00",
    owner: "Pierre Durand",
    phone: "06 11 22 33 44",
    email: "pierre.durand@email.com",
    animal: "Charlie",
    species: "Lapin",
    breed: "Nain",
    type: "Suivi post-opératoire",
    mode: "En présentiel",
    status: "Confirmé",
    notes: "Contrôle cicatrisation après stérilisation",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmé":
      return "bg-green-100 text-green-800"
    case "En attente":
      return "bg-yellow-100 text-yellow-800"
    case "Terminé":
      return "bg-blue-100 text-blue-800"
    case "Annulé":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function VetAppointmentsPage() {
  const [selectedTab, setSelectedTab] = useState("all")

  const handleConfirmAppointment = (id: number) => {
    console.log("Confirming appointment:", id)
  }

  const handleCompleteAppointment = (id: number) => {
    console.log("Completing appointment:", id)
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedTab === "pending") return appointment.status === "En attente"
    if (selectedTab === "confirmed") return appointment.status === "Confirmé"
    if (selectedTab === "completed") return appointment.status === "Terminé"
    return true
  })

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Gestion des Rendez-vous</h1>
        <p className="text-gray-600 text-sm md:text-base">Gérez vos consultations et confirmez les rendez-vous</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="all" className="text-xs md:text-sm">
            Tous ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-sm">
            En attente ({appointments.filter((a) => a.status === "En attente").length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="text-xs md:text-sm">
            Confirmés ({appointments.filter((a) => a.status === "Confirmé").length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs md:text-sm">
            Terminés ({appointments.filter((a) => a.status === "Terminé").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4 md:space-y-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg md:text-xl">
                      {appointment.type} - {appointment.animal}
                    </CardTitle>
                    <CardDescription>
                      {appointment.species} • {appointment.breed}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm md:text-base">
                          {new Date(appointment.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-500">à {appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm md:text-base">{appointment.owner}</p>
                        <p className="text-sm text-gray-500">Propriétaire</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <p className="font-medium text-sm md:text-base">{appointment.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <p className="font-medium text-sm md:text-base break-all">{appointment.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Type de consultation</p>
                      <p className="font-medium text-sm md:text-base">{appointment.mode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium text-sm md:text-base">{appointment.notes}</p>
                    </div>
                  </div>
                </div>

                {appointment.status === "En attente" && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                        onClick={() => handleConfirmAppointment(appointment.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button variant="destructive" className="w-full sm:w-auto">
                        <X className="h-4 w-4 mr-2" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                )}

                {appointment.status === "Confirmé" && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                        onClick={() => handleCompleteAppointment(appointment.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Modifier
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
