"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useParams } from "next/navigation";
type Disponibilite = {
  jourSemaine: string;
  heureDebut: string;
  heureFin: string;
  mode: string;
  disponible: boolean;
  estExceptionnelle: boolean;
  dateExceptionnelle: string;
};

type Animal = {
  id: number;
  nom: string;
  espece: string;
  race: string;
};


export default function RendezVousPage() {
    const { user, token } = useAuth();
const params = useParams();
const vetId = Number(params.id); // ici c’est bien "id" car ton dossier s'appelle [id]
  const proprietaireId = user?.id;

  const [step, setStep] = useState(1);
  const [type, setType] = useState<"inplace" | "online" | null>(null);
  const [dispos, setDispos] = useState<Disponibilite[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [motif, setMotif] = useState("");
  const [notes, setNotes] = useState("");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<number[]>([]);

  const [success, setSuccess] = useState<boolean | null>(null);

  // 1. Charger les disponibilités du vétérinaire
  useEffect(() => {
    fetch(`http://localhost:3001/disponibilites/veterinaire/${vetId}`)
      .then((res) => res.json())
      .then((data: Disponibilite[]) => {
        setDispos(data);
      });
  }, []);
  useEffect(() => {
    if (!proprietaireId) return;

    fetch(`http://localhost:3001/animal/mypets/${proprietaireId}`)
      .then((res) => res.json())
      .then((data: Animal[]) => setAnimals(data));
  }, [proprietaireId]);

  // 2. Filtrer les dates disponibles selon le type choisi
  useEffect(() => {
    if (!type || dispos.length === 0) return;

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const dates: string[] = [];

    for (
      let date = new Date(today);
      date <= nextMonth;
      date.setDate(date.getDate() + 1)
    ) {
      const isoDate = date.toISOString().split("T")[0];
      const jour = date.toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();

      const isAvailable = dispos.some((d) => {
        const matchMode =
          d.mode === "both" || d.mode === type;
        if (d.estExceptionnelle && d.dateExceptionnelle === isoDate) {
          return d.disponible && matchMode;
        } else {
          return d.jourSemaine.toLowerCase() === jour && d.disponible && matchMode;
        }
      });

      if (isAvailable) {
        dates.push(isoDate);
      }
    }

    setAvailableDates(dates);
  }, [type, dispos]);

  // 3. Charger les créneaux disponibles une fois la date choisie
  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:3001/rendezvous/creneaux-disponibles/${vetId}/${selectedDate}`)
        .then((res) => res.json())
        .then((data: string[]) => setSlots(data));
    }
  }, [selectedDate]);

  // 4. Créer le rendez-vous
const handleSubmit = async () => {
  const rdv = {
    date: selectedDate,
    heure: selectedSlot,
    motif,
    type,
    statut: "pending",
    notes,
    veterinaireId: vetId,
    proprietaireId,
  };

  const res = await fetch("http://localhost:3001/rendezvous", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rdv),
  });

  if (res.ok) {
    const created = await res.json(); // récupère le rendez-vous créé
    const rdvId = created.id;

    // Lier les animaux sélectionnés
    for (const animalId of selectedAnimalIds) {
      await fetch(`http://localhost:3001/rendezvous/${rdvId}/animal/${animalId}`, {
        method: "POST",
      });
    }

    setSuccess(true);
  } else {
    setSuccess(false);
  }
};


  return (
   <div className="max-w-xl mx-auto p-6">
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h1 className="text-2xl font-bold mb-4">Prendre un rendez-vous</h1>

    {step === 1 && (
      <div>
        <h2 className="text-lg font-semibold">1. Choisissez le type</h2>
        <div className="flex gap-4 mt-4">
          <button
            className={`px-4 py-2 border rounded ${type === "inplace" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => {
              setType("inplace");
              setStep(2);
            }}
          >
            Sur place
          </button>
          <button
            className={`px-4 py-2 border rounded ${type === "online" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => {
              setType("online");
              setStep(2);
            }}
          >
            En ligne
          </button>
        </div>
      </div>
    )}

    {step === 2 && (
      <div>
        <h2 className="text-lg font-semibold">2. Choisissez une date</h2>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {availableDates.map((date) => (
            <button
              key={date}
              className={`p-2 border rounded ${selectedDate === date ? "bg-blue-500 text-white" : ""}`}
              onClick={() => {
                setSelectedDate(date);
                setStep(3);
              }}
            >
              {new Date(date).toLocaleDateString("fr-FR")}
            </button>
          ))}
        </div>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => setStep(1)}
        >
          ← Retour
        </button>
      </div>
    )}

    {step === 3 && selectedDate && (
      <div>
        <h2 className="text-lg font-semibold">3. Choisissez un créneau</h2>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {slots.map((slot) => (
            <button
              key={slot}
              className={`p-2 border rounded ${selectedSlot === slot ? "bg-blue-500 text-white" : ""}`}
              onClick={() => {
                setSelectedSlot(slot);
                setStep(4);
              }}
            >
              {slot}
            </button>
          ))}
        </div>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => setStep(2)}
        >
          ← Retour
        </button>
      </div>
    )}

    {step === 4 && selectedSlot && (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">4. Confirmez</h2>

        {/* Animal selection */}
        <div>
          <label className="block font-medium mb-2">Sélectionnez les animaux</label>
          <div className="space-y-2">
            {animals.map((animal) => (
              <label key={animal.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAnimalIds.includes(animal.id)}
                  onChange={() => {
                    setSelectedAnimalIds((prev) =>
                      prev.includes(animal.id)
                        ? prev.filter((id) => id !== animal.id)
                        : [...prev, animal.id]
                    );
                  }}
                />
                {animal.nom} ({animal.espece} - {animal.race})
              </label>
            ))}
          </div>
        </div>

        {/* Motif */}
        <div>
          <label className="block font-medium">Motif</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium">Notes (facultatif)</label>
          <textarea
            className="w-full border p-2 rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleSubmit}
          >
            Confirmer le rendez-vous
          </button>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setStep(3)}
          >
            ← Retour
          </button>
        </div>

        {/* Feedback */}
        {success === true && (
          <p className="text-green-600 mt-2">✅ Rendez-vous créé avec succès !</p>
        )}
        {success === false && (
          <p className="text-red-600 mt-2">❌ Une erreur s'est produite.</p>
        )}
      </div>
    )}
  </div>
</div>
  );
}
