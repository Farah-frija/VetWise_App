"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Mock AI breed prediction API response
interface BreedPrediction {
  breed: string
  confidence: number
}

export default function AddPet() {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    color: "",
    notes: "",
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [predictedBreeds, setPredictedBreeds] = useState<BreedPrediction[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError(null)

    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size should be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBreedPrediction = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    setPredictedBreeds([])

    try {
      // In a real app, this would be an actual API call to an AI service
      // For this demo, we'll simulate the API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response - in a real app, this would come from the AI API
      const mockPredictions: BreedPrediction[] = [
        { breed: "Persian Cat", confidence: 0.92 },
        { breed: "Siamese Cat", confidence: 0.05 },
        { breed: "Maine Coon", confidence: 0.03 },
      ]

      setPredictedBreeds(mockPredictions)

      // Auto-fill the breed field with the top prediction
      if (mockPredictions.length > 0) {
        setFormData((prev) => ({ ...prev, breed: mockPredictions[0].breed }))
      }
    } catch (error) {
      console.error("Error predicting breed:", error)
      setUploadError("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would save the pet data
    router.push("/owner/pets")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/owner/pets" className="flex items-center text-violet-600 hover:text-violet-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Pets
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Pet</h1>
        <p className="text-gray-600 mt-2">Add your pet's information to your profile</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Photo Upload with AI Breed Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Pet Photo</span>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Breed Detection
                </Badge>
              </CardTitle>
              <CardDescription>Upload a photo of your pet and our AI will help identify the breed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedImage ? (
                  <div className="relative">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Pet photo"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover mx-auto"
                    />
                    <div className="flex space-x-2 mt-4 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedImage(null)
                          setImageFile(null)
                          setPredictedBreeds([])
                        }}
                      >
                        Remove Photo
                      </Button>
                      {!isAnalyzing && predictedBreeds.length === 0 && (
                        <Button
                          type="button"
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700"
                          onClick={handleBreedPrediction}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Breed
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload a photo of your pet</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="pet-photo"
                    />
                    <Label htmlFor="pet-photo" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Choose Photo
                      </Button>
                    </Label>
                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                  </div>
                )}

                {isAnalyzing && (
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 text-violet-600 animate-spin" />
                      <span className="text-sm text-violet-700">Analyzing breed...</span>
                    </div>
                  </div>
                )}

                {predictedBreeds.length > 0 && !isAnalyzing && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">AI Breed Prediction</span>
                    </div>
                    <div className="space-y-2">
                      {predictedBreeds.map((prediction, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <p className="text-green-800">{prediction.breed}</p>
                          <Badge variant="outline" className="bg-white">
                            {Math.round(prediction.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-3">You can confirm or override this prediction below</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pet Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Whiskers"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                    placeholder="e.g., Persian Cat"
                  />
                  {predictedBreeds.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">AI suggested: {predictedBreeds[0].breed}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="e.g., 3 years"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="e.g., 4.2 kg"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="e.g., White"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special notes about your pet..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="submit" className="btn-primary">
              Add Pet
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/owner/pets">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
