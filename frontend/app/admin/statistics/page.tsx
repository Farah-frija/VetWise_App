import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Calendar, DollarSign, MessageCircle, Star } from "lucide-react"

const monthlyStats = [
  { month: "Jan", users: 120, appointments: 450, revenue: 15600 },
  { month: "Feb", users: 145, appointments: 520, revenue: 18200 },
  { month: "Mar", users: 180, appointments: 680, revenue: 23400 },
  { month: "Apr", users: 210, appointments: 750, revenue: 26800 },
  { month: "May", users: 250, appointments: 890, revenue: 31200 },
  { month: "Jun", users: 290, appointments: 1020, revenue: 35600 },
]

const topMetrics = {
  totalRevenue: 151800,
  totalUsers: 1247,
  totalAppointments: 4312,
  averageRating: 4.8,
  completionRate: 94.5,
  responseTime: "2.3 min",
}

export default function AdminStatistics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h1>
        <p className="text-gray-600 mt-2">Platform performance and usage analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold">${topMetrics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold">{topMetrics.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.2% from last month
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-3xl font-bold">{topMetrics.totalAppointments.toLocaleString()}</p>
                <p className="text-sm text-violet-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.3% from last month
                </p>
              </div>
              <Calendar className="h-12 w-12 text-violet-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold flex items-center">
                  <Star className="h-6 w-6 text-yellow-400 fill-current mr-1" />
                  {topMetrics.averageRating}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{topMetrics.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{topMetrics.responseTime}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Growth</CardTitle>
          <CardDescription>Platform growth over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div key={stat.month} className="grid grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                <div className="font-medium">{stat.month} 2024</div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Users</p>
                  <p className="font-semibold">+{stat.users}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="font-semibold">{stat.appointments}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="font-semibold">${stat.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Video Consultations</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-violet-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>In-person Visits</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Chat Consultations</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Active Users</span>
                <span className="font-semibold">342</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Active Users</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Active Users</span>
                <span className="font-semibold">3,891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Session Duration</span>
                <span className="font-semibold">12.5 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
