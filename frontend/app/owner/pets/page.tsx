"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Heart, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const pets = [
  {
    id: 1,
    name: "Whiskers",
    breed: "Persian Cat",
    age: "3 years",
    weight: "4.2 kg",
    color: "White",
    image: "/placeholder.svg?height=100&width=100",
    lastVisit: "2024-01-15",
  },
  {
    id: 2,
    name: "Buddy",
    breed: "Golden Retriever",
    age: "5 years",
    weight: "28 kg",
    color: "Golden",
    image: "/placeholder.svg?height=100&width=100",
    lastVisit: "2023-12-20",
  },
]

export default function MyPets() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
          <p className="text-gray-600 mt-2">Manage your pet profiles and health records</p>
        </div>
        <Button className="btn-primary" asChild>
          <Link href="/owner/pets/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New Pet
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
            <Link href={`/owner/pets/${pet.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Image
                    src={pet.image || "/placeholder.svg"}
                    alt={pet.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center">
                      {pet.name}
                      <Heart className="h-4 w-4 ml-2 text-red-500" />
                    </CardTitle>
                    <CardDescription className="text-base">{pet.breed}</CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {pet.age}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{pet.weight}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{pet.color}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="font-medium">{pet.lastVisit}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-violet-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    View consultation history
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
