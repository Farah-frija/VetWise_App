"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { OwnerSidebar } from "@/components/owner-sidebar"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn || userType !== "owner") {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <OwnerSidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}
