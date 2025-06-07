"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Heart,
  MessageCircle,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useApiRequest } from "@/components/auth-provider";
import { useAuth } from "@/components/auth-provider";

type Veterinaire = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  adresse?: string | null;
  numLicence: string;
  specialites: string;
};

type Animal = {
  id: number;
  nom: string;
  espece: string;
  race: string;
  dateNaissance: Date;
  sexe: string;
};

export default function OwnerDashboard() {
  const { request } = useApiRequest();
  const { user } = useAuth();

  // States for pets
  const [pets, setPets] = useState<Animal[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);

  // States for veterinarians
  const [veterinarians, setVeterinarians] = useState<Veterinaire[]>([]);
  const [vetsLoading, setVetsLoading] = useState(true);

  // States for appointments (commented out but structure ready)
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      if (!user || !user.utilisateur_id) {
        setPetsLoading(false);
        return;
      }
      console.log("Fetching pets for user:", user.utilisateur_id);
      try {
        const response = await request(
          `/animal/mypets/${user.utilisateur_id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      } finally {
        setPetsLoading(false);
      }
    };

    fetchPets();
  }, [request, user]);

  // Fetch veterinarians
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await request("/utilisateurs/veterinaires", {
          method: "GET",
        });
        const data = await response.json();
        setVeterinarians(data);
      } catch (error) {
        console.error("Failed to fetch veterinarians:", error);
      } finally {
        setVetsLoading(false);
      }
    };

    fetchVets();
  }, [request]);

  // Fetch appointments (commented out)
  /*useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.utilisateur_id) {
        setAppointmentsLoading(false);
        return;
      }
      try {
        const response = await request(
          `/appointments/upcoming/${user.utilisateur_id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setUpcomingAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [request, user]);*/

  // Helper function to calculate age from birth date
  const calculateAge = (dateNaissance: Date) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Show loading state
  if (petsLoading || vetsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your pets.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-violet-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{pets.length}</p>
                <p className="text-gray-600">My Pets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {upcomingAppointments.length}
                </p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/owner/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Commented out appointments section as requested */}
            {/*upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.vetName}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.petName} • {appointment.date} at {appointment.time}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (}
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No upcoming appointments</p>
              <Button className="btn-primary" asChild>
                <Link href="/owner/book">Book Appointment</Link>
              </Button>
            </div>
            {/*)*/}
          </CardContent>
        </Card>

        {/* My Pets Quick View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Pets</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/owner/pets/add">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/owner/pets/${pet.id}`}
                    className="block"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{pet.nom}</p>
                        <p className="text-sm text-gray-600">
                          {pet.race} • {pet.espece}
                        </p>
                        <p className="text-xs text-gray-500">
                          {calculateAge(pet.dateNaissance)} years old •{" "}
                          {pet.sexe}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No pets registered yet</p>
                  <Button variant="outline" asChild>
                    <Link href="/owner/pets/add">Add Your First Pet</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Veterinarians */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Veterinarians</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {veterinarians.length > 0 ? (
              veterinarians.map((vet) => (
                <Card
                  key={vet.id}
                  className="hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {vet.prenom.charAt(0)}
                          {vet.nom.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Dr. {vet.prenom} {vet.nom}
                        </p>
                        <p className="text-sm text-gray-600">
                          {vet.specialites}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          License: {vet.numLicence}
                        </p>
                        {vet.telephone && (
                          <p className="text-xs text-gray-500">
                            {vet.telephone}
                          </p>
                        )}
                        <div className="mt-2">
                          <Button size="sm" className="text-xs" asChild>
                            <Link href={`/owner/book/${vet.id}`}>
                              Book Appointment
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No veterinarians available at the moment
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
