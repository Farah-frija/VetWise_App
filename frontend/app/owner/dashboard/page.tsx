import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, MessageCircle, Clock, Plus, AlertTriangle, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const upcomingAppointments = [
  {
    id: 1,
    vetName: "Dr. Sarah Johnson",
    petName: "Whiskers",
    date: "Today",
    time: "2:00 PM",
    type: "Video Call",
    status: "Confirmed",
  },
  {
    id: 2,
    vetName: "Dr. Michael Chen",
    petName: "Buddy",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "In-person",
    status: "Pending",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "appointment",
    message: "Appointment with Dr. Johnson completed",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "reminder",
    message: "Whiskers vaccination due next week",
    time: "1 day ago",
    icon: AlertTriangle,
    color: "text-yellow-600",
  },
  {
    id: 3,
    type: "message",
    message: "New message from Dr. Rodriguez",
    time: "2 days ago",
    icon: MessageCircle,
    color: "text-blue-600",
  },
]

const pets = [
  {
    id: 1,
    name: "Whiskers",
    breed: "Persian Cat",
    image: "/placeholder.svg?height=60&width=60",
    nextCheckup: "2024-02-15",
  },
  {
    id: 2,
    name: "Buddy",
    breed: "Golden Retriever",
    image: "/placeholder.svg?height=60&width=60",
    nextCheckup: "2024-03-01",
  },
]

const veterinarians = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Small Animal Medicine",
    clinic: "City Pet Clinic",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Emergency Care",
    clinic: "24/7 Animal Hospital",
    rating: 4.8,
    reviews: 89,
    location: "Los Angeles, CA",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function OwnerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your pets.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-violet-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{pets.length}</p>
                <p className="text-gray-600">My Pets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">3</p>
                <p className="text-gray-600">Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">1</p>
                <p className="text-gray-600">Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/owner/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.vetName}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.petName} • {appointment.date} at {appointment.time}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming appointments</p>
                <Button className="btn-primary" asChild>
                  <Link href="/owner/dashboard">Book Appointment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Pets Quick View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Pets</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/owner/pets/add">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pets.map((pet) => (
                <Link key={pet.id} href={`/owner/pets/${pet.id}`} className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Image
                      src={pet.image || "/placeholder.svg"}
                      alt={pet.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                      <p className="text-xs text-gray-500">Next checkup: {pet.nextCheckup}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Veterinarians */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Veterinarians</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {veterinarians.map((vet) => (
              <Card key={vet.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={vet.image || "/placeholder.svg"}
                      alt={vet.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{vet.name}</p>
                      <p className="text-sm text-gray-600">{vet.specialty}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium ml-1">{vet.rating}</span>
                      </div>
                      <div className="mt-2">
                        <Button size="sm" className="btn-primary text-xs" asChild>
                          <Link href={`/owner/book/${vet.id}`}>Book</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
