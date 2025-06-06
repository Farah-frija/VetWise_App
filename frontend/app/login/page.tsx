"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Stethoscope, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (userType: "owner" | "vet" | "admin") => {
    // Simulate login - in real app, this would be API call
    localStorage.setItem("userType", userType)
    localStorage.setItem("isLoggedIn", "true")

    if (userType === "owner") {
      router.push("/owner/dashboard")
    } else if (userType === "vet") {
      router.push("/vet/dashboard")
    } else {
      router.push("/admin/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <span className="text-xl md:text-2xl font-bold text-gray-900">VetCare</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-600 text-sm md:text-base">Choisissez votre type de compte</p>
        </div>

        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="owner" className="flex items-center space-x-1 text-xs md:text-sm">
              <User className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Propriétaire</span>
              <span className="sm:hidden">Prop.</span>
            </TabsTrigger>
            <TabsTrigger value="vet" className="flex items-center space-x-1 text-xs md:text-sm">
              <Stethoscope className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Vétérinaire</span>
              <span className="sm:hidden">Vét.</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-1 text-xs md:text-sm">
              <Shield className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Adm.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Espace Propriétaire</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Connectez-vous pour gérer vos animaux et rendez-vous
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="owner-email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="owner-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-password" className="text-sm">
                    Mot de passe
                  </Label>
                  <Input
                    id="owner-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleLogin("owner")}>
                  Se connecter
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vet">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <Stethoscope className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Espace Vétérinaire</span>
                </CardTitle>
                <CardDescription className="text-sm">Accédez à votre espace professionnel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vet-email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="vet-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vet-password" className="text-sm">
                    Mot de passe
                  </Label>
                  <Input
                    id="vet-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleLogin("vet")}>
                  Se connecter
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <Shield className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Espace Administrateur</span>
                </CardTitle>
                <CardDescription className="text-sm">Accès réservé aux administrateurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@vetcare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-sm">
                    Mot de passe
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleLogin("admin")}>
                  Se connecter
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              S'inscrire
            </Link>
          </p>
          <Link href="/" className="text-blue-600 hover:underline text-sm block mt-2">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
