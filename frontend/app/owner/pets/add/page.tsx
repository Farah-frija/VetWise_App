"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";

interface BreedPrediction {
  breed: string;
  confidence: number;
}

export default function AddPet() {
  const [formData, setFormData] = useState({
    nom: "",
    espece: "",
    race: "",
    dateNaissance: "",
    sexe: "",
    proprietaireId: 0
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [predictedBreeds, setPredictedBreeds] = useState<BreedPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.onerror = () => {
        setUploadError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBreedPrediction = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setPredictedBreeds([]);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile); 

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Transform the API response into our BreedPrediction format
      const predictions: BreedPrediction[] = Object.entries(data.all_classes)
        .map(([breed, confidence]) => ({
          breed,
          confidence: confidence as number,
        }))
        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence descending
        .slice(0, 3); // Take top 3 predictions

      setPredictedBreeds(predictions);

      if (predictions.length > 0) {
        setFormData((prev) => ({ ...prev, race: predictions[0].breed }));
      }
    } catch (error) {
      console.error("Error predicting breed:", error);
      setUploadError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return
    try {
      // Prepare the request body
      const requestBody = {
        nom: formData.nom,
        espece: formData.espece,
        race: formData.race,
        dateNaissance: formData.dateNaissance 
          ? new Date(formData.dateNaissance).toISOString() 
          : new Date().toISOString(), // Fallback to current date if not provided
        sexe: formData.sexe,
        proprietaireId:user.id// Replace with actual owner ID or get from auth context
      };
  
      // Send the request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      router.push('/owner/pets');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setUploadError('Failed to save pet information. Please try again.');
    }finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        alt="Pet photo"
                        fill
                        className="object-contain" // or "object-contain" based on preference
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        src={selectedImage}
                      />
                    </div>
                    <div className="flex space-x-2 mt-4 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedImage(null);
                          setImageFile(null);
                          setPredictedBreeds([]);
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
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="pet-photo"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={triggerFileInput}
                    >
                      Choose Photo
                    </Button>
                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                    <p className="text-xs text-gray-500 mt-2">JPEG, PNG up to 5MB</p>
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
                          {(prediction.confidence * 100).toFixed(2)}% confidence
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
                  <Label htmlFor="nom">Pet Name *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    placeholder="e.g., Whiskers"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="espece">Species *</Label>
                  <Input
                    id="espece"
                    value={formData.espece}
                    onChange={(e) => handleInputChange("espece", e.target.value)}
                    placeholder="e.g., Cat, Dog"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="race">Breed</Label>
                  <Input
                    id="race"
                    value={formData.race}
                    onChange={(e) => handleInputChange("race", e.target.value)}
                    placeholder="e.g., Persian Cat"
                  />
                  {predictedBreeds.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">AI suggested: {predictedBreeds[0].breed}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sexe">Gender</Label>
                  <Input
                    id="sexe"
                    value={formData.sexe}
                    onChange={(e) => handleInputChange("sexe", e.target.value)}
                    placeholder="e.g., Male, Female"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateNaissance">Birth Date</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
          <Button 
            type="submit"
            className="bg-violet-600 hover:bg-violet-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Pet'
            )}
          </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/owner/pets">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}