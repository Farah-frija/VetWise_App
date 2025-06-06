import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Video, MessageCircle, Calendar, Award, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"

// Mock vet data - in real app this would come from API
const getVetData = (id: string) => ({
  id,
  name: "Dr. Sarah Johnson",
  specialty: "Small Animal Medicine & Surgery",
  clinic: "City Pet Clinic",
  rating: 4.9,
  reviews: 127,
  location: "New York, NY",
  available: true,
  image: "/placeholder.svg?height=200&width=200",
  bio: "Dr. Sarah Johnson is a dedicated veterinarian with over 10 years of experience in small animal medicine. She specializes in preventive care, surgery, and emergency medicine. Dr. Johnson is passionate about providing compassionate care for pets and educating pet owners.",
  education: "DVM from Cornell University College of Veterinary Medicine",
  experience: "10+ years",
  languages: ["English", "Spanish"],
  services: ["General Checkups", "Vaccinations", "Surgery", "Emergency Care", "Dental Care"],
  availability: {
    online: true,
    inPerson: true,
    hours: "Mon-Fri: 9AM-6PM, Sat: 9AM-2PM",
  },
  pricing: {
    consultation: 75,
    videoCall: 65,
    chat: 45,
  },
})

export default function VetProfile({ params }: { params: { id: string } }) {
  const vet = getVetData(params.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <Image
                src={vet.image || "/placeholder.svg"}
                alt={vet.name}
                width={200}
                height={200}
                className="rounded-lg object-cover mx-auto md:mx-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{vet.name}</CardTitle>
                    <CardDescription className="text-lg">{vet.specialty}</CardDescription>
                  </div>
                  {vet.available && <Badge className="bg-green-100 text-green-800">Available Now</Badge>}
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold ml-1">{vet.rating}</span>
                    <span className="text-gray-500 ml-1">({vet.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vet.clinic} • {vet.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Button className="btn-primary" asChild>
                    <Link href={`/owner/book/${vet.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/owner/chat?vet=${vet.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat - ${vet.pricing.chat}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/owner/video?vet=${vet.id}`}>
                      <Video className="h-4 w-4 mr-2" />
                      Video Call - ${vet.pricing.videoCall}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About Dr. {vet.name.split(" ")[1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{vet.bio}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {vet.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-violet-600" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-violet-50 rounded-lg">
                  <h3 className="font-medium mb-2">Working Hours</h3>
                  <p className="text-sm text-violet-700">{vet.availability.hours}</p>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {/* Example calendar showing next 14 days */}
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={`week1-${i}`}
                      className={`h-10 flex items-center justify-center rounded-md
                        ${i === 0 ? "text-gray-400" : "hover:bg-violet-100 cursor-pointer"}
                      `}
                    >
                      {i + 1}
                      {i > 0 && i !== 6 && <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>}
                    </div>
                  ))}

                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={`week2-${i}`}
                      className={`h-10 flex items-center justify-center rounded-md
                        ${i === 0 ? "text-gray-400" : "hover:bg-violet-100 cursor-pointer"}
                      `}
                    >
                      {i + 8}
                      {i > 0 && i < 5 && <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button className="btn-primary" asChild>
                    <Link href={`/owner/book/${vet.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Check Full Availability & Book
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">• 2 days ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        "Dr. Johnson was amazing with my cat. Very thorough and caring. Highly recommend!"
                      </p>
                      <p className="text-xs text-gray-500 mt-1">- Pet Owner</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-violet-600" />
                  <span className="text-sm">{vet.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-violet-600" />
                  <span className="text-sm">{vet.reviews} happy clients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-violet-600" />
                  <span className="text-sm">{vet.availability.hours}</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultation Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">In-person consultation</span>
                  <span className="font-semibold">${vet.pricing.consultation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Video call</span>
                  <span className="font-semibold">${vet.pricing.videoCall}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Chat consultation</span>
                  <span className="font-semibold">${vet.pricing.chat}</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vet.languages.map((language) => (
                    <Badge key={language} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
