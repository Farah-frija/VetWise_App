"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Clock, Calendar } from "lucide-react"
import Link from "next/link"

const veterinarians = [
  {
    id: 1,
    name: "Dr. Marie Dubois",
    clinic: "Clinique Vétérinaire du Centre",
    speciality: "Médecine générale",
    rating: 4.8,
    reviews: 127,
    location: "Paris 15ème",
    image: "/placeholder.svg?height=100&width=100",
    price: "45€",
    availability: "Disponible aujourd'hui",
  },
  {
    id: 2,
    name: "Dr. Pierre Martin",
    clinic: "Cabinet Vétérinaire Saint-Germain",
    speciality: "Chirurgie",
    rating: 4.9,
    reviews: 89,
    location: "Paris 6ème",
    image: "/placeholder.svg?height=100&width=100",
    price: "60€",
    availability: "Disponible demain",
  },
  {
    id: 3,
    name: "Dr. Sophie Laurent",
    clinic: "Clinique des Animaux",
    speciality: "Dermatologie",
    rating: 4.7,
    reviews: 156,
    location: "Boulogne",
    image: "/placeholder.svg?height=100&width=100",
    price: "55€",
    availability: "Disponible aujourd'hui",
  },
]

export default function OwnerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clinicFilter, setClinicFilter] = useState("")

  const filteredVets = veterinarians.filter(
    (vet) =>
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      vet.clinic.toLowerCase().includes(clinicFilter.toLowerCase()),
  )

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bienvenue, Jean !</h1>
        <p className="text-gray-600 text-sm md:text-base">Trouvez le vétérinaire parfait pour vos compagnons</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mes Animaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">animaux enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rendez-vous à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Dernière consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">5j</div>
            <p className="text-xs text-gray-500">il y a 5 jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 md:mb-8">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Rechercher un vétérinaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par clinique..."
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Rechercher</Button>
          </div>
        </CardContent>
      </Card>

      {/* Veterinarians List */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
          Vétérinaires disponibles ({filteredVets.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredVets.map((vet) => (
            <Card key={vet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <img
                    src={vet.image || "/placeholder.svg"}
                    alt={vet.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg truncate">{vet.name}</CardTitle>
                    <CardDescription className="text-sm truncate">{vet.clinic}</CardDescription>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {vet.speciality}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-medium text-sm">{vet.rating}</span>
                    <span className="text-gray-500 text-sm">({vet.reviews} avis)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 text-sm truncate">{vet.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-green-600 font-medium text-sm">{vet.availability}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg md:text-2xl font-bold text-blue-600">{vet.price}</span>
                    <span className="text-gray-500 text-xs">par consultation</span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link href={`/owner/veterinarian/${vet.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm">
                        Voir plus
                      </Button>
                    </Link>
                    <Link href={`/owner/book-appointment/${vet.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        RDV
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
