import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, Video, MessageCircle, Shield, Heart, CheckCircle, Cat } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Stop stressing about your pet's health with{" "}
                <span className="text-violet-300">24/7 online vet care</span>
              </h1>
              <p className="text-xl mb-8 text-violet-100">
                Talk to a vet in minutes and receive a care and treatment plan with the top-ranked pet health app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg" asChild>
                  <Link href="/register">Join Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-violet-300 text-violet-100 hover:bg-violet-800"
                  asChild
                >
                  <Link href="/about">Learn more</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Video calls available
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat support
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Veterinarian video call interface"
                width={400}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How <span className="text-violet-600">VetCat</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get the veterinary care your pet needs in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cat className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create a Profile</h3>
              <p className="text-gray-600">
                Sign up and create profiles for all your pets with our AI-powered breed detection
              </p>
            </div>
            <div className="text-center">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with a Vet</h3>
              <p className="text-gray-600">
                Choose from our network of licensed veterinarians for video, chat, or in-person visits
              </p>
            </div>
            <div className="text-center">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Care & Treatment</h3>
              <p className="text-gray-600">Receive personalized care plans, prescriptions, and follow-up support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-violet-600">VetCat</span>
            </h2>
            <p className="text-xl text-gray-600">Thousands of top-rated practicing veterinarians are on VetCat</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="font-bold mb-2">24/7 Availability</h3>
                <p className="text-gray-600 text-sm">Access veterinary care anytime, day or night</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="font-bold mb-2">Licensed Professionals</h3>
                <p className="text-gray-600 text-sm">All our vets are fully licensed and experienced</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="font-bold mb-2">Satisfaction Guaranteed</h3>
                <p className="text-gray-600 text-sm">100% satisfaction or your money back</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="font-bold mb-2">Compassionate Care</h3>
                <p className="text-gray-600 text-sm">Dedicated to the health and happiness of your pets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Pet Owners Say</h2>
            <p className="text-xl text-gray-600">Thousands of satisfied pet owners trust VetCat</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <Card key={testimonial}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "VetCat was a lifesaver when my dog got sick in the middle of the night. The vet was professional,
                    caring, and helped us right away. I highly recommend this service!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Sarah T.</p>
                      <p className="text-sm text-gray-600">Dog Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of pet owners who trust VetCat for their pet's healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100" asChild>
              <Link href="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-violet-700" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
