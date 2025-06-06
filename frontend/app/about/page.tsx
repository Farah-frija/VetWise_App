import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Award, Cat } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-violet-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">About VetCat</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to make quality veterinary care accessible to all pet owners, anytime and anywhere.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                VetCat was founded in 2020 by a team of veterinarians and pet lovers who recognized the need for more
                accessible veterinary care. We saw firsthand how many pet owners struggled to get timely advice and care
                for their beloved animals.
              </p>
              <p className="text-gray-700 mb-4">
                Our platform was built to bridge this gap, connecting pet owners with licensed veterinarians through
                video calls, chat consultations, and in-person appointments. We believe that every pet deserves quality
                healthcare, and every owner deserves peace of mind.
              </p>
              <p className="text-gray-700">
                Today, VetCat serves thousands of pet owners across the country, providing 24/7 access to veterinary
                expertise. Our network of veterinarians continues to grow, all sharing our commitment to compassionate,
                convenient pet care.
              </p>
            </div>
            <div className="relative">
              <div className="bg-violet-100 absolute inset-0 rounded-lg transform translate-x-4 translate-y-4"></div>
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="VetCat team"
                width={500}
                height={400}
                className="rounded-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at VetCat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Compassion</h3>
                <p className="text-gray-600">
                  We treat every pet as if they were our own, with kindness, patience, and understanding.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We uphold the highest standards of veterinary ethics and always put the welfare of pets first.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every interaction, providing the highest quality care possible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Meet the dedicated professionals behind VetCat</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="text-center">
                <div className="mb-4 relative">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Team member"
                    width={200}
                    height={200}
                    className="rounded-full mx-auto"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">Dr. Jane Smith</h3>
                <p className="text-violet-600 mb-2">Chief Veterinary Officer</p>
                <p className="text-gray-600 text-sm">
                  15+ years experience in veterinary medicine, specializing in small animal care.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p>Happy Pet Owners</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p>Licensed Veterinarians</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p>Availability</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Cat className="h-12 w-12 text-violet-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the VetCat Family</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're a pet owner seeking care or a veterinarian looking to join our network, we'd love to hear
            from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-primary px-8 py-3 rounded-lg font-semibold">
              Sign Up Now
            </a>
            <a
              href="/contact"
              className="bg-violet-100 hover:bg-violet-200 text-violet-700 px-8 py-3 rounded-lg font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
