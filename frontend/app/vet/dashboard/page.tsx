"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, FileText, CheckCircle, AlertCircle } from "lucide-react"

const todayStats = {
  appointmentsToConfirm: 3,
  confirmedAppointments: 8,
  completedConsultations: 5,
  totalPatients: 24,
}

const recentAppointments = [
  {
    id: 1,
    time: "09:00",
    owner: "Jean Dupont",
    animal: "Max (Chien)",
    type: "Consultation générale",
    status: "En attente",
  },
  {
    id: 2,
    time: "10:30",
    owner: "Marie Martin",
    animal: "Luna (Chat)",
    type: "Vaccination",
    status: "Confirmé",
  },
  {
    id: 3,
    time: "14:00",
    owner: "Pierre Durand",
    animal: "Charlie (Lapin)",
    type: "Suivi post-opératoire",
    status: "Confirmé",
  },
]

export default function VetDashboard() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bonjour Dr. Dubois !</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Voici un aperçu de votre journée du {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">RDV à confirmer</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-orange-600">{todayStats.appointmentsToConfirm}</div>
            <p className="text-xs text-gray-500">En attente de confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">RDV confirmés</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600">{todayStats.confirmedAppointments}</div>
            <p className="text-xs text-gray-500">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Consultations terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">{todayStats.completedConsultations}</div>
            <p className="text-xs text-gray-500">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Patients total</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-purple-600">{todayStats.totalPatients}</div>
            <p className="text-xs text-gray-500">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              <span>Rendez-vous d'aujourd'hui</span>
            </CardTitle>
            <CardDescription>Vos prochains rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                      <span className="font-medium text-blue-600 text-sm md:text-base">{appointment.time}</span>
                      <div>
                        <p className="font-medium text-sm md:text-base">{appointment.owner}</p>
                        <p className="text-xs md:text-sm text-gray-500">{appointment.animal}</p>
                        <p className="text-xs text-gray-400">{appointment.type}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant={appointment.status === "Confirmé" ? "default" : "secondary"} className="text-xs">
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Voir tous les rendez-vous
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
              <span>Actions rapides</span>
            </CardTitle>
            <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start text-sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Confirmer les rendez-vous en attente
              </Button>
              <Button className="w-full justify-start text-sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Créer une nouvelle consultation
              </Button>
              <Button className="w-full justify-start text-sm" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Voir l'emploi du temps
              </Button>
              <Button className="w-full justify-start text-sm" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gérer les patients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
