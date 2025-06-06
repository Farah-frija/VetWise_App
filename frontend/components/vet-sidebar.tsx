"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Calendar, CalendarDays, FileText, User, LogOut, Stethoscope } from "lucide-react"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/vet/dashboard",
    icon: BarChart3,
  },
  {
    title: "Rendez-vous",
    url: "/vet/appointments",
    icon: Calendar,
  },
  {
    title: "Emploi du temps",
    url: "/vet/schedule",
    icon: CalendarDays,
  },
  {
    title: "Consultations",
    url: "/vet/consultations",
    icon: FileText,
  },
  {
    title: "Profil",
    url: "/vet/profile",
    icon: User,
  },
]

export function VetSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Stethoscope className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
          <span className="text-lg md:text-xl font-bold">VetCare Pro</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 md:p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg">
                  <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="text-sm md:text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-2 md:p-4">
        <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="text-xs md:text-sm">MD</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm md:text-base truncate">Dr. Marie Dubois</p>
            <p className="text-xs md:text-sm text-gray-500">Vétérinaire</p>
          </div>
        </div>
        <Button variant="outline" className="w-full text-xs md:text-sm" onClick={handleLogout}>
          <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          Se déconnecter
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
