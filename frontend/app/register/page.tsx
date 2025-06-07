"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cat, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [role, setRole] = useState("owner");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  // Veterinarian specific fields
  const [specialization, setSpecialization] = useState("");
  const [numLicence, setNumLicence] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register_pet_owner, register_vet, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let success = false;

      if (role === "owner") {
        success = await register_pet_owner(
          nom,
          prenom,
          email,
          password,
          telephone || undefined,
          adresse || undefined
        );
      } else if (role === "vet") {
        success = await register_vet(
          nom,
          prenom,
          email,
          password,
          telephone || undefined,
          adresse || undefined,
          specialization || undefined,
          numLicence || undefined
        );
      }

      if (success) {
        // Redirect based on registered role
        if (role === "owner") {
          router.push("/owner/dashboard");
        } else if (role === "vet") {
          router.push("/vet/dashboard");
        }
      } else {
        setError(
          "Registration failed. Please check your information and try again."
        );
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      console.error("Registration error:", err);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Cat className="h-12 w-12 text-violet-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-violet-600">
            Join VetCat
          </CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="role">I am a:</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="owner">Pet Owner</option>
                <option value="vet">Veterinarian</option>
              </select>
            </div>

            {/* Common fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">First Name *</Label>
                <Input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="nom">Last Name *</Label>
                <Input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter a secure password"
              />
            </div>

            <div>
              <Label htmlFor="telephone">Phone Number</Label>
              <Input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+216 12 345 678"
              />
            </div>

            <div>
              <Label htmlFor="adresse">Address</Label>
              <Input
                id="adresse"
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Street, City, Country"
              />
            </div>

            {/* Veterinarian specific fields */}
            {role === "vet" && (
              <>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g., Small Animals, Surgery, Internal Medicine"
                  />
                </div>

                <div>
                  <Label htmlFor="numLicence">License Number</Label>
                  <Input
                    id="numLicence"
                    type="text"
                    value={numLicence}
                    onChange={(e) => setNumLicence(e.target.value)}
                    placeholder="Your veterinary license number"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
