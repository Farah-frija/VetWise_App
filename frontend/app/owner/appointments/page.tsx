"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, X } from "lucide-react"

const appointments = [
  {
    id: 1,
    date: "2024-04-22",
    time: "14:30",
    type: "Consultation générale",
    mode: "En présentiel",
    vet: "Dr. Marie Dubois",
    clinic: "Clinique Vétérinaire du Centre",
    animal: "Max",
    status: "Confirmé",
    address: "123 Rue de la Paix, Paris 15ème",
  },
  {
    id: 2,
    date: "2024-04-30",
    time: "10:00",
    type: "Suivi dermatologique",
    mode: "En ligne",
    vet: "Dr. Sophie Laurent",
    clinic: "Clinique des Animaux",
    animal: "Luna",
    status: "En attente",
    address: null,
  },
  {
    id: 3,
    date: "2024-04-18",
    time: "16:00",
    type: "Vaccination",
    mode: "En présentiel",
    vet: "Dr. Pierre Martin",
    clinic: "Cabinet Vétérinaire Saint-Germain",
    animal: "Charlie",
    status: "Terminé",
    address: "45 Boulevard Saint-Germain, Paris 6ème",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmé":
      return "bg-green-100 text-green-800"
    case "En attente":
      return "bg-yellow-100 text-yellow-800"
    case "Terminé":
      return "bg-gray-100 text-gray-800"
    case "Annulé":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AppointmentsPage() {
  const handleCancelAppointment = (id: number) => {
    // Handle appointment cancellation
    console.log("Cancelling appointment:", id)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mes Rendez-vous</h1>
        <p className="text-gray-600 text-sm md:text-base">Gérez vos consultations vétérinaires</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg md:text-xl">{appointment.type}</CardTitle>
                  <CardDescription>
                    Pour {appointment.animal} avec {appointment.vet}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
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
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p className="font-medium text-sm md:text-base">{appointment.time}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm md:text-base">{appointment.vet}</p>
                      <p className="text-sm text-gray-500">{appointment.clinic}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Type de consultation</p>
                    <p className="font-medium text-sm md:text-base">{appointment.mode}</p>
                  </div>
                  {appointment.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium text-sm md:text-base">{appointment.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {appointment.status === "En attente" && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="w-full sm:w-auto"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler le rendez-vous
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Modifier
                    </Button>
                  </div>
                </div>
              )}

              {appointment.status === "Confirmé" && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {appointment.mode === "En ligne" && (
                      <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" size="sm">
                        Rejoindre la consultation
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Voir les détails
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
