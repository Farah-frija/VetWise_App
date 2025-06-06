"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Video, MessageCircle, MapPin, CreditCard, ArrowLeft, ArrowRight, Calendar, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = ["Choose Type", "Select Date", "Select Time", "Payment", "Confirmation"]

// Mock data for vet availability
const availabilityData = {
  // Key is date in YYYY-MM-DD format, value is array of available time slots
  "2024-06-06": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "2024-06-07": ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
  "2024-06-08": ["10:00 AM", "11:00 AM", "2:00 PM"],
  "2024-06-09": ["9:00 AM", "10:00 AM", "3:00 PM"],
  "2024-06-10": ["11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM"],
  "2024-06-11": ["9:00 AM", "10:00 AM", "2:00 PM"],
  "2024-06-12": ["9:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
}

export default function BookAppointment({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [appointmentType, setAppointmentType] = useState("")
  const [consultationMode, setConsultationMode] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const router = useRouter()

  const vet = {
    id: params.id,
    name: "Dr. Sarah Johnson",
    specialty: "Small Animal Medicine",
    clinic: "City Pet Clinic",
    image: "/placeholder.svg?height=100&width=100",
  }

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

  // Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const hasAvailability = availabilityData[date] && availabilityData[date].length > 0
      const isSelected = date === selectedDate

      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded-md cursor-pointer relative
            ${hasAvailability ? "hover:bg-violet-100" : "text-gray-400 cursor-not-allowed"}
            ${isSelected ? "bg-violet-600 text-white" : ""}
          `}
          onClick={() => {
            if (hasAvailability) {
              setSelectedDate(date)
              setSelectedTime("")
            }
          }}
        >
          {day}
          {hasAvailability && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
          )}
        </div>,
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-8">
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

          {/* Step 1.5: Select Mode (only for online) */}
          {currentStep === 0 && appointmentType === "online" && (
            <div className="space-y-6 mt-6 pt-6 border-t">
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

          {/* Step 2: Select Date */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Available Date</h2>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-medium">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                </div>

                {selectedDate && (
                  <div className="mt-6 p-4 bg-violet-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-violet-600 mr-2" />
                      <span className="font-medium">Selected Date: {selectedDate}</span>
                    </div>
                    <p className="text-sm text-violet-700">
                      {availabilityData[selectedDate]?.length || 0} available time slots
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Available Time</h2>

                <div className="mb-4 p-4 bg-violet-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-violet-600 mr-2" />
                    <span className="font-medium">Date: {selectedDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availabilityData[selectedDate]?.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={selectedTime === time ? "bg-violet-600" : ""}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                      {selectedTime === time && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  ))}
                </div>

                {selectedTime && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      <span className="font-medium">
                        Selected Time: {selectedTime} on {selectedDate}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 3 && (
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
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {appointmentType === "online"
                            ? `${consultationMode === "video" ? "Video Call" : "Chat"} Consultation`
                            : "In-Person Consultation"}
                        </span>
                        <span className="font-bold text-lg">
                          ${appointmentType === "online" ? (consultationMode === "video" ? "65" : "45") : "75"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Date</span>
                        <span>{selectedDate}</span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Time</span>
                        <span>{selectedTime}</span>
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="w-full btn-primary">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                  (currentStep === 0 && appointmentType === "online" && !consultationMode) ||
                  (currentStep === 1 && !selectedDate) ||
                  (currentStep === 2 && !selectedTime)
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
  )
}
