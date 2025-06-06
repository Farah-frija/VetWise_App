"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { VetSidebar } from "@/components/vet-sidebar"

export default function VetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn || userType !== "vet") {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <VetSidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}
