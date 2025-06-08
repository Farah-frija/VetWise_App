"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Heart, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState,use } from "react"
import { useParams } from "next/navigation"

interface Animal {
  id: number;
  nom: string;
  espece: string;
  race: string;
  dateNaissance: string;
  sexe: string;
  proprietaireId: number;
}

interface Consultation {
  id: number;
  dateConsultation: string;
  veterinaire:Vet;
  type: string;
  diagnostic: string;
  traitement: string;
  notes: string;
}
interface Vet {
  nom:string;
  prenom:string;
}



export default function PetProfile() {
  const [pet, setPet] = useState<Animal | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  useEffect(() => {
    
   
    // Fetch pet data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/animal/${params.id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch pet');
        return response.json();
      })
      .then(data => {
        setPet(data);
        // Fetch consultations for this pet
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}
/consultations/by-animal/${params.id}`);
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch consultations');
        return response.json();
      })
      .then(data => {
        setConsultations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params])

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diff = now.getTime() - birth.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  const getMockPhoto = (espece: string) => {
    const lowerEspece = espece.toLowerCase();

    
    if (lowerEspece.includes('cat')) return 'https://animalcorner.org/wp-content/uploads/2015/02/british-wild-cat-1.jpg';
    if (lowerEspece.includes('dog')) return 'https://th.bing.com/th/id/R.849f4c0032065d80637918c9b6519a87?rik=tIHLklC96Rk9qQ&riu=http%3a%2f%2fbebusinessed.com%2fwp-content%2fuploads%2f2014%2f03%2f734899052_13956580111.jpg&ehk=u1guZvgwmakfWgB1wuJVO%2fdQkFlxgaWNtwFz0Fn14wo%3d&risl=&pid=ImgRaw&r=0';
    if (lowerEspece.includes('bird')) return 'https://www.5minscraft.com/secure-admin/uploads/category/Birds.webp';
    if (lowerEspece.includes('cow')) return  'https://th.bing.com/th/id/R.f8e4b401e476887f0a43ca52ea405c35?rik=zTtueplHbCrT7Q&riu=http%3a%2f%2fhowtodoright.com%2fwp-content%2fuploads%2f2017%2f07%2fcowhero2.jpg&ehk=4RTwSA%2blBUTXHSW93Ea%2bmoPp%2fJNyGgN0w1ePmOX4ZMc%3d&risl=&pid=ImgRaw&r=0';
    return `https://th.bing.com/th/id/OIP.o4BPNCK1SZ087P9jSewHAAHaE8?r=0&rs=1&pid=ImgDetMain`;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading pet profile...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/owner/pets" className="flex items-center text-violet-600 hover:text-violet-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Pets
        </Link>
      </div>

      {/* Pet Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              
              src={getMockPhoto(pet.espece)}
              alt={pet.nom}
              width={200}
              height={200}
              className="rounded-full object-cover mx-auto md:mx-0"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-3xl flex items-center">
                    {pet.nom}
                    <Heart className="h-6 w-6 ml-2 text-red-500" />
                  </CardTitle>
                  <CardDescription className="text-lg">{pet.race}</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/owner/pets/${pet.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{getAge(pet.dateNaissance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Species</p>
                  <p className="font-semibold">{pet.espece}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sex</p>
                  <p className="font-semibold">{pet.sexe}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultations</p>
                  <p className="font-semibold">{consultations.length}</p>
                </div>
              </div>

              <div className="bg-violet-50 p-4 rounded-lg">
                <h4 className="font-medium text-violet-800 mb-2">Breed</h4>
                <p className="text-violet-700 text-sm">{pet.race}</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Consultation History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Consultation History
            </CardTitle>
            <Button className="btn-primary" asChild>
              <Link href={`/owner/dashboard?petId=${pet.id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                Book New Appointment
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card key={consultation.id} className="border-l-4 border-l-violet-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{consultation.type}</h4>
                        <p className="text-sm text-gray-600">with {consultation.veterinaire.nom} {consultation.veterinaire.prenom}</p>
                      </div>
                      <Badge variant="secondary">{consultation.dateConsultation}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Diagnosis: </span>
                        <span>{consultation.diagnostic}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Treatment: </span>
                        <span>{consultation.traitement}</span>
                      </div>
                      {consultation.notes && (
                        <div>
                          <span className="font-medium text-gray-700">Notes: </span>
                          <span>{consultation.notes}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No consultation history yet</p>
              <Button className="btn-primary" asChild>
                <Link href={`/owner/dashboard?petId=${pet.id}`}>Book First Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}