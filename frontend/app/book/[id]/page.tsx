"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Video, MessageCircle, MapPin, CreditCard, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

const steps = ["Choose Type", "Select Mode", "Payment", "Schedule", "Confirmation"]

export default function BookAppointment({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [appointmentType, setAppointmentType] = useState("")
  const [consultationMode, setConsultationMode] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const router = useRouter()

  const vet = {
    name: "Dr. Sarah Johnson",
    specialty: "Small Animal Medicine",
    clinic: "City Pet Clinic",
    image: "/placeholder.svg?height=100&width=100",
  }

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirm = () => {
    // In real app, this would create the appointment
    router.push("/owner/appointments")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/vet/${params.id}`} className="flex items-center text-violet-600 hover:text-violet-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">with {vet.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${index <= currentStep ? "text-violet-600" : "text-gray-500"}`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${index < currentStep ? "bg-violet-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Choose Type */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose Appointment Type</h2>
                  <RadioGroup value={appointmentType} onValueChange={setAppointmentType}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <Video className="h-5 w-5 text-violet-600" />
                            <div>
                              <div className="font-medium">Online Consultation</div>
                              <div className="text-sm text-gray-500">Video call or chat with the veterinarian</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person" className="flex-1 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-violet-600" />
                            <div>
                              <div className="font-medium">In-Person Visit</div>
                              <div className="text-sm text-gray-500">Visit the clinic for physical examination</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Select Mode (only for online) */}
            {currentStep === 1 && appointmentType === "online" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose Consultation Mode</h2>
                  <RadioGroup value={consultationMode} onValueChange={setConsultationMode}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="video" id="video" />
                        <Label htmlFor="video" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Video className="h-5 w-5 text-violet-600" />
                              <div>
                                <div className="font-medium">Video Call</div>
                                <div className="text-sm text-gray-500">Face-to-face consultation</div>
                              </div>
                            </div>
                            <Badge variant="secondary">$65</Badge>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="chat" id="chat" />
                        <Label htmlFor="chat" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <MessageCircle className="h-5 w-5 text-violet-600" />
                              <div>
                                <div className="font-medium">Chat Consultation</div>
                                <div className="text-sm text-gray-500">Text-based consultation</div>
                              </div>
                            </div>
                            <Badge variant="secondary">$45</Badge>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
                  <div className="bg-violet-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="h-5 w-5 text-violet-600" />
                      <span className="font-medium">Payment is required to continue</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      You need to complete payment before accessing the consultation and scheduling your appointment.
                    </p>
                  </div>

                  <Card className="border-violet-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">
                          {appointmentType === "online"
                            ? `${consultationMode === "video" ? "Video Call" : "Chat"} Consultation`
                            : "In-Person Consultation"}
                        </span>
                        <span className="font-bold text-lg">
                          ${appointmentType === "online" ? (consultationMode === "video" ? "65" : "45") : "75"}
                        </span>
                      </div>
                      <Button className="w-full btn-primary">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Schedule */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose Date & Time</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Available Times</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? "btn-primary" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Appointment Confirmation</h2>
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-green-800 mb-2">Appointment Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Veterinarian:</strong> {vet.name}
                      </p>
                      <p>
                        <strong>Type:</strong>{" "}
                        {appointmentType === "online"
                          ? `Online - ${consultationMode === "video" ? "Video Call" : "Chat"}`
                          : "In-Person"}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime}
                      </p>
                      <p>
                        <strong>Status:</strong> Pending Confirmation
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Your appointment has been submitted and is pending confirmation from the veterinarian. You will
                    receive a notification once confirmed.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !appointmentType) ||
                    (currentStep === 1 && appointmentType === "online" && !consultationMode) ||
                    (currentStep === 3 && (!selectedDate || !selectedTime))
                  }
                  className="btn-primary"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleConfirm} className="btn-primary">
                  Confirm Appointment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
