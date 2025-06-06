"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Clock, Heart, Shield, Users } from "lucide-react"
import Link from "next/link"
import { PublicHeader } from "@/components/public-header"

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
  {
    id: 4,
    name: "Dr. Thomas Rousseau",
    clinic: "Urgences Vétérinaires 24h",
    speciality: "Urgences",
    rating: 4.6,
    reviews: 203,
    location: "Paris 11ème",
    image: "/placeholder.svg?height=100&width=100",
    price: "80€",
    availability: "Disponible maintenant",
  },
]

const features = [
  {
    icon: Heart,
    title: "Soins de qualité",
    description: "Des vétérinaires qualifiés et expérimentés pour vos compagnons",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Plateforme sécurisée pour protéger vos données personnelles",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Rejoignez une communauté de propriétaires d'animaux bienveillants",
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clinicFilter, setClinicFilter] = useState("")

  const filteredVets = veterinarians.filter(
    (vet) =>
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      vet.clinic.toLowerCase().includes(clinicFilter.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Trouvez le vétérinaire parfait pour votre animal
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-4xl mx-auto px-4">
            Consultez des vétérinaires qualifiés en ligne ou en présentiel. Prenez rendez-vous facilement et offrez les
            meilleurs soins à votre compagnon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            Pourquoi choisir VetCare ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
              Rechercher un vétérinaire
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom de vétérinaire..."
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
          </div>
        </div>
      </section>

      {/* Veterinarians Grid */}
      <section className="px-4 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            Vétérinaires disponibles ({filteredVets.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredVets.map((vet) => (
              <Card key={vet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
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
                      <span className="text-xl md:text-2xl font-bold text-blue-600">{vet.price}</span>
                      <span className="text-gray-500 text-xs">par consultation</span>
                    </div>
                    <Link href={`/veterinarian/${vet.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">Voir la fiche</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Prêt à prendre soin de votre animal ?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
            Rejoignez des milliers de propriétaires qui font confiance à VetCare
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Créer un compte gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
