import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, X } from "lucide-react"

const appointments = [
  {
    id: 1,
    vetName: "Dr. Sarah Johnson",
    petName: "Whiskers",
    date: "2024-01-20",
    time: "10:00 AM",
    type: "Online - Video Call",
    status: "Pending Confirmation",
    clinic: "City Pet Clinic",
  },
  {
    id: 2,
    vetName: "Dr. Michael Chen",
    petName: "Buddy",
    date: "2024-01-18",
    time: "2:30 PM",
    type: "In-person",
    status: "Confirmed",
    clinic: "24/7 Animal Hospital",
  },
  {
    id: 3,
    vetName: "Dr. Emily Rodriguez",
    petName: "Whiskers",
    date: "2024-01-15",
    time: "11:00 AM",
    type: "Online - Chat",
    status: "Completed",
    clinic: "Cat Care Center",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Confirmation":
      return "bg-yellow-100 text-yellow-800"
    case "Confirmed":
      return "bg-green-100 text-green-800"
    case "Completed":
      return "bg-blue-100 text-blue-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MyAppointments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-2">View and manage your veterinary appointments</p>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{appointment.vetName}</CardTitle>
                  <CardDescription>
                    Appointment for {appointment.petName} at {appointment.clinic}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{appointment.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{appointment.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {appointment.type.includes("Online") ? (
                    <Video className="h-4 w-4 text-gray-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm">{appointment.type}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {appointment.status === "Pending Confirmation" && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
                {appointment.status === "Confirmed" && appointment.type.includes("Video") && (
                  <Button size="sm" className="btn-primary">
                    <Video className="h-4 w-4 mr-1" />
                    Join Video Call
                  </Button>
                )}
                {appointment.status === "Confirmed" && appointment.type.includes("Chat") && (
                  <Button size="sm" className="btn-primary">
                    Open Chat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
