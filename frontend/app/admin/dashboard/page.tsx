import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

const systemStats = {
  totalUsers: 1247,
  totalVets: 89,
  totalAppointments: 3456,
  revenue: 125430,
  pendingVetApprovals: 5,
  activeChats: 23,
  completedConsultations: 2890,
  systemUptime: "99.9%",
}

const recentActivity = [
  {
    id: 1,
    type: "user_registration",
    message: "New pet owner registered: John Smith",
    time: "5 min ago",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "vet_approval",
    message: "Veterinarian Dr. Emily Rodriguez approved",
    time: "1 hour ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "appointment",
    message: "50 appointments completed today",
    time: "2 hours ago",
    icon: Calendar,
    color: "text-violet-600",
  },
  {
    id: 4,
    type: "alert",
    message: "System maintenance scheduled for tonight",
    time: "3 hours ago",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
]

const pendingApprovals = [
  {
    id: 1,
    name: "Dr. Michael Thompson",
    specialty: "Emergency Medicine",
    experience: "8 years",
    submittedDate: "2024-01-18",
  },
  {
    id: 2,
    name: "Dr. Lisa Chen",
    specialty: "Feline Medicine",
    experience: "12 years",
    submittedDate: "2024-01-17",
  },
  {
    id: 3,
    name: "Dr. Robert Wilson",
    specialty: "Surgery",
    experience: "15 years",
    submittedDate: "2024-01-16",
  },
]

const topVets = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    rating: 4.9,
    consultations: 156,
    revenue: 12450,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    rating: 4.8,
    consultations: 134,
    revenue: 10890,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    rating: 4.9,
    consultations: 142,
    revenue: 11230,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and management</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{systemStats.totalVets}</p>
                <p className="text-gray-600">Veterinarians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-violet-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{systemStats.totalAppointments.toLocaleString()}</p>
                <p className="text-gray-600">Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">${systemStats.revenue.toLocaleString()}</p>
                <p className="text-gray-600">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Vet Approvals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Pending Vet Approvals
                <Badge className="ml-2 bg-orange-100 text-orange-800">{systemStats.pendingVetApprovals}</Badge>
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/veterinarians">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((vet) => (
                <div key={vet.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{vet.name}</p>
                    <p className="text-sm text-gray-600">
                      {vet.specialty} • {vet.experience}
                    </p>
                    <p className="text-xs text-gray-500">Submitted: {vet.submittedDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="btn-primary">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">System Uptime</span>
              <Badge className="bg-green-100 text-green-800">{systemStats.systemUptime}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Chats</span>
              <span className="font-semibold">{systemStats.activeChats}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed Today</span>
              <span className="font-semibold">{systemStats.completedConsultations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Approvals</span>
              <Badge className="bg-orange-100 text-orange-800">{systemStats.pendingVetApprovals}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Vets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Veterinarians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVets.map((vet, index) => (
                <div key={vet.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-violet-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{vet.name}</p>
                      <p className="text-sm text-gray-600">{vet.consultations} consultations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${vet.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">⭐ {vet.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
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
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/admin/veterinarians">
                <UserCheck className="h-6 w-6 mb-2" />
                Review Vets
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/admin/statistics">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Stats
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/admin/settings">
                <Clock className="h-6 w-6 mb-2" />
                System Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
