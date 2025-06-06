import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageCircle, Clock, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

const todayStats = {
  appointments: 8,
  pendingConfirmations: 3,
  completedConsultations: 12,
  activeChats: 5,
}

const todayAppointments = [
  {
    id: 1,
    time: "9:00 AM",
    petOwner: "John Doe",
    petName: "Whiskers",
    type: "Video Call",
    status: "Confirmed",
  },
  {
    id: 2,
    time: "10:30 AM",
    petOwner: "Sarah Smith",
    petName: "Buddy",
    type: "In-person",
    status: "Pending",
  },
  {
    id: 3,
    time: "2:00 PM",
    petOwner: "Mike Johnson",
    petName: "Luna",
    type: "Chat",
    status: "Confirmed",
  },
]

const recentMessages = [
  {
    id: 1,
    from: "John Doe",
    message: "Whiskers is feeling much better, thank you!",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    from: "Sarah Smith",
    message: "Can we reschedule tomorrow's appointment?",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    from: "Mike Johnson",
    message: "Luna's medication seems to be working well",
    time: "2 hours ago",
    unread: false,
  },
]

export default function VetDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Dr. Johnson! Here's your overview for today.</p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{todayStats.appointments}</p>
                <p className="text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{todayStats.pendingConfirmations}</p>
                <p className="text-gray-600">Pending Confirmations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{todayStats.activeChats}</p>
                <p className="text-gray-600">Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-violet-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{todayStats.completedConsultations}</p>
                <p className="text-gray-600">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/vet/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.time}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.petOwner} - {appointment.petName}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {appointment.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      className={
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    {appointment.status === "Pending" && (
                      <Button size="sm" className="btn-primary">
                        Confirm
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Messages</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/vet/chat">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{message.from}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{message.time}</span>
                      {message.unread && <div className="w-2 h-2 bg-violet-600 rounded-full"></div>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="btn-primary h-20 flex-col" asChild>
              <Link href="/vet/schedule">
                <Clock className="h-6 w-6 mb-2" />
                Manage Schedule
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/vet/consultations">
                <Users className="h-6 w-6 mb-2" />
                New Consultation
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/vet/chat">
                <MessageCircle className="h-6 w-6 mb-2" />
                Open Chat
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/vet/appointments">
                <Calendar className="h-6 w-6 mb-2" />
                View Appointments
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
