"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Award, Clock, Shield, Star } from "lucide-react"
import Link from "next/link"
import { PublicHeader } from "@/components/public-header"

const stats = [
  { icon: Users, label: "Vétérinaires partenaires", value: "500+" },
  { icon: Heart, label: "Animaux soignés", value: "10,000+" },
  { icon: Star, label: "Note moyenne", value: "4.8/5" },
  { icon: Clock, label: "Disponibilité", value: "24h/7j" },
]

const team = [
  {
    name: "Dr. Marie Dubois",
    role: "Directrice Médicale",
    image: "/placeholder.svg?height=200&width=200",
    description: "15 ans d'expérience en médecine vétérinaire",
  },
  {
    name: "Jean Martin",
    role: "Directeur Technique",
    image: "/placeholder.svg?height=200&width=200",
    description: "Expert en technologies de la santé",
  },
  {
    name: "Sophie Laurent",
    role: "Responsable Qualité",
    image: "/placeholder.svg?height=200&width=200",
    description: "Spécialiste en assurance qualité des soins",
  },
]

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "Nous mettons l'amour des animaux au cœur de tout ce que nous faisons",
  },
  {
    icon: Shield,
    title: "Confiance",
    description: "Nous garantissons des soins de qualité et une plateforme sécurisée",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Nous sélectionnons uniquement les meilleurs vétérinaires",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">À propos de VetCare</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
            Nous révolutionnons les soins vétérinaires en connectant les propriétaires d'animaux avec les meilleurs
            vétérinaires de France
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full mb-4">
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Notre Mission</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
            Chez VetCare, nous croyons que chaque animal mérite les meilleurs soins possibles. Notre mission est de
            faciliter l'accès aux soins vétérinaires de qualité en créant une plateforme moderne, sécurisée et
            accessible à tous.
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Nous travaillons avec des vétérinaires qualifiés et expérimentés pour offrir des consultations en ligne et
            en présentiel, permettant aux propriétaires d'animaux de prendre soin de leurs compagnons en toute
            confiance.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-lg md:text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm md:text-base">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">Rejoignez la communauté VetCare</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
            Découvrez pourquoi des milliers de propriétaires nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
              >
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
