"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  email: string
  role: "owner" | "vet" | "admin"
  name: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  register: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Mock authentication
    const mockUser: User = {
      id: "1",
      email,
      role: role as "owner" | "vet" | "admin",
      name: email.split("@")[0],
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return true
  }

  const register = async (email: string, password: string, role: string): Promise<boolean> => {
    // Mock registration
    const mockUser: User = {
      id: "1",
      email,
      role: role as "owner" | "vet" | "admin",
      name: email.split("@")[0],
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
