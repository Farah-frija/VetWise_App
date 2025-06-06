"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, FileText } from "lucide-react"
import Link from "next/link"

const animals = [
  {
    id: 1,
    name: "Max",
    species: "Chien",
    breed: "Golden Retriever",
    age: "3 ans",
    weight: "28 kg",
    image: "/placeholder.svg?height=100&width=100",
    lastVisit: "15 mars 2024",
    nextAppointment: "22 avril 2024",
    status: "En bonne santé",
  },
  {
    id: 2,
    name: "Luna",
    species: "Chat",
    breed: "Persan",
    age: "2 ans",
    weight: "4.5 kg",
    image: "/placeholder.svg?height=100&width=100",
    lastVisit: "8 avril 2024",
    nextAppointment: null,
    status: "Suivi dermatologique",
  },
  {
    id: 3,
    name: "Charlie",
    species: "Lapin",
    breed: "Nain",
    age: "1 an",
    weight: "1.2 kg",
    image: "/placeholder.svg?height=100&width=100",
    lastVisit: "2 avril 2024",
    nextAppointment: "30 avril 2024",
    status: "En bonne santé",
  },
]

export default function AnimalsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mes Animaux</h1>
          <p className="text-gray-600 text-sm md:text-base">Gérez les informations de vos compagnons</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un animal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {animals.map((animal) => (
          <Card key={animal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-3 md:space-x-4">
                <img
                  src={animal.image || "/placeholder.svg"}
                  alt={animal.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg md:text-xl">{animal.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {animal.breed} • {animal.age}
                  </CardDescription>
                  <Badge
                    variant={animal.status === "En bonne santé" ? "default" : "secondary"}
                    className="mt-2 text-xs"
                  >
                    {animal.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Espèce:</span>
                    <p className="font-medium">{animal.species}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Poids:</span>
                    <p className="font-medium">{animal.weight}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500">Dernière visite:</span>
                    <span className="font-medium">{animal.lastVisit}</span>
                  </div>
                  {animal.nextAppointment && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-500">Prochain RDV:</span>
                      <span className="font-medium text-green-600">{animal.nextAppointment}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <Link href={`/owner/animals/${animal.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">Voir la fiche complète</Button>
                  </Link>
                  <Link href={`/owner/book-appointment?animal=${animal.id}`}>
                    <Button variant="outline" className="w-full text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Prendre RDV
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
