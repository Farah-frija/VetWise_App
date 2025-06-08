"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Heart, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"

interface Animal {
  id: number;
  nom: string;
  espece: string;
  race: string;
  dateNaissance: string;
  sexe: string;
  proprietaireId: number;
}

// Mock photos for different animal types
const mockPhotos: Record<string, string> = {
  'cat': 'https://animalcorner.org/wp-content/uploads/2015/02/british-wild-cat-1.jpg',
  'dog': 'https://th.bing.com/th/id/R.849f4c0032065d80637918c9b6519a87?rik=tIHLklC96Rk9qQ&riu=http%3a%2f%2fbebusinessed.com%2fwp-content%2fuploads%2f2014%2f03%2f734899052_13956580111.jpg&ehk=u1guZvgwmakfWgB1wuJVO%2fdQkFlxgaWNtwFz0Fn14wo%3d&risl=&pid=ImgRaw&r=0',
  'bird': 'https://www.5minscraft.com/secure-admin/uploads/category/Birds.webp',
  'cow': 'https://th.bing.com/th/id/R.f8e4b401e476887f0a43ca52ea405c35?rik=zTtueplHbCrT7Q&riu=http%3a%2f%2fhowtodoright.com%2fwp-content%2fuploads%2f2017%2f07%2fcowhero2.jpg&ehk=4RTwSA%2blBUTXHSW93Ea%2bmoPp%2fJNyGgN0w1ePmOX4ZMc%3d&risl=&pid=ImgRaw&r=0',
  'default': '/placeholder.svg'
}

export default function MyPets() {
  const [pets, setPets] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, token } = useAuth()
  useEffect(() => {
    if (!user?.id) return
    // In a real app, you'd get the propId from user context or auth
    const propId = user.id // Replace with actual owner ID
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/animal/mypets/${propId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch pets')
        }
        return response.json()
      })
      .then(data => {
        setPets(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const diff = now.getTime() - birth.getTime()
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    
    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${months} month${months > 1 ? 's' : ''}`
  }

  const getPhoto = (espece: string) => {
    const lowerEspece = espece.toLowerCase()
    if (lowerEspece.includes('cat')) return mockPhotos.cat
    if (lowerEspece.includes('dog')) return mockPhotos.dog
    if (lowerEspece.includes('bird')) return mockPhotos.bird
    if (lowerEspece.includes('cow')) return mockPhotos.cow
    return mockPhotos.default
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading pets...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (pets.length === 0) return <div>No pets found. Add your first pet!</div>

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
          <Card key={pet.id} className="hover:shadow-lg transition-shadow cursor-pointer" >
            <Link href={`/owner/pets/${pet.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Image
                    src={getPhoto(pet.espece)}
                    alt={pet.nom}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center">
                      {pet.nom}
                      <Heart className="h-4 w-4 ml-2 text-red-500" />
                    </CardTitle>
                    <CardDescription className="text-base">{pet.race}</CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {getAge(pet.dateNaissance)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Species:</span>
                    <span className="font-medium">{pet.espece}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Breed:</span>
                    <span className="font-medium">{pet.race}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sex:</span>
                    <span className="font-medium">{pet.sexe}</span>
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
